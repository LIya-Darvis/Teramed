import React, { useState, useEffect } from 'react';
import { getDoctors } from '../../../api/supabaseApi';
import SearchPanel from '../../elements/SearchPanel';
import ContentLabel from '../../elements/components/ContentLabel';
import useRealtimeData from '../../../dataProviders/useRealtimeData';
import "../styles.css";
import DoctorsTable from '../../elements/tables/DoctorsTable';

// function searchDoctors(data, searchValue) {
//     // Преобразуем строку поиска в нижний регистр для удобства сравнения
//     const search = searchValue.toLowerCase();

//     // Фильтруем массив данных, оставляя только те элементы, которые соответствуют поисковому запросу
//     const filteredDoctors = data.filter(doctor => {
//         // Преобразуем значения свойств доктора в нижний регистр для удобства сравнения
//         const { lastname, name, surname, position } = doctor;
//         const lowercasedLastname = lastname.toLowerCase();
//         const lowercasedName = name.toLowerCase();
//         const lowercasedSurname = surname.toLowerCase();
//         const lowercasedPosition = position.toLowerCase();

//         // Проверяем, содержит ли хотя бы одно свойство доктора искомое значение
//         return (
//             lowercasedLastname.includes(search) ||
//             lowercasedName.includes(search) ||
//             lowercasedSurname.includes(search) ||
//             lowercasedPosition.includes(search)
//         );
//     });

//     return filteredDoctors;
// }

export default function DoctorsContentPanel() {
    const doctorsData = useRealtimeData('get_doctors');
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
            <SearchPanel onChange={handleSearchChange}/>
            {doctorsData ? (
                <DoctorsTable
                    doctorsData={filteredDoctors}
                    handleEditDoctor={handleEditDoctor}
                    handleDeleteDoctor={handleDeleteDoctor}
                />
            ) : (
                <p>Загрузка данных...</p>
            )}
        </div>
    );
}

