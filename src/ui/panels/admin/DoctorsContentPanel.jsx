import React, { useState, useEffect } from 'react';
import SearchPanel from '../../elements/SearchPanel';
import ContentLabel from '../../elements/components/ContentLabel';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import "../styles.css";
import DoctorsTable from '../../elements/tables/DoctorsTable';

export default function DoctorsContentPanel() {
    const doctorsData = useRealtimeData('get_doctors').data;
    const [searchQuery, setSearchQuery] = useState('');

    // Фильтрация данных на основе поискового запроса
    const filteredDoctors = doctorsData?.filter(doctor => {
        const searchString = searchQuery.toLowerCase();
        return (
            doctor.lastname.toLowerCase().includes(searchString) ||
            doctor.name.toLowerCase().includes(searchString) ||
            doctor.surname.toLowerCase().includes(searchString) ||
            doctor.position_name.toLowerCase().includes(searchString)
        );
    });

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleEditDoctor = (id) => {
        // Логика для редактирования врача
        console.log('Редактирование врача с id:', id);
    };

    const handleDeleteDoctor = (id) => {
        // Логика для удаления врача
        console.log('Удаление врача с id:', id);
    };

    return (
        <div>
            <ContentLabel title={"Сотрудники"} />
            <div className='func_frame'>
                <SearchPanel onChange={handleSearchChange}/>
            </div>
            {doctorsData ? (
                <DoctorsTable
                    doctorsData={filteredDoctors}
                    handleEditDoctor={handleEditDoctor}
                    handleDeleteDoctor={handleDeleteDoctor}
                />
            ) : (
                <p>Загрузка...</p>
            )}
        </div>
    );
}

