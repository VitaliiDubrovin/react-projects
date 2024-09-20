import React, { useState } from 'react';
import { PlayerSelector } from './generic/PlayerSelector';
import {DeflectionComponent} from './outcomes/DeflectionComponent';
import {Player} from '../types/types';
import { MAX_DICE_VALUE, MIN_DICE_VALUE, rollDice} from '../utility/diceUtils';
import {clampDiced} from '../utility/sharedFunctions';
import {DeflectionType} from '../types/enums';

const MIN_SUCCESS_RESULT = 6;
const NORMAL_PASS_DISTANCE_UNIT = 6;
const HEADER_PASS_DISTANCE_UNIT = 3;
const MAX_HEADER_PASS_DISTANCE = 12;
const PASS_TURN_PENALTY = 1;
const HEADER_TURN_PENALTY = 2;

const NORMAL_PASS_DISTANCE_COEFFICIENTS = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //TODO change to quadrons
const HEADER_PASS_DISTANCE_COEFFICIENTS = [2, 3, 4, 5, 6];

const adjustDistance = (distance: number, isHeader: boolean, didTurn: boolean) => {
    const newDistance = distance  + (didTurn ? (isHeader ? PASS_TURN_PENALTY : HEADER_TURN_PENALTY) : 0);
    return isHeader ? Math.min(newDistance, MAX_HEADER_PASS_DISTANCE): newDistance;
}

const getDistanceCoefficient = (distance: number, isHeader: boolean, didTurn: boolean): number => {
    const coefficients = isHeader ? HEADER_PASS_DISTANCE_COEFFICIENTS : NORMAL_PASS_DISTANCE_COEFFICIENTS;
    const adjustedDistance = adjustDistance(distance, isHeader, didTurn);
    const unit = isHeader ? HEADER_PASS_DISTANCE_UNIT : NORMAL_PASS_DISTANCE_UNIT;
    const index = Math.min(Math.floor(adjustedDistance / unit), coefficients.length-1);
    return coefficients[index];
};

type CalculationResult = {
    result: number;
    diceRoll: number;
    distanceCoeff: number;
    passSuccessful: boolean;
    deflectionDistance: number;
    formula: string;
    coeffFormula: string;
};

const calculateResult = (
    player: Player,
    distance: number,
    isHeader: boolean,
    didTurn: boolean,
    diceRoll: number
): CalculationResult => {
    let deflectionDistance = 0;

    const distanceCoeff = getDistanceCoefficient(distance, isHeader, didTurn);
    const skillValue = isHeader ? player.Header : player.Passing;

    const result = clampDiced(diceRoll + skillValue - distanceCoeff);

    const passSuccessful = result >= MIN_SUCCESS_RESULT;
    if (!passSuccessful) {
        deflectionDistance = MIN_SUCCESS_RESULT - result;
    }

    return {
        result,
        diceRoll,
        distanceCoeff,
        passSuccessful,
        deflectionDistance: deflectionDistance,
        formula: `Dice Roll (${diceRoll}) +  ${isHeader ? 'Head' : 'Passing'} Skill (${skillValue}) - Distance Coefficient (${distanceCoeff}) = ${result} ${passSuccessful ? '≥' : ' <'} ${MIN_SUCCESS_RESULT}`,
        coeffFormula: `Distance (${distance})  ${ didTurn ? `+ Changed Direction (${(isHeader ? HEADER_TURN_PENALTY : HEADER_TURN_PENALTY)}) = ${adjustDistance(distance, isHeader, didTurn)} → Coefficient (${distanceCoeff})` : ''}`,
    };
};

export const PassingComponent: React.FC = () => {
    const [selectedPasser, setSelectedPasser] = useState<Player | null>(null);
    const [distance, setDistance] = useState<number>(1);
    const [isHeader, setIsHeader] = useState<boolean>(false);
    const [didTurn, setDidTurn] = useState<boolean>(false);
    const [diceRoll, setDiceRoll] = useState<number | null>(null);
    const [calculation, setCalculation] = useState<CalculationResult | null>(null);

    const handleRollDice = () => {
        const roll = rollDice();
        setDiceRoll(roll);
        setCalculation(null);
    };

    const handleCalculate = () => {
        if (diceRoll !== null && selectedPasser !== null) {
            const result = calculateResult(selectedPasser, distance, isHeader, didTurn, diceRoll);
            setCalculation(result);
        }
    };

    return (
        <div>
            <h2>Passing Component</h2>
            <div>
                Passer: <PlayerSelector text={'Select Passer'} disabled={calculation !== null} selectedPlayer={selectedPasser} onSelect={setSelectedPasser} />
            </div>
            <br/>
            <button onClick={handleRollDice} disabled={!selectedPasser}>Roll Dice 🎲</button>
            {diceRoll !== null && (
                <>
                    <p>🎲 Dice Roll: {diceRoll}</p>
                    {diceRoll === MIN_DICE_VALUE ? (
                        <p>Pass Failed</p>
                    ) : diceRoll === MAX_DICE_VALUE  ? (
                        <p>Pass Successful</p>
                    ) : (
                        <>
                            <label>
                                Distance:
                                <input
                                    type="number"
                                    value={distance}
                                    disabled={calculation !== null}
                                    onChange={(e) => setDistance(parseInt(e.target.value))}
                                />
                            </label>
                            <br />
                            <label>
                                Header:
                                <input
                                    type="checkbox"
                                    checked={isHeader}
                                    disabled={calculation !== null}
                                    onChange={(e) => setIsHeader(e.target.checked)}
                                />
                            </label>
                            <br />
                            <label>
                                Changed Direction:
                                <input
                                    type="checkbox"
                                    checked={didTurn}
                                    disabled={calculation !== null}
                                    onChange={(e) => setDidTurn(e.target.checked)}
                                />
                            </label>
                            <br />
                            <button onClick={handleCalculate} disabled={calculation !== null}>Calculate 🧮</button>
                            {calculation && (
                                <div>
                                    <h3>Result</h3>
                                    <p>Distance coefficient Formula: {calculation.coeffFormula}</p>
                                    <p>Passing Formula: {calculation.formula}</p>
                                    <p>Pass Successful: {calculation.passSuccessful ? 'Yes' : 'No'}</p>
                                    {!calculation.passSuccessful && (
                                        <DeflectionComponent
                                            deflectionDistance={calculation.deflectionDistance}
                                            lastPlayerTouchingBall={selectedPasser!}
                                            deflectionType={DeflectionType.LooseBall}
                                        />
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default PassingComponent;
