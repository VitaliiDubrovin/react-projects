import React from 'react';
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './PlayerSelectionUIComponent.scss';

interface Player {
    id: string;
    number: string;
    name: string;
}

interface PlayerContainerProps {
    id: string;
    players: Player[];
    onDrop: (player: Player, containerId: string) => void;
    movePlayer: (draggedId: string, hoverId: string) => void;
}

interface PlayerProps {
    player: Player;
    movePlayer: (draggedId: string, hoverId: string) => void;
}

const ItemType = {
    PLAYER: 'player',
};

const initialPlayers : Record<string, Player[]>  = {
    goal: [{ id: '1', number: '1', name: 'Hart' }],
    defense: [
        { id: '2', number: '2', name: 'Walker' },
        { id: '5', number: '5', name: 'Cahill' },
        { id: '6', number: '6', name: 'Stones' },
        { id: '3', number: '3', name: 'Rose' },
    ],
    midfield: [
        { id: '8', number: '8', name: 'Henderson' },
        { id: '4', number: '4', name: 'Dier' },
        { id: '10', number: '10', name: 'Rooney' },
    ],
    attack: [
        { id: '7', number: '7', name: 'Sterling' },
        { id: '9', number: '9', name: 'Kane' },
        { id: '11', number: '11', name: 'Lallana' },
    ],
    subs: [
        { id: '12', number: '12', name: 'Smalling' },
        { id: '13', number: '13', name: 'Heaton' },
        { id: '14', number: '14', name: 'Walcott' },
        { id: '15', number: '15', name: 'Sturridge' },
        { id: '16', number: '16', name: 'Jagielka' },
        { id: '18', number: '18', name: 'Drinkwater' },
        { id: '20', number: '20', name: 'Alli' },
    ],
};

const MAX_PLAYERS: Record<string, number> = {
    goal: 1,
    defense: 5,
    midfield: 5,
    attack: 4,
};

const PlayerSelectionUIComponent: React.FC = () => {
    const [players, setPlayers] = React.useState<Record<string, Player[]>>(initialPlayers);

    const movePlayer = (draggedId: string, hoverId: string) => {
        const updatedPlayers = { ...players };

        for (const key in updatedPlayers) {
            const container = updatedPlayers[key as keyof typeof updatedPlayers];
            const draggedPlayerIndex = container.findIndex((player) => player.id === draggedId);
            const hoverPlayerIndex = container.findIndex((player) => player.id === hoverId);

            if (draggedPlayerIndex !== -1 && hoverPlayerIndex !== -1) {
                const [draggedPlayer] = container.splice(draggedPlayerIndex, 1);
                container.splice(hoverPlayerIndex, 0, draggedPlayer);
                setPlayers(updatedPlayers);
                break;
            }
        }
    };

    const onDrop = (player: Player, containerId: string) => {
        const allPlayers = { ...players };
        if (allPlayers[containerId].length >= MAX_PLAYERS[containerId]) {
            return; // Prevent the move if the limit is reached
        }
        let updatedPlayer;
        for (const key in allPlayers) {
            const container = allPlayers[key as keyof typeof allPlayers];

            const playerIndex = container.findIndex((p) => p.id === player.id);
            if (playerIndex !== -1) {
                // Remove the player from current container
                updatedPlayer = container[playerIndex]
                container.splice(playerIndex, 1);
            }
        }
        // Push the player into the target container
        allPlayers[containerId as keyof typeof allPlayers].push(updatedPlayer!);
        setPlayers(allPlayers);
    };


    return (
        <DndProvider backend={HTML5Backend}>
            <div className="pitch">
                <h2 className="help">Drag and drop players</h2>
                {['attack', 'midfield', 'defense', 'goal'].map((section) => (
                    <PlayerContainer key={section} id={section} players={players[section]} onDrop={onDrop} movePlayer={movePlayer} />
                ))}
            </div>
            <div className="bench">
                <h2 className="help">Subs</h2>
                <PlayerContainer id="subs" players={players.subs} onDrop={onDrop} movePlayer={movePlayer} />
            </div>
        </DndProvider>
    );
};


const Player: React.FC<PlayerProps> = ({ player, movePlayer }) => {
    const ref = React.useRef<HTMLLIElement>(null);
    const [{ isDragging }, drag] = useDrag({
        type: ItemType.PLAYER,
        item: { id: player.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemType.PLAYER,
        hover: (draggedItem: Player) => {
            if (draggedItem.id !== player.id) {
                movePlayer(draggedItem.id, player.id);
            }
        },
    });

    drag(drop(ref));

    return (
        <li ref={ref} id={`${player.id === '1' ? 'goal' : ''}`} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <span className="number">{player.number}</span>
            <span className="name">{player.name}</span>
        </li>
    );
};

const PlayerContainer: React.FC<PlayerContainerProps> = ({ id, players, onDrop, movePlayer }) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: ItemType.PLAYER,
        drop: (item: Player) => onDrop(item, id),
        collect: (monitor: DropTargetMonitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop() && players?.length < MAX_PLAYERS[id],
        }),
    });

    const isActive = canDrop && isOver;

    return (
        <ul ref={drop} className={`container ${isActive ? 'active' : ''}`}>
            {players.map((player) => (
                <Player key={player.id} player={player} movePlayer={movePlayer} />
            ))}
        </ul>
    );
};


export default PlayerSelectionUIComponent;
