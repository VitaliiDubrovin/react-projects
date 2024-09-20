import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { ROUTES } from './resources/routes-constants'
import './styles/main.sass'
import PlayerSelectionUIComponent from './components/ui/PlayerSelectionUIComponent';
import TerrainGridUIComponent from './components/ui/TerrainGridUIComponent';

const RootComponent: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path={ROUTES.HOMEPAGE_ROUTE} element={<HomePage />} />
                <Route path={ROUTES.PLAYER_SELECTOR_ROUTE} element={<PlayerSelectionUIComponent />} />
                <Route path={ROUTES.GRID_ROUTE} element={<TerrainGridUIComponent />} />
            </Routes>
        </Router>
    )
}

export default RootComponent
