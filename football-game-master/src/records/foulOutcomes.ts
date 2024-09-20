import {expandRecord} from '../utility/sharedFunctions';
import {OutcomeChartElement} from '../types/types';
import {OutcomeResultType} from '../types/enums';

const rawFoulResults : Record<string, OutcomeChartElement>  = {
    "1": {
        title: "Red Card",
        text: "The player commits a severe foul and receives a red card.",
        results: [{ type: OutcomeResultType.RedCard }, { type: OutcomeResultType.Foul }]
    },
    "2, 3, 5": {
        title: "Yellow Card",
        text: "The player receives a yellow card for the foul.",
        results: [{ type: OutcomeResultType.YellowCard }, { type: OutcomeResultType.Foul }]
    },
    "4": {
        title: "Yellow Card, No Foul",
        text: "No foul, but the player argues with referee and gets a yellow card.",
        results: [{ type: OutcomeResultType.RedCard }]
    },
    "6, 7, 8, 9": {
        title: "No Card",
        text: "The player does not receive a card for the foul.",
        results: [{ type: OutcomeResultType.Foul }]
    },
    "10": {
        title: "Red Card, No Foul",
        text: "No foul, but the player hits another player and gets a red card.",
        results: [{ type: OutcomeResultType.RedCard }]
    },
    "11, 12": {
        title: "VAR Overturns Foul",
        text: "VAR overturns the fault decision. No Fault",
        results: [{ type: OutcomeResultType.NoFoul }]
    }
};

export const FOUL_OUTCOMES = expandRecord(rawFoulResults);