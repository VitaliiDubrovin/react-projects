import React from 'react';
import {matchData} from '../../data/players';
import {Team} from '../../types/types';

type TeamSelectorProps = {
    selectedTeam: Team | null;
    disabled?: boolean;
    onSelect: (team: Team) => void;
};

export const TeamSelector: React.FC<TeamSelectorProps> = ({ selectedTeam, disabled, onSelect }) => (
    <label>
        <select
            value={selectedTeam ? selectedTeam.type : ''}
            disabled={disabled}
            onChange={(e) => onSelect(matchData.teams.find(p => p.type === e.target.value) as Team)}
        >
            <option value="">Select Team</option>
            {matchData.teams.map(team => (
                <option key={team.type} value={team.type}>{team.name}</option>
            ))}
        </select>
    </label>
);