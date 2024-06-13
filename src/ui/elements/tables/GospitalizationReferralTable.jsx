import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import useRealtimeData from '../../../dataProviders/useRealtimeData';

const GospitalizationReferralTable = ({ patientId = null }) => {
    const initialData = useRealtimeData('get_gospitalization_referrals').data;
    const [referralsData, setReferralsData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        if (initialData) {
            if (patientId) {
                setReferralsData(initialData.filter(referral => referral.id_patient === patientId));
            } else {
                setReferralsData(initialData);
            }
        }
    }, [initialData, patientId]);

    const sortedReferralsData = [...referralsData];
    if (sortConfig.key) {
        sortedReferralsData.sort((a, b) => {
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
        <div>
            {sortedReferralsData.length > 0 ? (
                <table className='data_table'>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('creation_date')}>Дата создания</th>
                            <th>Пациент</th>
                            <th onClick={() => requestSort('status_name')}>Статус</th>
                            <th>Терапевт</th>
                            <th onClick={() => requestSort('reason')}>Причина</th>
                            <th onClick={() => requestSort('start_date')}>Дата начала</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedReferralsData.map((referral) => (
                            <tr key={referral.id}>
                                <td>{new Date(referral.creation_date).toLocaleDateString()}</td>
                                <td>{referral.patient_lastname} {referral.patient_name} {referral.patient_surname}</td>
                                <td>{referral.status_name}</td>
                                <td>{referral.terapevt_lastname} {referral.terapevt_name} {referral.terapevt_surname}</td>
                                <td>{referral.reason}</td>
                                <td>{new Date(referral.start_date).toLocaleDateString()}</td>
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

GospitalizationReferralTable.propTypes = {
    referralsData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            creation_date: PropTypes.string.isRequired,
            id_patient: PropTypes.string.isRequired,
            patient_lastname: PropTypes.string.isRequired,
            patient_name: PropTypes.string.isRequired,
            patient_surname: PropTypes.string.isRequired,
            id_status: PropTypes.string.isRequired,
            status_name: PropTypes.string.isRequired,
            id_terapevt: PropTypes.string.isRequired,
            terapevt_lastname: PropTypes.string.isRequired,
            terapevt_name: PropTypes.string.isRequired,
            terapevt_surname: PropTypes.string.isRequired,
            reason: PropTypes.string.isRequired,
            start_date: PropTypes.string.isRequired
        })
    ).isRequired
};

export default GospitalizationReferralTable;