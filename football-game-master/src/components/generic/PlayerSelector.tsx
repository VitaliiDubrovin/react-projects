import React, { useState, useEffect } from 'react';
import { TeamSelector } from './TeamSelector';
import {Player, Team} from '../../types/types';

type PlayerSelectorProps = {
    text: string;
    disabled?: boolean;
    selectedPlayer: Player | null;
    onSelect: (player: Player) => void;
};

export const PlayerSelector: React.FC<PlayerSelectorProps> = ({ text, selectedPlayer, disabled, onSelect }) => {
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);

    useEffect(() => {
        if (selectedTeam) {
            setAvailablePlayers(selectedTeam.players);
        } else {
            setAvailablePlayers([]);
        }
    }, [selectedTeam]);

    return (
        <div>
            {text}:
            <TeamSelector
                selectedTeam={selectedTeam}
                onSelect={setSelectedTeam}
                disabled={disabled}
            />
            {selectedTeam && (
                <label>
                    <select
                        value={selectedPlayer ? selectedPlayer.id : ''}
                        disabled={disabled}
                        onChange={(e) => onSelect(availablePlayers.find(p => p.id === parseInt(e.target.value)) as Player)}
                    >
                        <option value="">Select Player</option>
                        {availablePlayers.map(player => (
                            <option key={player.id} value={player.id}>({player.number}) {player.name}</option>
                        ))}
                    </select>
                </label>
            )}
        </div>
    );
};
