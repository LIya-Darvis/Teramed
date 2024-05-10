import React, { useState, useEffect } from 'react';
import { getDoctors } from '../../components/fire_api';
import { EditButton, DeleteButton, AddButton } from '../elements/Buttons';
import SearchPanel from '../elements/SearchPanel';
import ContentLabel from '../elements/ContentLabel';
import ModalPanel from '../elements/ModalPanel';
import "./styles.css"

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
    const [doctorsData, setDoctorsData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [doctorId, setDoctorId] = useState(null);

    // ассинхронно получаем данные врачей из апи
    useEffect(() => {
        async function fetchData() {
            try {
                const doctors = await getDoctors();
                setDoctorsData(doctors);
                console.log(" => ", doctors)
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchData();
    }, []);

    const handleCloseClick = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setDoctorId(null);
    };

    const handleAddDoctor = () => {
        setIsAddModalOpen(true);
        console.log("добавление врача");
    };

    const handleEditDoctor = (doctorId) => {
        setIsEditModalOpen(true);
        setDoctorId(doctorId);
        console.log("редактирование врача: ", doctorId);
    };

    const handleDeleteDoctor = (doctorId) => {
        setIsDeleteModalOpen(true);
        setDoctorId(doctorId);
        console.log("удаление врача: ", doctorId);
    };

    // подтверждение добавления врача
    const handleAddConfirm = async () => {
        setIsAddModalOpen(false);
        setDoctorId(null);
    };

    // подтверждение редактирования врача
    const handleEditConfirm = async () => {
        setIsEditModalOpen(false);
        setDoctorId(null);
    };

    // подтверждение удаления врача
    const handleDeleteConfirm = async () => {
        setIsDeleteModalOpen(false);
        setDoctorId(null);
    };

    // useEffect(() => {
    //     console.log('Значение value изменилось:', searchText);
    //     if (searchText.trim() === '') {
    //         // searchData = doctorsData;
    //         setSearchData(doctorsData);
    //     } else {
    //         setSearchData(searchDoctors(doctorsData, searchText));
    //         console.log(searchData);
    //     }
    // }, [searchText]);

    return (
        <div className='content_panel'>
            <ContentLabel title="Сотрудники" />
            <div className='func_frame'>
                <SearchPanel onChange={e => setSearchText(e.target.value)} value={searchText} />
                <AddButton title="Добавить сотрудника" onClick={() => handleAddDoctor()}/>
            </div>

            <div className='table_frame'>
                <table className='data_table'>
                    <thead>
                        <tr>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th>Должность</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctorsData.map(doctor => (
                            <tr key={doctor.id}>
                                <td>{doctor.lastname}</td>
                                <td>{doctor.name}</td>
                                <td>{doctor.surname}</td>
                                <td>{doctor.position.name}</td>
                                <td>
                                    <div className='table_buttons_frame'>
                                        <EditButton onClick={() => handleEditDoctor(doctor.id)} />
                                        <DeleteButton onClick={() => handleDeleteDoctor(doctor.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAddModalOpen && (
                <ModalPanel >
                    <button onClick={handleCloseClick}>Закрыть</button>
                    <h3>Добавление врача</h3>
                    <button onClick={handleAddConfirm}>Подтвердить</button>
                </ModalPanel>
            )}
            {isEditModalOpen && (
                <ModalPanel >
                    <button onClick={handleCloseClick}>Закрыть</button>
                    <h3>Редактирование врача {doctorId}</h3>
                    <button onClick={handleEditConfirm}>Подтвердить</button>
                </ModalPanel>
            )}
            {isDeleteModalOpen && (
                <ModalPanel >
                    <button onClick={handleCloseClick}>Закрыть</button>
                    <h3>Удаление врача {doctorId}</h3>
                    <button onClick={handleDeleteConfirm}>Подтвердить</button>
                </ModalPanel>
            )}
        </div>
    )
}

