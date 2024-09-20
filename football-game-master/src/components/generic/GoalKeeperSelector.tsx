import React, { useEffect, useState } from 'react';
import {Player, Team} from '../../types/types';
import { TeamSelector } from './TeamSelector';

type GoalkeeperSelectorProps = {
    text: string;
    selectedGoalkeeper: Player | null; //bad practice
    team?: Team; //TODO pass this
    disabled?: boolean;
    onSelect: (goalkeeper: Player | null) => void;
};

export const GoalkeeperSelector: React.FC<GoalkeeperSelectorProps> = ({ text,selectedGoalkeeper, team, disabled, onSelect }) => {
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(team || null);

    useEffect(() => {
        if (selectedTeam) {
            onSelect(selectedTeam.players.find(p => p.isGoalKeeper)!);
        } else {
            onSelect(null);
        }
    }, [selectedTeam, onSelect]);

    return (
        <div>
            {!team && (
                <>
                    {text}:
                    <TeamSelector
                        selectedTeam={selectedTeam}
                        onSelect={setSelectedTeam}
                        disabled={disabled}
                    />
                </>
            )}
            {selectedTeam && selectedGoalkeeper && (
                <label>
                    Selected goalkeeper: {selectedGoalkeeper.name}
                </label>
            )}
        </div>
    );
};
