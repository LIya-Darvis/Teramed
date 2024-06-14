import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import useRealtimeData from '../../../dataProviders/useRealtimeData';

const GospitalizationTable = ({ patientId = null }) => {
    const initialData = useRealtimeData('get_gospitalizations').data;
    const [gospitalizationsData, setGospitalizationsData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        if (initialData) {
            if (patientId) {
                setGospitalizationsData(initialData.filter(item => item.patient_id === patientId));
            } else {
                setGospitalizationsData(initialData);
            }
        }
    }, [initialData, patientId]);

    const sortedGospitalizationsData = [...gospitalizationsData];
    if (sortConfig.key) {
        sortedGospitalizationsData.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className='table_frame'>
            {sortedGospitalizationsData.length > 0 ? (
                <table className='data_table'>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('referral_creation_date')}>Направление создано</th>
                            <th>Пациент</th>
                            {/* <th onClick={() => requestSort('status_name')}>Статус</th> */}
                            <th>Терапевт</th>
                            <th onClick={() => requestSort('referral_reason')}>Причина</th>
                            <th>Начало</th>
                            <th>Конец</th>
                            <th>Место</th>
                            <th>Отделение</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedGospitalizationsData.map((item) => (
                            <tr key={item.gospitalization_id}>
                                <td>{new Date(item.referral_creation_date).toLocaleDateString()}</td>
                                <td>{item.patient_lastname} {item.patient_name} {item.patient_surname}</td>
                                {/* <td>{item.status_name}</td> */}
                                <td>{item.terapevt_lastname} {item.terapevt_name} {item.terapevt_surname}</td>
                                <td>{item.referral_reason}</td>
                                <td>{new Date(item.gospitalization_start_date).toLocaleDateString()}</td>
                                <td>{new Date(item.gospitalization_end_date).toLocaleDateString()}</td>
                                <td>{item.place_num} (Палата {item.ward_num})</td>
                                <td>{item.department_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет данных</p>
            )}
        </div>
    );
};

GospitalizationTable.propTypes = {
    patientId: PropTypes.string
};

export default GospitalizationTable;