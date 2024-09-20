import {MatchData, Player, Team} from '../types/types';
import {PlayerStat, TeamType} from '../types/enums';

const playersData: any[] = [
    {
        name: 'Bono',
        pace: 3,
        shooting: 9,
        passing: 7,
        control: 5,
        defense: 7,
        head: 5,
        resilience: 8,
    },
    {
        name: 'Hakimi',
        pace: 5,
        shooting: 4,
        passing: 7,
        control: 6,
        defense: 7,
        head: 5,
        resilience: 9,
    },
    {
        name: 'Mazraoui',
        pace: 4,
        shooting: 4,
        passing: 7,
        control: 7,
        defense: 7,
        head: 5,
        resilience: 5,
    },
    {
        name: 'Sais',
        pace: 3,
        shooting: 2,
        passing: 5,
        control: 3,
        defense: 8,
        head: 8,
        resilience: 9,
    },
    {
        name: 'Aguerd',
        pace: 4,
        shooting: 2,
        passing: 4,
        control: 3,
        defense: 9,
        head: 9,
        resilience: 8,
    },
    {
        name: 'Amrabat',
        pace: 4,
        shooting: 2,
        passing: 5,
        control: 6,
        defense: 8,
        head: 4,
        resilience: 10,
    },
    { //TODO: to be changed
        name: 'Amallah',
        pace: 3,
        shooting: 6,
        passing: 7,
        control: 7,
        defense: 6,
        head: 5,
        resilience: 7,
    },
    {
        name: 'Ounahi',
        pace: 4,
        shooting: 5,
        passing: 7,
        control: 8,
        defense: 5,
        head: 2,
        resilience: 6,
    },
    {
        name: 'En-nesyri',
        pace: 4,
        shooting: 7,
        passing: 3,
        control: 6,
        defense: 3,
        head: 9,
        resilience: 7,
    },
    {
        name: 'Ziyech',
        pace: 4,
        shooting: 7,
        passing: 9,
        control: 8,
        defense: 2,
        head: 2,
        resilience: 6,
    },
    {
        name: 'Boufal',
        pace: 4,
        shooting: 6,
        passing: 6,
        control: 10,
        defense: 2,
        head: 2,
        resilience: 6,
    },
    {
        name: 'Diaz',
        pace: 4,
        shooting: 7,
        passing: 8,
        control: 9,
        defense: 2,
        head: 3,
        resilience: 5,
    },
];

const mapPlayers = (playersData: any[], team: TeamType): Player[] => {
    return playersData.map((data, index) => {
        const isGoalKeeper = index === 0;

        return {
            id: index + 1,
            team:  team,
            name: `${data.name}${team === TeamType.Visitor ? 'V': ''}`, //todo remove later
            number: index + 1,
            isGoalKeeper: isGoalKeeper,
            [PlayerStat.Pace]: data.pace,
            [PlayerStat.Shooting]: isGoalKeeper ?  data.shooting- 3 : data.shooting,
            [PlayerStat.Passing]: data.passing,
            [PlayerStat.Dribble]: data.control,
            [PlayerStat.Defense]: isGoalKeeper ?  data.defense- 3 : data.defense,
            [PlayerStat.Header]: data.head,
            [PlayerStat.Physique]: data.resilience,
            [PlayerStat.Saving]: isGoalKeeper ? data.shooting : 3,
            [PlayerStat.Handling]: isGoalKeeper ? data.defense : 3, //TODO reverse shooting and defense
        } as Player
    });
};

const homePlayers: Player[] = mapPlayers(playersData, TeamType.Home);
const visitorPlayers: Player[] = mapPlayers(playersData, TeamType.Visitor);


export const homeTeam: Team = {
    type: TeamType.Home,
    name: 'home',
    score: 0,
    players: homePlayers,
}

export const visitingTeam: Team = {
    type: TeamType.Visitor,
    name: 'visiting',
    score: 0,
    players: visitorPlayers,
}

export const matchData: MatchData = {
    time: 0,
    teams: [homeTeam, visitingTeam]
}