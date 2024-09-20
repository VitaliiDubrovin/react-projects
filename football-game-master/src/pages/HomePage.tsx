import React from 'react'
import DateDisplay from '../components/DateDisplay'
import AccordionGroup from '../components/generic/Accordion';

const HomePage: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '4em' }}>Football Game!</h1>
            <AccordionGroup/>
            <h2 style={{ fontSize: '1em' }}>TO ADD:</h2>
            <hr/>
            <h2 style={{ fontSize: '1em' }}>Tackling</h2>
            <hr/>
            <h2 style={{ fontSize: '1em' }}>Dribbling</h2>
            <hr/>
            <h2 style={{ fontSize: '1em' }}>Players Selection</h2>
            <hr/>
            <h2 style={{ fontSize: '1em' }}>Zones</h2>
            <hr/>
            <h2 style={{ fontSize: '1em' }}>Statistics</h2>
            <DateDisplay />
        </div>
    )
}

export default HomePage
