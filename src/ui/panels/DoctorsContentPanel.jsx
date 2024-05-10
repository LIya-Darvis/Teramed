import React, { useState, useEffect } from 'react';
import { getDoctors, getPositions, uploadDoctorData } from '../../components/fire_api';
import { EditButton, DeleteButton, AddButton, ConfirmButton, CloseButton } from '../elements/Buttons';
import SearchPanel from '../elements/SearchPanel';
import DropdownList from '../elements/DropdownList';
import ContentLabel from '../elements/ContentLabel';
import ModalPanel from '../elements/ModalPanel';
import "./styles.css"
import ModalEditText from '../elements/ModalEditText';
import ModalCheckBox from '../elements/ModalCheckBox';

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
    const [positionsData, setPositionsData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [lastname, setLastname] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [doctorId, setDoctorId] = useState(null);
    const [selectedPositionId, setSelectedPositionId] = useState(null);

    // ассинхронно получаем данные врачей из апи
    useEffect(() => {
        async function fetchData() {
            try {
                const doctors = await getDoctors();
                setDoctorsData(doctors);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchData();
    }, []);

    // ассинхронно получаем должности врачей из апи
    useEffect(() => {
        async function fetchData() {
            try {
                const positions = await getPositions();
                setPositionsData(positions);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchData();
    }, []);

    // для очистки и обнуления статичных переменных
    const clearData = () => {
        setLastname('');
        setName('');
        setSurname('');
        setIsAvailable(false);
        setLogin('');
        setPassword('');
        setSelectedPositionId(null);
        setDoctorId(null);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handlePositionSelect = (positionId) => {
        setSelectedPositionId(positionId);
    };

    const handleCheckBoxChange = (newValue) => {
        setIsAvailable(newValue);
      };

    // закрытие модального окна
    const handleCloseClick = () => {
        clearData();
    };

    // открытие окна для добавления врача 
    const handleAddDoctor = () => {
        setIsAddModalOpen(true);
        console.log("добавление врача");
    };

    // открытие окна для редактирования врача
    const handleEditDoctor = (doctorId) => {
        setIsEditModalOpen(true);
        setDoctorId(doctorId);
        console.log("редактирование врача: ", doctorId);
    };

    // открытие окна для удаления врача
    const handleDeleteDoctor = (doctorId) => {
        setIsDeleteModalOpen(true);
        setDoctorId(doctorId);
        console.log("удаление врача: ", doctorId);
    };

    // подтверждение добавления врача
    const handleAddConfirm = async () => {
        uploadDoctorData(lastname, name, surname, selectedPositionId, isAvailable, login, password);
        clearData();
    };

    // подтверждение редактирования врача
    const handleEditConfirm = async () => {
        console.log(lastname, name, surname, selectedPositionId);
        clearData();
    };

    // подтверждение удаления врача
    const handleDeleteConfirm = async () => {
        clearData();
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
                <AddButton title="Добавить сотрудника" onClick={() => handleAddDoctor()} />
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
                    <CloseButton title="Х" onClick={() => handleCloseClick()}/>
                    <h3>Добавление врача</h3>
                    <ModalEditText placeholder={"Фамилия"} value={lastname} onChange={e => setLastname(e.target.value)}/>
                    <ModalEditText placeholder={"Имя"} value={name} onChange={e => setName(e.target.value)}/>
                    <ModalEditText placeholder={"Отчество"} value={surname} onChange={e => setSurname(e.target.value)}/>
                    <ModalEditText placeholder={"Логин"} value={login} onChange={e => setLogin(e.target.value)}/>
                    <ModalEditText placeholder={"Пароль"} value={password} onChange={e => setPassword(e.target.value)}/>
                    <DropdownList elements={positionsData} onSelect={handlePositionSelect}/>
                    <ModalCheckBox title={"Доступен для записи"} value={isAvailable} onChange={handleCheckBoxChange}/>
                    <ConfirmButton title="Подтвердить" onClick={() => handleAddConfirm()}/>
                </ModalPanel>
            )}
            {isEditModalOpen && (
                <ModalPanel >
                    <CloseButton title="Х" onClick={() => handleCloseClick()}/>
                    <h3>Редактирование врача {doctorId}</h3>
                    <ModalEditText placeholder={"Фамилия"} value={lastname} onChange={e => setLastname(e.target.value)}/>
                    <ModalEditText placeholder={"Имя"} value={name} onChange={e => setName(e.target.value)}/>
                    <ModalEditText placeholder={"Отчество"} value={surname} onChange={e => setSurname(e.target.value)}/>
                    <DropdownList elements={positionsData} onSelect={handlePositionSelect}/>
                    <ConfirmButton title="Подтвердить" onClick={() => handleEditConfirm()}/>
                </ModalPanel>
            )}
            {isDeleteModalOpen && (
                <ModalPanel >
                    <CloseButton title="Х" onClick={() => handleCloseClick()}/>
                    <h3>Удаление врача</h3>
                    <p>Вы действительно хотите удалить эту запись?</p>
                    <ConfirmButton title="Подтвердить" onClick={() => handleDeleteConfirm()}/>
                </ModalPanel>
            )}
        </div>
    )
}

