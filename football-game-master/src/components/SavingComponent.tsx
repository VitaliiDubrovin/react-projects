import React, {useCallback, useEffect, useState} from 'react';
import { PlayerSelector } from './generic/PlayerSelector';
import { rollDice } from '../utility/diceUtils';
import {Player, OutcomeChartElement, OutcomeResult} from '../types/types';
import {DeflectionType, OutcomeResultType, PlayerStat} from '../types/enums';
import { SAVING_OUTCOMES } from '../records/savingOutcomes';
import { DeflectionComponent } from './outcomes/DeflectionComponent';
import { InjuryComponent } from './outcomes/InjuryComponent';
import {GoalkeeperSelector} from './generic/GoalKeeperSelector';
import OutOfBoundsBallComponent from './outcomes/OutOfBoundsBallComponent';

type SavingComponentProps = {
    attacker?: Player;
    goalkeeper?: Player;
    goalkeeperFalling?: boolean;
};

const calculateSaveResult = (goalkeeper: Player, attacker: Player, diceRoll: number, goalKeeperDistance: number) => {
    const savingValue = goalkeeper.Saving;
    const shootingValue = attacker.Shooting;
    const resultValue = diceRoll + savingValue - goalKeeperDistance - shootingValue;

    return {saveResult : resultValue, outcome:  SAVING_OUTCOMES[resultValue]};
};

export const SavingComponent: React.FC<SavingComponentProps> = ({ attacker: initialAttacker, goalkeeper: initialGoalkeeper, goalkeeperFalling: initialGoalkeeperFalling }) => {
    const [selectedAttacker, setSelectedAttacker] = useState<Player | null>(initialAttacker || null);
    const [selectedGoalkeeper, setSelectedGoalkeeper] = useState<Player | null>(initialGoalkeeper || null);
    const [diceRoll, setDiceRoll] = useState<number | null>(null);
    const [goalKeeperDistance, setGoalKeeperDistance] = useState<number>(0);
    const [goalKeeperFalling, setGoalKeeperFalling] = useState<boolean>(!!initialGoalkeeperFalling);
    const [saveOutcome, setSaveOutcome] = useState<OutcomeChartElement | null>(null);
    const [saveResult, setSaveResult] = useState<number | null>(null);

    const checkResultThreshold = useCallback((statName: PlayerStat,threshold: number) => {
        return diceRoll! + selectedGoalkeeper![statName] >= threshold;
    }, [diceRoll, selectedGoalkeeper]);

    const handleRollDice = () => {
        const roll = rollDice();
        setDiceRoll(roll);
        setSaveOutcome(null);
        setSaveResult(null)

        if (goalKeeperDistance > 2 || goalKeeperFalling) { //TODO change goalkeeper on floor outcome (maybe can save just his cell)
            setSaveOutcome({
                title: "Goal",
                text: `The goalkeeper is ${ goalKeeperDistance > 2 ? 'very far' : 'on the floor' },he can't save the ball, The ball goes into the goal.`,
                results: [{ type: OutcomeResultType.Goal }]
            });
        } else {
            const { saveResult , outcome }= calculateSaveResult(selectedGoalkeeper!, selectedAttacker!, roll, goalKeeperDistance);
            setSaveOutcome(outcome);
            setSaveResult(saveResult);
        }
    };

    const renderOutcomeResult = (result: OutcomeResult, resultType: OutcomeResultType) => {
        switch (resultType) {
            case OutcomeResultType.Deflection:
                return (
                    <DeflectionComponent
                        deflectionType={DeflectionType.LooseBall}
                        lastPlayerTouchingBall={selectedGoalkeeper! as Player}
                    />
                );
            case OutcomeResultType.Goal:
                return <h4>Goal!</h4>;
            case OutcomeResultType.Injury:
                return <InjuryComponent player={selectedGoalkeeper!} threshold={result.threshold!} />;
            case OutcomeResultType.Corner:
                return <OutOfBoundsBallComponent type={OutcomeResultType.Corner} lastPlayerTouchingBall={selectedGoalkeeper!}/>;
            case OutcomeResultType.Catch:
                return <h4>Catch!</h4>;
            default:
                return null;
        }
    };

    //TODO select goalkeeper automatically just by selecting attacker? (except in deflcetion)
    return (
        <div>
            <>
                {!initialAttacker ? (
                    <div>
                        <h2>Saving Component</h2>
                        <PlayerSelector text={'Select Shooter'} selectedPlayer={selectedAttacker} onSelect={setSelectedAttacker} />
                    </div>
                ) : <h4>Saving possibility?</h4>}
                {!initialGoalkeeper && (
                    <div>
                        <GoalkeeperSelector text={`Select Goalkeeper`} selectedGoalkeeper={selectedGoalkeeper} onSelect={setSelectedGoalkeeper} />
                    </div>
                )}
                <div>
                    Goalkeeper Distance from Ball Trajectory (max 2):
                    <input
                        type="number"
                        value={goalKeeperDistance}
                        onChange={(e) => setGoalKeeperDistance(Number(e.target.value))}
                    />
                </div>
                <div>
                    Goalkeeper Falling:
                    <input
                        type="checkbox"
                        checked={goalKeeperFalling}
                        onChange={(e) => setGoalKeeperFalling(e.target.checked)}
                    />
                </div>
            </>
            <button onClick={handleRollDice} disabled={!selectedAttacker || !selectedGoalkeeper || !!saveOutcome}>Roll Dice 🎲</button>
            {diceRoll !== null && saveOutcome  && (
                <>
                    <p>🎲 Dice Roll: {diceRoll}</p>
                    <>
                        {
                            saveResult !== null && (
                                <p>Formula: {diceRoll} (Dice Roll) + {selectedGoalkeeper!.Saving} (Saving) - {goalKeeperDistance} (Distance) - {selectedAttacker!.Shooting} (Shooting) = {saveResult}</p>
                            )
                        }
                        <h4>{saveResult} -  {saveOutcome.title}</h4>
                        <p>{saveOutcome.text}</p>
                        {saveOutcome.results.map((result: OutcomeResult, index) => (
                            <div key={index}>
                                {result.consequence && result.threshold && result.statName ?
                                    <p>
                                        {`diceRoll (${diceRoll}) + Goalkeeper's ${result.statName} (${selectedGoalkeeper![result.statName]}) ${checkResultThreshold(result.statName, result.threshold) ? '≥' : ' <'} threshold (${result.threshold})`}
                                        {checkResultThreshold(result.statName, result.threshold) ? renderOutcomeResult(result, result.type) : renderOutcomeResult(result, result.consequence)}
                                    </p> :
                                    renderOutcomeResult(result, result.type)
                                }
                            </div>
                        ))}
                    </>
                </>
            )}
        </div>
    );
};
