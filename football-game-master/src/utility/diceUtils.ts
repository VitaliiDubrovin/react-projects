export const MAX_DICE_VALUE = 12;
export const UNLUCKY_DICE_VALUE = 10;
export const EIGHTH_DICE_VALUE = 8;
export const NEUTRAL_DICE_VALUE = 7;
export const LUCKY_DICE_VALUE = 4;
export const THIRD_DICE_VALUE = 3;
export const SECOND_DICE_VALUE = 2;
export const MIN_DICE_VALUE = 1;

export const rollDice = (): number => Math.floor(Math.random() * 12) + 1;
