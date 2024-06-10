import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import DataDisplay from '../../../dataProviders/DataDisplay';
import { updateSickHistory } from '../../../api/supabaseApi';
import '../styles.css';

const DiagnosesTable = ({ diagnosesData, doctorData }) => {

    const handleConfirm = async (id, therapistId) => {
        const result = await updateSickHistory(id, true, therapistId);
        if (result) {
            console.log('Sick history updated successfully:', result);
            // Обновите состояние или перезагрузите данные, если это необходимо
        }
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
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diagnosesData.map(diagnosis => (
                            <tr key={diagnosis.id}>
                                <td>{new Date(diagnosis.diagnos_date).toLocaleDateString()}</td>
                                <td>{diagnosis.diagnos_name}</td>
                                <td>{diagnosis.doctor_lastname} {diagnosis.doctor_name} {diagnosis.doctor_surname}</td>
                                <td>
                                    {diagnosis.is_confirmed ? (
                                        `${diagnosis.therapist_lastname} ${diagnosis.therapist_name} ${diagnosis.therapist_surname}`
                                    ) : (
                                        ''
                                    )}
                                </td>
                                <td>{diagnosis.recomendations}</td>
                                <td>{diagnosis.symptoms}</td>
                                <td>
                                    {diagnosis.is_confirmed ? (
                                        ''
                                    ) : (
                                        doctorData.position_name === "Терапевт" ? (
                                            <div className='table_buttons_frame'>
                                            <button onClick={() => handleConfirm(diagnosis.id, doctorData.doctor_id)}>Подтвердить</button>
                                        </div>
                                        ) : (
                                            ''
                                        ) 
                                    )}
                                </td>
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

DiagnosesTable.propTypes = {
    diagnosesData: PropTypes.array.isRequired,
    doctorData: PropTypes.object,
};

export default DiagnosesTable;