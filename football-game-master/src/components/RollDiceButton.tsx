import React from 'react';

type RollDiceButtonProps = { //nOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    onRoll: (a : any) => void;
};

export const RollDiceButton: React.FC<RollDiceButtonProps> = ({ onRoll }) => (
    <button onClick={onRoll}>Roll Dice 🎲</button>
);
