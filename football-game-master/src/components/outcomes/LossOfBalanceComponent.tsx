import {Player} from '../../types/types';
import React from 'react';

export const LossOfBalanceComponent: React.FC<{ defender: Player, threshold: number }> = ({ defender, threshold }) => {
    const fell = defender.Physique < threshold;
    return (
        <div>
            {/*<h4>Loss of Balance</h4> TODO show result in h4*/}
            <p>Defender Physique ({defender.Physique})  {!fell ? '≥' : ' <'} Threshold ({threshold})</p>
            {fell ? <p>The defender fell until the next played token.</p> : <p>The defender did not fall.</p>}
        </div>
    );
};