import React, { useState } from 'react';
import { PlayerSelector } from '../generic/PlayerSelector';
import { rollDice } from '../../utility/diceUtils';
import { Player, OutcomeChartElement } from '../../types/types';
import { FOUL_OUTCOMES } from '../../records/foulOutcomes';
import { OutcomeResultType } from '../../types/enums';

type FoulingComponentProps = {
    player?: Player;
    isInsideGoalZone?: boolean;
};

const FoulComponent: React.FC<FoulingComponentProps> = ({ player, isInsideGoalZone }) => {
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(player || null);
    const [checkIsInsideGoalZone, setCheckIsInsideGoalZone] = useState<boolean>(false);
    const [diceRoll, setDiceRoll] = useState<number | null>(null);
    const [foulOutcome, setFoulOutcome] = useState<OutcomeChartElement | null>(null);

    const handleRollDice = () => {
        const roll = rollDice();
        setDiceRoll(roll);
        setFoulOutcome(null);

        const outcome : OutcomeChartElement = FOUL_OUTCOMES[roll];
        const modifiedResults = outcome.results.map((result: any) => {
            if (result.type === OutcomeResultType.Foul) {
                const insideGoalZone = isInsideGoalZone|| checkIsInsideGoalZone;
                return {
                    ...result,
                    type:  insideGoalZone ? OutcomeResultType.Penalty : OutcomeResultType.FreeKick,
                    text:  insideGoalZone ? 'Penalty awarded.' : 'Free kick awarded.'
                };
            }
            return result;
        });

        setFoulOutcome({ ...outcome, results: modifiedResults });
    };

    return (
        <div>
            {!player ? (
                <>
                    <h2>Foul Component</h2>
                    <PlayerSelector text={'Select fouling player'} selectedPlayer={selectedPlayer} onSelect={setSelectedPlayer} disabled={foulOutcome !== null} />
                </>
            ) : <h4>Foul</h4>}
            { !isInsideGoalZone &&(
                    <>
                        <br />
                        <label>
                        Is Inside Goal Zone:
                        <input
                        type="checkbox"
                        checked={checkIsInsideGoalZone}
                        onChange={(e) => setCheckIsInsideGoalZone(e.target.checked)}
                        />
                        </label>
                    </>
                )
            }
            <br/>
            <button onClick={handleRollDice} disabled={!!diceRoll || !selectedPlayer}>Roll Dice 🎲</button>
            {diceRoll !== null && (
                <>
                    <p>🎲 Dice Roll: {diceRoll}</p>
                    {foulOutcome && (
                        <>
                            <h3>{foulOutcome.title}</h3>
                            <p>{foulOutcome.text}</p>
                            {foulOutcome.results.map((result: any, index: number) => (
                                <p key={index}>{result.text || result.type}</p>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default FoulComponent;
