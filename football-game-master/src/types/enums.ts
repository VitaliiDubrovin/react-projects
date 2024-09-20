export enum PlayerStat {
    Pace = "Pace",
    Shooting = "Shooting",
    Passing = "Passing",
    Defense = "Defense",
    Dribble = "Dribble",
    Header = "Header",
    Physique = "Physique",
    Saving = "Saving",
    Handling = "Handling",
}

export enum TeamType {
    Home = "Home",
    Visitor = "Visitor",
}

export enum ShotResult {
    GoalKick = 'Out (Goal Kick)',
    TopBar = 'Top Bar',
    RightBar = 'Right Bar',
    LeftBar = 'Left Bar',
    OnTarget = 'On Target',
    Corner = 'Corner',
}

export enum DeflectionType {
    LooseBall = 'Loose ball',
    RightBar = 'Right bar',
    LeftBar = 'Left bar',
    TopBar = 'Top bar',
}

export enum OutcomeResultType {
    //Generic
    Injury = "Injury",
    LossOfBalance = "Loss of Balance",
    BallInField = 'Ball still in field',

    //Deflection
    Deflection =  "Deflection",
    ThrowIn = "Throw In",
    GoalKick = "Goal Kick",
    Corner = 'Corner',
    Out = 'Out of closest line',
    TopLeft = 'Top Left (Cell 3)',
    Top = 'Top (Cell 4)',
    TopRight = 'Top Right (Cell 5)',
    Left = 'Left (Cell 6)',
    NoDeflection = 'No deflection (Cell 7)',
    Right = 'Right (Cell 8)',
    BottomLeft = 'Bottom Left (Cell 9)',
    Bottom = 'Bottom (Cell 10)',
    BottomRight = 'Bottom Right (Cell 11)',

    //Block
    HandBall = "Hand Ball",
    BallToShooter = "Ball to Shooter",
    HeadedClearance = "Headed Clearance",
    ControlledBall = "Controlled Ball",

    //Foul
    BlockFailed = 'Block Failed',
    RedCard = 'Red Card',
    YellowCard = 'Yellow Card',
    Foul = 'Foul',
    Penalty = 'Penalty',
    FreeKick = 'Free Kick',
    NoFoul = 'No Foul',

    //Goalkeeper Save
    Goal = 'Goal',
    Catch = 'Catch',
}
