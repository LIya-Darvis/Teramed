import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import DataDisplay from '../../../dataProviders/DataDisplay';
// import './modalStyles.css';

const AnalysisTable = ({ analysesData }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const getBackgroundColor = (value, lowerLimit, upperLimit) => {
        if (value < lowerLimit || value > upperLimit) {
            return '#ffcccc'; // Красноватый фон
        }
        return '#ccffcc'; // Зеленоватый фон
    };

    const sortedAnalysesData = [...analysesData];
    if (sortConfig.key) {
        sortedAnalysesData.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    return (
        // <DataDisplay
        //     endpoint="get_analyses"
        //     params={{}}
        //     render={(data) => (

                <div >
                    {analysesData.length > 0 ? (
                        <table className='data_table'>
                            <thead>
                                <tr>
                                    <th onClick={() => requestSort('analys_date')}>Дата анализа</th>
                                    <th onClick={() => requestSort('analys_type_name')}>Тип анализа</th>
                                    <th onClick={() => requestSort('value')}>Значение</th>
                                    <th>Комментарий</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAnalysesData.map(analysis => (
                                    <tr key={analysis.id}>
                                        <td>{new Date(analysis.analys_date).toLocaleDateString()}</td>
                                        <td>{analysis.analys_type_name}</td>
                                        <td style={{ backgroundColor: getBackgroundColor(analysis.value, analysis.analys_type_lower_limit, analysis.analys_type_upper_limit) }}>
                                            {analysis.value} {analysis.analys_type_unit}
                                        </td>
                                        <td>{analysis.comment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Нет данных</p>
                    )}
                </div>
            // )}
        // />
    );
};

AnalysisTable.propTypes = {
    analysesData: PropTypes.array.isRequired,
};

export default AnalysisTable;

