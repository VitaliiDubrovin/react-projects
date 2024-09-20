import React from 'react';
import './TerrainGridUIComponent.scss';

const TerrainGrid = () => {
    const numberRows = 20;
    const numberColumns = 30;

    function generateGridLabels() : { columns : string[], rows: number[]} {
        const columns = [];
        const rows = [];

        for (let i = 0; i < numberColumns; i++) {
            if (i < 26) {
                columns.push(String.fromCharCode(97 + i)); // 'a' is 97 in ASCII
            } else {
                const greekLetters = ['α', 'β', 'γ', 'δ'];
                columns.push(greekLetters[i - 26]);
            }
        }

        for (let i = 1; i <= numberRows; i++) {
            rows.unshift(i);
        }

        return { columns:columns, rows : rows };
    }

    const getZoneColor = (rowIndex: number, colIndex: number) => {
        let columnZone = '';
        let rowZone = '';

        if (rowIndex < 4) {
            columnZone = 'left-flank';
            if (colIndex <= 9) {
                rowZone = 'first-third';
            } else if (colIndex <= 19) {
                rowZone = 'second-third';
            } else {
                rowZone = 'third-third';
            }
        } else if (rowIndex >= 16) {
            columnZone = 'right-flank';
            if (colIndex <= 9) {
                rowZone = 'first-third';
            } else if (colIndex <= 19) {
                rowZone = 'second-third';
            } else {
                rowZone = 'third-third';
            }
        } else {
            columnZone = 'central-path';
            if (colIndex <= 4) {
                rowZone = 'left-goal';
            } else if (colIndex <= 9) {
                rowZone = 'left-defense';
            } else if (colIndex <= 14) {
                rowZone = 'left-center';
            } else if (colIndex <= 19) {
                rowZone = 'right-center';
            } else if (colIndex <= 24) {
                rowZone = 'right-defense';
            } else {
                rowZone = 'right-goal';
            }
        }

        return `${columnZone}-${rowZone}`;
    };

    const { columns, rows } = generateGridLabels();

    const getQuadronNumber = (rowIndex: number, colName: string) => {
        const colIndex = columns.findIndex(c => c === colName);
        // Adjust for 0-based indexing
        const quadronRow = Math.floor(rowIndex / 2) + 1; // Vertical quadron number
        const quadronCol = Math.floor(colIndex / 2) + 1; // Horizontal quadron number

        return (quadronCol - 1) * 11 + quadronRow;
    };

    const calculateDistanceBetweenQuadrons = (quadron1: number, quadron2: number) => {
        const row1 = (quadron1 - 1) % 11 + 1;
        const col1 = Math.floor((quadron1 - 1) / 11) + 1;
        const row2 = (quadron2 - 1) % 11 + 1;
        const col2 = Math.floor((quadron2 - 1) / 11) + 1;

        const dRow = Math.abs(row2 - row1);
        const dCol = Math.abs(col2 - col1);

        const straightMoves = Math.min(dRow, dCol);
        const remainingMoves = Math.abs(dRow - dCol);

        return straightMoves + remainingMoves;
    };

    const shortestQuadrantDistance = (startRow: number, startCol: string, endRow: number, endCol: string) => {
        const startQuadron = getQuadronNumber(startRow, startCol);
        const endQuadron = getQuadronNumber(endRow, endCol);

        const distance = calculateDistanceBetweenQuadrons(startQuadron, endQuadron);
        console.log(`Shortest distance in quadrons between quadrons (${startQuadron},${endQuadron}) is: ${distance}`);

        return distance;
    };

    const startCell = { row: 6, col: 'y' };
    const endCell = { row: 20, col: 'o'};

    const distance = shortestQuadrantDistance(startCell.row, startCell.col, endCell.row, endCell.col);

    return (
        <div className="terrain-grid">
            <div className="grid-body">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className={`grid-row`}>
                        {columns.map((col, colIndex) => {
                            const zoneName = getZoneColor(rowIndex, colIndex);

                            return (
                                <div key={`${col}-${row}`} className={`grid-cell ${zoneName} ${getQuadronNumber(row,col) % 2 === 0 ? 'odd' : 'even'}`}>
                                    <div>{col + row}</div><div>({getQuadronNumber(row,col)})</div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TerrainGrid;
