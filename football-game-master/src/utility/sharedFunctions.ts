import {MAX_DICE_VALUE, MIN_DICE_VALUE} from './diceUtils';
import {OutcomeChartElement} from '../types/types';

const clamp = (val: number, min: number, max: number) => {
    return val > max ? max : val < min ? min : val;
}

export const clampDiced = (val: number) => {
    return clamp(val, MIN_DICE_VALUE, MAX_DICE_VALUE);
}

export const expandRecord = (obj: Record<string, any>) => {
    const keys = Object.keys(obj);
    keys.forEach(key => {
        const subKeys = key.split(/,\s?/).map(subKey => parseInt(subKey));
        const target = obj[key];
        delete obj[key];
        subKeys.forEach(subKey => {
            obj[subKey] = target;
        });
    });
    return obj;
};

const transformOutcomesRecordToText = (blockOutcomes: Record<string, OutcomeChartElement>) => { //to tranform outcome into text to read
    const result = [];

    for (const key in blockOutcomes) {
        const element = blockOutcomes[key];
        const resultsText = element.results.map(result => {
            if (result.threshold) {
                return `${result.type} (only if ${result.statName} more than ${result.threshold})`; // change this
            }
            return result.type;
        }).join(', ');

        result.push(`${key}: ${element.title}: ${element.text} : ${resultsText}`);
    }

    return result.join('\n');
}