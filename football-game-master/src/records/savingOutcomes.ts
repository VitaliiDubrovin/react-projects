import {OutcomeChartElement} from '../types/types';
import {OutcomeResultType, PlayerStat} from '../types/enums';

export const SAVING_OUTCOMES: Record<number, OutcomeChartElement> = {
    1: {
        title: "Hit Post",
        text: "The goalkeeper hits the post and may get injured.",
        results: [{ type: OutcomeResultType.Injury, threshold: 7, statName: PlayerStat.Physique }, { type: OutcomeResultType.Goal}]
    },
    2: {
        title: "Misjudgment",
        text: "The goalkeeper misjudges the ball, resulting in a goal.",
        results: [{ type: OutcomeResultType.Goal }]
    },
    3: {
        title: "By Surprise",
        text: "The shot catches the goalkeeper by surprise, and it's a goal.",
        results: [{ type: OutcomeResultType.Goal }]
    },
    4: {
        title: "Fingertip Deflection",
        text: "The goalkeeper gets a fingertip to the ball. Will it be a corner?",
        results: [{ type: OutcomeResultType.Deflection, threshold: 8, statName: PlayerStat.Saving, consequence: OutcomeResultType.Goal }]
    },
    5: {
        title: "Butterfingers",
        text: "The goalkeeper fumbles the ball, and it's a goal.",
        results: [{ type: OutcomeResultType.Goal }]
    },
    6: {
        title: "Reflex Save",
        text: "A brilliant reflex save! Will it result in a corner?",
        results: [{ type: OutcomeResultType.Deflection, threshold: 8, statName: PlayerStat.Saving, consequence: OutcomeResultType.Goal }]
    },
    7: {
        title: "Tip Over the Bar",
        text: "The goalkeeper tips the ball over the bar. Will it be a save?",
        results: [{ type: OutcomeResultType.Corner, threshold: 6, statName: PlayerStat.Saving, consequence: OutcomeResultType.Goal }]
    },
    8: {
        title: "Block Save",
        text: "The goalkeeper blocks the ball. Will it be a deflection?",
        results: [{ type: OutcomeResultType.Deflection, threshold: 4, statName: PlayerStat.Saving, consequence: OutcomeResultType.Goal }]
    },
    9: {
        title: "One-Handed Save",
        text: "A one-handed save! Will it be a deflection or a catch?",
        results: [{ type: OutcomeResultType.Catch, threshold: 8, statName: PlayerStat.Handling, consequence: OutcomeResultType.Deflection }]
    },
    10: {
        title: "Fumble",
        text: "The goalkeeper fumbles the ball, resulting in a goal.",
        results: [{ type: OutcomeResultType.Goal }]
    },
    11: {
        title: "Diving Save",
        text: "A diving save! Will it be a catch or a corner?",
        results: [{ type: OutcomeResultType.Catch, threshold: 5, statName: PlayerStat.Handling, consequence: OutcomeResultType.Corner }]
    },
    12: {
        title: "Smother",
        text: "The goalkeeper smothers the ball, making a clean catch.",
        results: [{ type: OutcomeResultType.Catch }]
    }
};

