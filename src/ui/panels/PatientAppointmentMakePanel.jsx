import React, { useState, useEffect } from 'react'
import { useData } from '../../components/DataProvider';
import ContentLabel from '../elements/ContentLabel'
import ComboBoxList from '../elements/ComboBoxList';
import { getLdms, findPatientByUserId, getDoctorLocationsByPositionId, 
    uploadDataToAppointment } from '../../components/fire_api';
import LdmCard from '../elements/LdmCard';
import { TimeCard } from '../elements/TimeCard';
import ModalPanel from '../elements/ModalPanel';
import './styles.css';

import { getAppointmentTimePeriods } from '../../components/generations';


function PatientAppointmentMakePanel() {

    const { data, setData } = useData();

    const [availableLdms, setAvailableLdms] = useState([]);
    const [selectedLdm, setSelectedLdm] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [appointmentTime, setAppointmentTime] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ldmsData = await getLdms();
                // Фильтруем записи, получая только записи, 
                // доступные для записи самостоятельно пациентом
                const filteredLdms = ldmsData.filter((ldm) => ldm.is_available === true);
                setAvailableLdms(filteredLdms);
            } catch (error) {
                console.error('Error fetching ldms:', error);
            }
        };
        fetchData();
    }, []);

    // выбор лдм
    const handleLdmCardClick = (ldm) => {
        setSelectedLdm(ldm);
        const availablePeriods = getAppointmentTimePeriods();
        setAppointmentTime(availablePeriods);
        setIsModalOpen(true);
    };

    // выбор времени лдм
    const handleTimeCardClick = (time) => {
        setSelectedTime(time);
    };

    // подтверждение оформления записи на лдм
    const handleConfirm = async () => {

        const patients = await findPatientByUserId(data.userData.id)
        const doctorLocations = await getDoctorLocationsByPositionId(selectedLdm.id_position.id);

        if (patients && doctorLocations) {
            const patient = patients[0];
            const doctorLocation = doctorLocations[0];
            const ldmDateTime = new Date();
            ldmDateTime.setHours(selectedTime.hours);
            ldmDateTime.setMinutes(selectedTime.minutes);

            uploadDataToAppointment(patient.id, doctorLocation.id, selectedLdm.id, ldmDateTime);

            setIsModalOpen(false);
            setAppointmentTime([]);
            setSelectedTime(null);
            setSelectedLdm(null);
        } else {
            console.log("Пользователь или должность специалиста не найдена")
        }
    };

    return (
        <div className='content_panel'>
            <ContentLabel title="Записаться на прием" />
            <div className='card_list_frame'>
                {availableLdms.map((ldm) => (
                    <div key={ldm.id}>
                        <LdmCard name={ldm.name} description={ldm.description}
                            price={ldm.price} onClick={() => handleLdmCardClick(ldm)} />
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <ModalPanel >
                    <h3>{selectedLdm.name}</h3>
                    {appointmentTime.map((time) => (
                        <TimeCard hour={time.hours} minute={time.minutes}
                            onClick={() => handleTimeCardClick(time)} />
                    ))}

                    <button onClick={handleConfirm}>Подтвердить</button>
                </ModalPanel>
            )}
        </div>
    )
}

export default PatientAppointmentMakePanel

