import React, {useEffect, useState} from 'react';
import { PlayerSelector } from './generic/PlayerSelector';
import { rollDice } from '../utility/diceUtils';
import {Player, OutcomeChartElement, OutcomeResult} from '../types/types';
import { BLOCK_OUTCOMES } from '../records/blockOutcomes';
import { DeflectionComponent } from './outcomes/DeflectionComponent';
import { OutcomeResultType, DeflectionType } from '../types/enums';
import { clampDiced } from '../utility/sharedFunctions';
import { LossOfBalanceComponent } from './outcomes/LossOfBalanceComponent';
import { InjuryComponent } from './outcomes/InjuryComponent';
import { HeadedClearanceComponent } from './outcomes/HeadedClearanceComponent';
import FoulComponent from './outcomes/FoulComponent';

type BlockingComponentProps = {
    attacker?: Player;
    setGoToSaving?: React.Dispatch<React.SetStateAction<boolean>>,
};

type BlockingResult = {
    outcome: OutcomeChartElement,
    calculationResult: number | null,
    formula: string | null,
}

const calculateBlockResult = (defender: Player, attacker: Player, diceRoll: number): BlockingResult => {
    if (diceRoll === 1 || diceRoll === 12) {
        return {
            outcome: BLOCK_OUTCOMES[diceRoll],
            calculationResult: diceRoll,
            formula: null
        };
    }

    const defenseValue = defender.Defense;
    const shootingValue = attacker.Shooting;
    const resultValue = clampDiced(diceRoll + defenseValue - shootingValue);

    return {
        outcome: BLOCK_OUTCOMES[resultValue],
        calculationResult: resultValue,
        formula: `Dice Roll (${diceRoll}) + Defender Defense Skill (${defenseValue}) - Attacker Shooting Skill (${shootingValue})`,
    }
};

export const BlockingComponent: React.FC<BlockingComponentProps> = ({ attacker, setGoToSaving }) => {
    const [selectedDefender, setSelectedDefender] = useState<Player | null>(null);
    const [selectedAttacker, setSelectedAttacker] = useState<Player | null>(attacker || null);
    const [blockResult, setBlockResult] = useState<BlockingResult | null>(null);
    const [noBlocker, setNoBlocker] = useState<boolean>(false);
    const [diceRoll, setDiceRoll] = useState<number | null>(null);

    const handleRollDice = () => { //TODO unify dice rolls buttons and make them testable (as a selector just for test)
        const roll = rollDice();
        setDiceRoll(roll);
        const result: BlockingResult = calculateBlockResult(selectedDefender!, selectedAttacker!, roll);
        setBlockResult(result);
    };

    const handleNoBlock = () => {
        setNoBlocker(true);
    }

    useEffect(() => {
        if (setGoToSaving && (noBlocker || (blockResult && blockResult.outcome.results.some(result => result.type === OutcomeResultType.BlockFailed)))) {
            setGoToSaving(true);
        }
    }, [noBlocker, blockResult]);

    const renderOutcomeResult = (result: OutcomeResult) => {
        switch (result.type) {
            case OutcomeResultType.HandBall:
                return <FoulComponent player={selectedDefender!} isInsideGoalZone={true} />; // TODO: change this when adding zones
            case OutcomeResultType.LossOfBalance:
                return <LossOfBalanceComponent defender={selectedDefender!} threshold={result.threshold!} />;
            case OutcomeResultType.Injury:
                return <InjuryComponent player={selectedDefender!} threshold={result.threshold!} />;
            case OutcomeResultType.HeadedClearance:
                return <HeadedClearanceComponent defender={selectedDefender!} threshold={result.threshold!} lastPlayerTouchingBall={selectedDefender!} />;
            case OutcomeResultType.Deflection:
                return <DeflectionComponent deflectionType={DeflectionType.LooseBall} lastPlayerTouchingBall={selectedDefender!} />;
            case OutcomeResultType.ControlledBall:
                return <p>The defender controlled the ball and is ready to start a new attack.</p>;
            case OutcomeResultType.Catch:
                return <p>The goalkeeper have the ball in his hands and can start a new attacks.</p>;
            case OutcomeResultType.BlockFailed:
                return <p>The shot passed the defender and is reaching the goal.</p>;
            default:
                return null;
        }
    };

    return (
        <>
            {!attacker ? <h2>Blocking Component</h2>: <h4> Blocking Possibility?</h4> }
            <PlayerSelector text={'Select Blocker'} selectedPlayer={selectedDefender} onSelect={setSelectedDefender} disabled={blockResult !== null  || noBlocker}/>
            {!attacker &&
                <PlayerSelector text={'Select Shooter'} selectedPlayer={selectedAttacker} onSelect={setSelectedAttacker} disabled={blockResult !== null || noBlocker}/>
            }
            <br/>
            <button onClick={handleRollDice} disabled={!!blockResult || !(selectedDefender && selectedAttacker) }>Roll Dice 🎲</button>
            <button onClick={handleNoBlock}  disabled={!!blockResult || !!selectedDefender || noBlocker}>No block ❌</button>
            { blockResult && (
                <>
                    <p>🎲 Dice Roll: {diceRoll}</p>
                    { blockResult.formula && blockResult.calculationResult && (
                        <p>Formula: {blockResult.formula} = {blockResult.calculationResult}</p>
                    )}
                    <h4>{blockResult.calculationResult} : {blockResult.outcome.title}</h4>
                    <p>{blockResult.outcome.text}</p>
                    {blockResult.outcome.results.map((result) => (
                        <div key={result.type}>
                            <h4>{result.type}</h4>
                            {renderOutcomeResult(result)}
                        </div>
                    ))}
                </>
            )}
            {noBlocker && (
                <h4>Ball Not Blocked</h4>
            )}
        </>
    );
};

export default BlockingComponent;
