import React, { useEffect, useState } from 'react';
import { addGospitalizationReferral, getReferralStatuses } from '../../../api/fire_api';
import ModalEditText from '../components/ModalEditText';
import { DropdownList } from '../components/DropdownLists';
import DatePickerComponent from '../components/DatePickerComponent';

function AddGospitalizationForm({ patientId, terapevtId }) {
    const [statusId, setStatusId] = useState(1);
    const [reason, setReason] = useState('');
    const [startDate, setStartDate] = useState('');

    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const fetchedStatuses = await getReferralStatuses();
                setStatuses(fetchedStatuses);
            } catch (error) {
                console.error('Error fetching statuses:', error);
            }
        };

        fetchStatuses();
    }, []);

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
        <form onSubmit={handleSubmit} style={gosp_form}>
            {/* <DropdownList
                options={statuses}
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                placeholder="Выберите статус"
            /> */}
            <ModalEditText
                placeholder="Причина"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
            <p>Выберите дату начала госпитализации</p>
            <DatePickerComponent
                selectedDate={startDate}
                onChange={(date) => setStartDate(date)}
            />
            <button style={form_button} type="submit">Добавить направление на госпитализацию</button>
        </form>
    );
}

export default AddGospitalizationForm;

const gosp_form = {
    display: 'flex',
    flexDirection: 'column'
}

const form_button = {
    margin: '20px 0px',
    padding: '10px',
    backgroundColor: '#4B5672',
    color: '#fff',
    borderRadius: '4px'
}


