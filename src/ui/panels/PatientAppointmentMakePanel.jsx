import React, { useState, useEffect } from 'react'
import { useData } from '../../components/DataProvider';
import ContentLabel from '../elements/ContentLabel'
import { ConfirmButton, CloseButton, DeleteButton } from '../elements/Buttons';
import { getLdms, findPatientByUserId, getDoctorLocationsByPositionId, 
    uploadDataToAppointment } from '../../components/fire_api';
import LdmCard from '../elements/LdmCard';
import { TimeCard } from '../elements/TimeCard';
import ModalPanel from '../elements/ModalPanel';
import './styles.css';

import { getAppointmentTimePeriods } from '../../components/generations';


function PatientAppointmentMakePanel() {
    const { data, setData } = useData();

    

    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedLdm, setSelectedLdm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [appointmentTime, setAppointmentTime] = useState([]);


    // выбор специалиста
    const handleDoctorConfirm = async () => {
        
    };

    const handleCloseClick = () => {
        setIsModalOpen(false);
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
        } else {
            console.log("Пользователь или должность специалиста не найдена")
        }
    };

    return (
        <div className='content_panel'>
            <ContentLabel title="Записаться на прием" />
            
            
        </div>
    )
}

export default PatientAppointmentMakePanel

