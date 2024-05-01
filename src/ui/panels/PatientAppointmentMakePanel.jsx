import React, { useState, useEffect } from 'react'
import ContentLabel from '../elements/ContentLabel'
import ComboBoxList from '../elements/ComboBoxList';
import { getLdms } from '../../components/fire_api';
import LdmCard from '../elements/LdmCard';
import ModalPanel from '../elements/ModalPanel';
import './styles.css';

import { getAppointmentTimePeriods } from '../../components/generations';


function PatientAppointmentMakePanel() {

    const [availableLdms, setAvailableLdms] = useState([]);
    const [selectedLdm, setSelectedLdm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [appointmentTime, setAappointmentTime] = useState([]);

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

    const handleLdmCardClick = (ldm) => {
        setSelectedLdm(ldm);
        setIsModalOpen(true);
        const availablePeriods = getAppointmentTimePeriods()
        setAappointmentTime(availablePeriods)
        console.log(availablePeriods);
    };

    const handleConfirm = () => {
        setIsModalOpen(false);
        setAappointmentTime([])
        // Здесь можно добавить логику подтверждения записи на прием
    };

    return (
        <div className='content_panel'>
            <ContentLabel title="Записаться на прием" />
            <div className='card_list_frame'>
                {availableLdms.map((ldm) => (
                    <div key={ldm.id}>
                        <LdmCard name={ldm.name} description={ldm.description} 
                                price={ldm.price} onClick={() => handleLdmCardClick(ldm)}/>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <ModalPanel >
                    <h2>{selectedLdm.position.name}</h2>
                    {appointmentTime}
                    <button onClick={handleConfirm}>Подтвердить</button>
                </ModalPanel>
            )}
        </div>
    )
}

export default PatientAppointmentMakePanel

