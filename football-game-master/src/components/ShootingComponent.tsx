import React, { useEffect, useState } from 'react';
import { PlayerSelector } from './generic/PlayerSelector';
import {
    MAX_DICE_VALUE,
    MIN_DICE_VALUE,
    rollDice, SECOND_DICE_VALUE,
} from '../utility/diceUtils';
import { DeflectionComponent} from './outcomes/DeflectionComponent';
import {Player} from '../types/types';
import {DeflectionType, ShotResult} from '../types/enums';
import {clampDiced} from '../utility/sharedFunctions';
import BlockingComponent from './BlockingComponent';
import {SavingComponent} from './SavingComponent';

const MIN_SUCCESS_RESULT = 8;
const TOP_BAR_RESULT = 3;
const MAX_INSIDE_ZONE_DISTANCE = 12;
const SHOT_TURN_PENALTY = 1;
const HEADER_TURN_PENALTY = 2;
const SHOT_DISTANCE_UNIT = 3;

const INSIDE_ZONE_COEFFICIENTS = [1, 2, 3, 4, 5, 6];
const OUTSIDE_ZONE_COEFFICIENTS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const GOAL_MOUTH_CELL_NUMBERS = [
    { label: 'A', number: 8 },
    { label: 'B', number: 9 },
    { label: 'C', number: 10 },
    { label: 'D', number: 11 },
    { label: 'E', number: 12 },
    { label: 'F', number: 13 },
];
const RIGHT_BAR_NUMBER_CELL = 7;
const LEFT_BAR_NUMBER_CELL = 14;

const adjustDistance = (distance: number, isHeader: boolean, isInsideGoalZone: boolean, didTurn: boolean) => {
    const newDistance = distance + (didTurn ? (isHeader ? HEADER_TURN_PENALTY : SHOT_TURN_PENALTY) : 0);
    return (isInsideGoalZone || isHeader) ? Math.min(newDistance, MAX_INSIDE_ZONE_DISTANCE) : newDistance;
}

const getDistanceCoefficient = (distance: number, isHeader: boolean, isInsideGoalZone: boolean, didTurn: boolean): number => {
    const coefficients = (isInsideGoalZone && !isHeader) ? INSIDE_ZONE_COEFFICIENTS : OUTSIDE_ZONE_COEFFICIENTS;
    const adjustedDistance = adjustDistance(distance, isHeader, isInsideGoalZone, didTurn);
    const index = Math.min(Math.floor(adjustedDistance / SHOT_DISTANCE_UNIT), coefficients.length - 1);
    return coefficients[index] || coefficients[coefficients.length - 1];
};

const calculateShootingResult = (
    player: Player,
    distance: number,
    isHeader: boolean,
    isInsideGoalZone: boolean,
    didTurn: boolean,
    goalCell: string,
    diceRoll: number
) => {
    const distanceCoeff = getDistanceCoefficient(distance, isHeader, isInsideGoalZone, didTurn);
    const skillValue = isHeader ? player.Header : player.Shooting;
    const result = clampDiced(diceRoll + skillValue - distanceCoeff);
    const { shotResult, deviation, originalGoalCellNumber } = checkOnTarget(result, goalCell);

    return {
        result,
        diceRoll,
        shotResult,
        distanceCoeff,
        deviation,
        formula: `Dice Roll (${diceRoll}) + ${isHeader ? 'Header' : 'Shooting'} Skill (${skillValue}) - Coefficient (${distanceCoeff}) = ${result} ${shotResult == ShotResult.OnTarget ? '≥' : '<'} ${MIN_SUCCESS_RESULT}`,
        deviationFormula: deviation && originalGoalCellNumber ? `Minimum result for success (${MIN_SUCCESS_RESULT}) - Shooting result ${result} = ${deviation} Cells to the ${deviationDirection(originalGoalCellNumber) == 1 ? 'left': 'right'}`: null,
        coeffFormula: `Distance (${distance}) → Coefficient (${distanceCoeff})`
    };
};

// 1 is left -1 is right (from 1 to 20)
const deviationDirection = (goalCellNumber: number) => goalCellNumber >= GOAL_MOUTH_CELL_NUMBERS[3].number ? 1 : -1;

const handleDeviation = (goalCellNumber: number, deviation: number): ShotResult => {
    const newCellNumber = goalCellNumber + deviationDirection(goalCellNumber)*deviation;
    if (newCellNumber < RIGHT_BAR_NUMBER_CELL || newCellNumber > LEFT_BAR_NUMBER_CELL) {
        return ShotResult.GoalKick;
    } else if (newCellNumber === RIGHT_BAR_NUMBER_CELL) {
        return ShotResult.RightBar;
    } else if (newCellNumber === LEFT_BAR_NUMBER_CELL) {
        return ShotResult.LeftBar;
    } else {
        return ShotResult.OnTarget;
    }
};

