import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import DataDisplay from '../../../dataProviders/DataDisplay';
// import './modalStyles.css';

const DiagnosesTable = ({ diagnosesData }) => {

    const getBackgroundColor = (value, lowerLimit, upperLimit) => {
        if (value < lowerLimit || value > upperLimit) {
            return '#ffcccc'; // Красноватый фон
        }
        return '#ccffcc'; // Зеленоватый фон
    };

    return (
        // <DataDisplay
        //     endpoint="get_sick_histories"
        //     params={{}}
        //     render={(data) => (

        <div >
            {diagnosesData.length > 0 ? (
                <table className='data_table'>
                    <thead>
                        <tr>
                            <th>Дата диагноза</th>
                            <th>Диагноз</th>
                            <th>Доктор</th>
                            <th>Подтверждено</th>
                            <th>Рекомендации</th>
                            <th>Симптомы</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diagnosesData.map(diagnosis => (
                            <tr key={diagnosis.id}>
                                <td>{new Date(diagnosis.diagnos_date).toLocaleDateString()}</td>
                                <td>{diagnosis.diagnos_name}</td>
                                <td>{diagnosis.doctor_lastname} {diagnosis.doctor_name} {diagnosis.doctor_surname}</td>
                                <td>{diagnosis.is_confirmed ? 'Да' : 'Нет'}</td>
                                <td>{diagnosis.recomendations}</td>
                                <td>{diagnosis.symptoms}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет данных</p>
            )}
        </div>
        //     )}
        // />
    );
};

DiagnosesTable.propTypes = {
    diagnosesData: PropTypes.array.isRequired,
};

export default DiagnosesTable;