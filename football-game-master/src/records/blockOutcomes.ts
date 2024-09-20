import {OutcomeResultType, PlayerStat} from '../types/enums';
import {OutcomeChartElement} from '../types/types';

export const BLOCK_OUTCOMES: Record<number, OutcomeChartElement> = {
    1: {
        title: "Hand Ball",
        text: "A defender blocks the shot with their hand, resulting in a penalty for the opposing team.",
        results: [{ type: OutcomeResultType.HandBall }],
    },
    2: {
        title: "Loss of Balance", //change name
        text: "The defender loses balance, possibly due to a mistimed slide tackle, leading to a scoring opportunity for the opposition.",
        results: [
            { type: OutcomeResultType.LossOfBalance, threshold: 5, statName: PlayerStat.Physique },
            { type: OutcomeResultType.BlockFailed }
        ],
    },
    3: {
        title: "Injury During Play",
        text: "The defender sustains an injury while attempting to block or clear the ball, creating a defensive weakness.",
        results: [
            { type: OutcomeResultType.Injury, threshold: 4, statName: PlayerStat.Physique },
            { type: OutcomeResultType.BlockFailed }
        ],
    },
    4: {
        title: "Rebound to Attacker",
        text: "The defender blocks the ball, but it rebounds back to the attacker's feet, giving them another chance to shoot.",
        results: [{ type: OutcomeResultType.BallToShooter }],
    },
    5: {
        title: "Ball missed",
        text: "The defender's attempt to clear the ball failed because he narrowly missed the ball.",
        results: [{ type: OutcomeResultType.BlockFailed }],
    },
    6: {
        title: "Headed Clearance",
        text: "The defender uses their head to clear the ball away from the goal area, neutralizing the threat.",
        results: [
            { type: OutcomeResultType.LossOfBalance, threshold: 3, statName: PlayerStat.Physique },
            { type: OutcomeResultType.HeadedClearance, threshold: 7, statName: PlayerStat.Header  },
        ],
    },
    7: {
        title: "Conceding a Corner",
        text: "The defender's attempt to clear the ball results in a corner kick for the opposing team.",
        results: [{ type: OutcomeResultType.Corner }],
    },
    8: {
        title: "Sliding save",
        text: "The defender attempts a slide to block the ball, but may end up falling.",
        results: [
            { type: OutcomeResultType.LossOfBalance, threshold: 6, statName: PlayerStat.Physique },
            { type: OutcomeResultType.Deflection }
        ],
    },
    9: {
        title: "Header save",
        text: "The defender attempts to block the ball with his head, allowing for an effective clearance.",
        results: [
            { type: OutcomeResultType.HeadedClearance, threshold: 4, statName: PlayerStat.Header },
        ],
    },
    10: {
        title: "Mishap in Slide save",
        text: "The defender attempts a slide tackle but falls, creating a scoring opportunity for the opposition.",
        results: [
            { type: OutcomeResultType.LossOfBalance, threshold: 8, statName: PlayerStat.Physique },
            { type: OutcomeResultType.Injury, threshold: 5, statName: PlayerStat.Physique },
            { type: OutcomeResultType.BlockFailed }
        ],
    },
    11: {
        title: "To Goalkeeper hands",
        text: "The defender deflects or directs the ball safely into the goalkeeper's hands.",
        results: [
            { type: OutcomeResultType.LossOfBalance, threshold: 4, statName: PlayerStat.Physique },
            { type: OutcomeResultType.Catch },
        ],
    },
    12: {
        title: "Interception and Counter",
        text: "The defender intercepts the ball and initiates a counter-attack, turning defense into offense effectively.",
        results: [
            { type: OutcomeResultType.ControlledBall },
        ],
    },
};
