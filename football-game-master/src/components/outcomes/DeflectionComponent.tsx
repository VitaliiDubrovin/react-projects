import React, {useEffect, useState} from 'react';
import {MIN_DICE_VALUE, rollDice, SECOND_DICE_VALUE} from '../../utility/diceUtils';
import {DeflectionType, OutcomeResultType} from '../../types/enums';
import {DEFLECTION_OUTCOMES} from '../../records/deflectionOutcomes';
import OutOfBoundsBallComponent from './OutOfBoundsBallComponent';
import {Player} from '../../types/types';
import {PlayerSelector} from '../generic/PlayerSelector';

type DeflectionProps = {
    deflectionDistance?: number;
    deflectionType?: DeflectionType;
    lastPlayerTouchingBall?: Player;
};

/**
 *
 * @types
 *     Out = 'Out of closest line',
 *     TopLeft = 'Top Left (Cell 3)',
 *     Top = 'Top (Cell 4)',
 *     TopRight = 'Top Right (Cell 5)',
 *     Left = 'Left (Cell 6)',
 *     NoDeflection = 'No deflection (Cell 7)',
 *     Right = 'Right (Cell 8)',
 *     BottomLeft = 'Bottom Left (Cell 9)',
 *     Bottom = 'Bottom (Cell 10)',
 *     BottomRight = 'Bottom Right (Cell 11)',
 *     Corner = 'Corner',
 *     Goal = 'Goal',
 */
export const DeflectionComponent: React.FC<DeflectionProps> = ({ deflectionDistance, deflectionType, lastPlayerTouchingBall }) => {
    const [localDeflectionType, setLocalDeflectionType] = useState<DeflectionType>(deflectionType || DeflectionType.LooseBall);
    const [deflectionDirection, setDeflectionDirection] = useState<number | null>(null);
    const [selectedLastPlayerTouchingBall, setSelectedLastPlayerTouchingBall] = useState<Player | null>(lastPlayerTouchingBall || null);
    const [distanceRoll, setDistanceRoll] = useState<number | null>(null);
    const [outcome, setOutcome] = useState<OutcomeResultType | null>(null);

    const handleRollDiceDeflection = () => {
        const directionRoll = rollDice();
        setDeflectionDirection(directionRoll);

        const result = DEFLECTION_OUTCOMES[localDeflectionType][directionRoll];

        if (directionRoll === MIN_DICE_VALUE || directionRoll === SECOND_DICE_VALUE || result.includes(OutcomeResultType.NoDeflection)
            || result.includes(OutcomeResultType.Corner) || result.includes(OutcomeResultType.Out)) {
            setDistanceRoll(null);
        } else if (!deflectionDistance) {
            const distanceRoll = rollDice();
            setDistanceRoll(distanceRoll);
        }
        setOutcome(result);
    };

    useEffect(() => {
        if (deflectionType && !deflectionDirection) {
            handleRollDiceDeflection();
        }
    }, [deflectionDistance, deflectionType, deflectionDirection])

    return (
        <div>
            { !deflectionType ? (
                <>
                    <h2>Deflection Component</h2>
                    { !lastPlayerTouchingBall && (
                        <div>
                            <PlayerSelector text={'Last player touching ball: '} selectedPlayer={selectedLastPlayerTouchingBall} onSelect={setSelectedLastPlayerTouchingBall} disabled={!!deflectionDirection}/>
                        </div>
                    )}
                    <label>
                        Deflection Type:
                        <select value={localDeflectionType} onChange={(e) => setLocalDeflectionType(e.target.value as DeflectionType)} disabled={!!deflectionDirection}>
                            <option value={DeflectionType.LooseBall}>Loose Ball</option>
                            <option value={DeflectionType.RightBar}>Right Bar</option>
                            <option value={DeflectionType.LeftBar}>Left Bar</option>
                            <option value={DeflectionType.TopBar}>Top Bar</option>
                        </select>
                    </label>
                    <br />
                    <button onClick={handleRollDiceDeflection} disabled={!selectedLastPlayerTouchingBall || !!deflectionDirection}>Roll Dice 🎲</button>
                </>
            ) : <h4>Deflection!</h4>}
            {deflectionDirection && (
                <div>
                    {deflectionDistance && (<h4>{localDeflectionType} :</h4>)}
                    <p>🎲 Deflection Direction Dice Roll: {deflectionDirection} </p>
                    <p>Outcome: {outcome}</p>
                    {distanceRoll && (
                        <p>Deflection Distance Roll: {distanceRoll}</p>
                    )}
                    {deflectionDistance  && (
                        <p>Deflection Calculated Distance: {deflectionDistance}</p>
                    )}
                    {
                        outcome !== OutcomeResultType.NoDeflection && (//todo add here deflection toward goal
                            <OutOfBoundsBallComponent
                                type={outcome === OutcomeResultType.Corner ? OutcomeResultType.Corner : undefined}
                                lastPlayerTouchingBall = {selectedLastPlayerTouchingBall!}
                                ballPositionUnknown = {outcome !== OutcomeResultType.Corner && outcome !== OutcomeResultType.Out}
                            />
                        )
                    }
                </div>
            )}
        </div>
    );
};