function checkOnTarget(result: number, goalCell: string) { //TODO use outcomes chart
    let shotResult;
    let deviation;
    let originalGoalCellNumber;
    if (result < TOP_BAR_RESULT ) {
        shotResult = ShotResult.GoalKick;
    } else if (result == TOP_BAR_RESULT) {
        shotResult = ShotResult.TopBar;
    } else if (result > TOP_BAR_RESULT && result < MIN_SUCCESS_RESULT) {
        deviation = MIN_SUCCESS_RESULT - result;
        originalGoalCellNumber = GOAL_MOUTH_CELL_NUMBERS.find(cell => cell.label === goalCell)!.number;
        shotResult = handleDeviation(originalGoalCellNumber, deviation);
    } else {
        shotResult = ShotResult.OnTarget;
    }
    return { shotResult, deviation, originalGoalCellNumber };
}

//todo give cell of kick and cell of arrival and app will calculate it
export const ShootingComponent: React.FC = () => {
    const [selectedShooter, setSelectedShooter] = useState<Player | null>(null);
    const [distance, setDistance] = useState<number>(10);
    const [isHeader, setIsHeader] = useState<boolean>(false);
    const [isInsideGoalZone, setIsInsideGoalZone] = useState<boolean>(false);
    const [didTurn, setDidTurn] = useState<boolean>(false);
    const [goalCell, setGoalCell] = useState<string>('A');
    const [diceRoll, setDiceRoll] = useState<number | null>(null);
    const [calculation, setCalculation] = useState<any | null>(null);
    const [goToSaving, setGoToSaving] = useState<boolean>(false);

    const handleRollDice = () => {
        const roll = rollDice();
        setDiceRoll(roll);
        setCalculation(null);
    };

    useEffect(() => {
        if (isInsideGoalZone && distance > MAX_INSIDE_ZONE_DISTANCE) {
            setDistance(MAX_INSIDE_ZONE_DISTANCE);
        }
    }, [isInsideGoalZone, distance]);

    const handleCalculate = () => {
        if (diceRoll !== null && selectedShooter !== null) {
            const result = calculateShootingResult(selectedShooter, distance, isHeader, isInsideGoalZone, didTurn, goalCell, diceRoll);
            setCalculation(result);
        }
    };

    return (
        <div>
            <h2>Shooting Component</h2>
            <PlayerSelector text={'Select shooter'} disabled={diceRoll !== null} selectedPlayer={selectedShooter} onSelect={setSelectedShooter} />
            <br/>
            <button onClick={handleRollDice} disabled={!selectedShooter}>Roll Dice 🎲</button> {/*TODO disable*/}
            {diceRoll !== null && (
                <>
                    <p>🎲 Dice Roll: {diceRoll}</p>
                    {diceRoll === MIN_DICE_VALUE || diceRoll === SECOND_DICE_VALUE  ? (
                        <h4>Shot Failed : {ShotResult.GoalKick}</h4>
                    ) : diceRoll === MAX_DICE_VALUE ? (
                        <h4>{ShotResult.OnTarget}</h4>
                    ) : (
                        <>
                            <br />
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
                                    onChange={(e) => {
                                        setIsHeader(e.target.checked);
                                        if (e.target.checked) setIsInsideGoalZone(true);
                                    }}
                                />
                            </label>
                            {!isHeader && (
                                <>
                                    <br />
                                    <label>
                                        Inside Goal Zone:
                                        <input
                                            type="checkbox"
                                            checked={isInsideGoalZone}
                                            disabled={calculation !== null}
                                            onChange={(e) => setIsInsideGoalZone(e.target.checked)}
                                        />
                                    </label>
                                </>
                            )}
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
                            <label>
                                Goal Mouth Cell:
                                <select value={goalCell} onChange={(e) => setGoalCell(e.target.value)} disabled={calculation !== null}>
                                    {GOAL_MOUTH_CELL_NUMBERS.map(cell => (
                                        <option key={cell.label} value={cell.label}>
                                            {cell.label} ({cell.number})
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <br />
                            <button onClick={handleCalculate} disabled={calculation !== null}>Calculate 🧮</button>
                            {calculation && (
                                <div>
                                    <p>Distance coefficient Formula: {calculation.coeffFormula}</p>
                                    <p>Shooting Formula: {calculation.formula}</p>
                                    <h4>{calculation.shotResult}</h4>
                                    {calculation.shotResult !== ShotResult.OnTarget && (
                                        <>
                                        {calculation.deviation &&
                                            (<p>Deviation Formula: {calculation.deviationFormula}</p>)
                                        }
                                            {calculation.shotResult === ShotResult.RightBar && (
                                                <DeflectionComponent
                                                    deflectionType={DeflectionType.RightBar}
                                                    lastPlayerTouchingBall={selectedShooter!}
                                                />
                                            )}
                                            {calculation.shotResult === ShotResult.LeftBar && (
                                                <DeflectionComponent
                                                    deflectionType={DeflectionType.LeftBar}
                                                    lastPlayerTouchingBall={selectedShooter!}
                                                />
                                            )}
                                            {calculation.shotResult === ShotResult.TopBar && (
                                                <DeflectionComponent
                                                    deflectionType={DeflectionType.TopBar}
                                                    lastPlayerTouchingBall={selectedShooter!}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    {(diceRoll === MAX_DICE_VALUE || (calculation?.shotResult === ShotResult.OnTarget)) && (
                        <>
                            <BlockingComponent attacker={selectedShooter!} setGoToSaving={setGoToSaving}/>
                            {goToSaving && (
                                <SavingComponent attacker={selectedShooter!} /> //todo set goalkeeper directly
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ShootingComponent;
