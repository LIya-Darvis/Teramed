import React, { useState } from 'react';
import { addGospitalizationReferral } from '../../components/fire_api';

function AddGospitalizationForm({ patientId, terapevtId }) {
    const [statusId, setStatusId] = useState('');
    const [reason, setReason] = useState('');
    const [startDate, setStartDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(patientId, statusId, terapevtId, reason, startDate)
        try {
            await addGospitalizationReferral({
                patientId,
                statusId,
                terapevtId,
                reason,
                startDate
            });
            // Очистка формы или другое действие после успешного добавления
            setStatusId('');
            setReason('');
            setStartDate('');
        } catch (error) {
            console.error('Error adding hospitalization referral:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="ID статуса"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
            />
            <textarea
                placeholder="Причина"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
            <input
                type="date"
                placeholder="Дата начала"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <button type="submit">Добавить направление на госпитализацию</button>
        </form>
    );
}

export default AddGospitalizationForm;
