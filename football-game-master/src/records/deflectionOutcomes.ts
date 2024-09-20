import {OutcomeResultType, DeflectionType} from '../types/enums';

export const DEFLECTION_OUTCOMES: Record<DeflectionType, Record<number, OutcomeResultType>> = {
    [DeflectionType.LooseBall]: {
        1: OutcomeResultType.Out,
        2: OutcomeResultType.Out,
        3: OutcomeResultType.TopLeft,
        4: OutcomeResultType.Top,
        5: OutcomeResultType.TopRight,
        6: OutcomeResultType.Left,
        7: OutcomeResultType.NoDeflection,
        8: OutcomeResultType.Right,
        9: OutcomeResultType.BottomLeft,
        10: OutcomeResultType.Bottom,
        11: OutcomeResultType.BottomRight,
        12: OutcomeResultType.NoDeflection
    },
    [DeflectionType.RightBar]: {
        1: OutcomeResultType.Out,
        2: OutcomeResultType.Out,
        3: OutcomeResultType.Goal,
        4: OutcomeResultType.Top,
        5: OutcomeResultType.TopRight,
        6: OutcomeResultType.Out,
        7: OutcomeResultType.NoDeflection,
        8: OutcomeResultType.Right,
        9: OutcomeResultType.Out,
        10: OutcomeResultType.Bottom,
        11: OutcomeResultType.BottomRight,
        12: OutcomeResultType.Goal
    },
    [DeflectionType.LeftBar]: {
        1: OutcomeResultType.Out,
        2: OutcomeResultType.Out,
        3: OutcomeResultType.Out,
        4: OutcomeResultType.Top,
        5: OutcomeResultType.TopRight,
        6: OutcomeResultType.Out,
        7: OutcomeResultType.NoDeflection,
        8: OutcomeResultType.Right,
        9: OutcomeResultType.Goal,
        10: OutcomeResultType.Bottom,
        11: OutcomeResultType.BottomRight,
        12: OutcomeResultType.Goal
    },
    [DeflectionType.TopBar]: {
        1: OutcomeResultType.Out,
        2: OutcomeResultType.Out,
        3: OutcomeResultType.Out,
        4: OutcomeResultType.Top,
        5: OutcomeResultType.TopRight,
        6: OutcomeResultType.Out,
        7: OutcomeResultType.Goal,
        8: OutcomeResultType.Right,
        9: OutcomeResultType.Out,
        10: OutcomeResultType.Bottom,
        11: OutcomeResultType.NoDeflection,
        12: OutcomeResultType.Goal
    }
};