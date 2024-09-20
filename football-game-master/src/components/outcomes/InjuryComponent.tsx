import {Player} from '../../types/types';
import React from 'react';

export const InjuryComponent: React.FC<{ player: Player, threshold: number }> = ({ player, threshold }) => {
    const injured = player.Physique < threshold;
    return (
        <div>
            <h4>Injury</h4>
            <p>Defender Physique ({player.Physique}) {!injured ? '≥' : ' <'}Threshold ({threshold})</p>
            {injured ? <p>Player {player.name} is injured.</p> : <p>Player {player.name} is not injured.</p>}
        </div>
    );
};

