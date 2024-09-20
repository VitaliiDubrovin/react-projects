import {OutcomeResultType, PlayerStat, TeamType} from './enums';

export interface Player {
    id: number;
    team: TeamType;
    name: string;
    number: number;
    isGoalKeeper?: boolean;
    [PlayerStat.Pace]: number;
    [PlayerStat.Passing]: number;
    [PlayerStat.Defense]: number;
    [PlayerStat.Header]: number;
    [PlayerStat.Physique]: number;
    [PlayerStat.Shooting]: number;
    [PlayerStat.Dribble]: number;
    [PlayerStat.Saving]: number;
    [PlayerStat.Handling]: number;
}

export type Team = {
    type: TeamType;
    name: string;
    score: number;
    players: Player[];
};

export type MatchData = {
    teams: Team[];
    time: number;
};

export interface OutcomeResult {
    type: OutcomeResultType;
    threshold?: number;
    statName?: PlayerStat;
    consequence?: OutcomeResultType;
}

export interface OutcomeChartElement {
    title: string;
    text: string;
    results: OutcomeResult[];
}