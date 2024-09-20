import React, {useCallback, useState} from 'react';
import {matchData} from '../../data/players';
import {Player} from '../../types/types';
import {OutcomeResultType} from '../../types/enums';
import {PlayerSelector} from '../generic/PlayerSelector';

type OutOfBoundsBallComponentProps = {
    type?: OutcomeResultType;
    lastPlayerTouchingBall?: Player;
    ballPositionUnknown?: boolean;
};

/**
 *
 * @types
 * OutcomeResultType.BallInField
 * OutcomeResultType.Corner
 * OutcomeResultType.ThrowIn
 * OutcomeResultType.GoalKick
 */
const OutOfBoundsBallComponent: React.FC<OutOfBoundsBallComponentProps> = ({ type, lastPlayerTouchingBall, ballPositionUnknown }) => {
    const [selectedType, setSelectedType] = useState<OutcomeResultType | null>(type || null);
    const [selectedLastPlayerTouchingBall, setSelectedLastPlayerTouchingBall] = useState<Player | null>(lastPlayerTouchingBall || null);
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);

    const findSelectedLastTeamTouchingBall = useCallback((player: Player) => {
        return matchData.teams.find(team => team.type === player?.team)!;
    }, [selectedLastPlayerTouchingBall, matchData.teams]);


    const handleTypeChange = (type: OutcomeResultType) => {
        setSelectedType(type);
        setButtonClicked(true);
    };

    const possibleOutcomes = [OutcomeResultType.GoalKick, OutcomeResultType.ThrowIn, OutcomeResultType.Corner]
        .filter(outcome => outcome || type === outcome);

    return (
        <div>
            { !lastPlayerTouchingBall && (
                <>
                    <PlayerSelector
                        text={'Last player touching ball'}
                        selectedPlayer={selectedLastPlayerTouchingBall!} onSelect={setSelectedLastPlayerTouchingBall} disabled={buttonClicked}/>
                </>
            )}
            { !type && (
                <>
                    { ballPositionUnknown && (
                        <>
                            <button onClick={() => handleTypeChange(OutcomeResultType.BallInField)} disabled={!selectedLastPlayerTouchingBall || buttonClicked}>Not Out</button>
                        </>
                    )}
                    { possibleOutcomes.map(outcome => <button key={outcome} onClick={() => handleTypeChange(outcome)}  disabled={!selectedLastPlayerTouchingBall || buttonClicked}>{outcome}</button>) }
                </>
            )}
            {selectedType && selectedLastPlayerTouchingBall && (
                <div>
                    { selectedType === OutcomeResultType.BallInField ? (
                        <p>Ball is still in the field, continue playing</p>
                    ) : (
                        <>
                            <h4>{selectedType}</h4>
                            <p>Player {selectedLastPlayerTouchingBall.name} from team {findSelectedLastTeamTouchingBall(selectedLastPlayerTouchingBall).name} sent ball out, other team Benefits from a {selectedType}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default OutOfBoundsBallComponent;
