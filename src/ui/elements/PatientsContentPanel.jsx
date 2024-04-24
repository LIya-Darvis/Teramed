import React, { useState, useEffect } from 'react';
import { getPatients } from "../../components/api";
import { EditButton, DeleteButton } from './TableButtons';
import SearchPanel from './SearchPanel';
import ContentLabel from './ContentLabel';

function searchPatients(data, searchValue) {
    // Преобразуем строку поиска в нижний регистр для удобства сравнения
    const search = searchValue.toLowerCase();

    // Фильтруем массив данных, оставляя только те элементы, которые соответствуют поисковому запросу
    const filteredPatients = data.filter(patient => {
        // Преобразуем значения свойств доктора в нижний регистр для удобства сравнения
        const { lastname, name, surname, birthday, passportseries, passportnum, gender, 
            address, phone, email, meddate, polisnum, polisfinaldate, photo} = patient;

        const lowercasedLastname = lastname.toLowerCase();
        const lowercasedName = name.toLowerCase();
        const lowercasedSurname = surname.toLowerCase();
        const lowercasedBirthday = birthday.toLowerCase();
        // const lowercasedPassportSeries = passportseries.toLowerCase();
        // const lowercasedPassportNum = passportnum.toLowerCase();
        // const lowercasedGender = gender.toLowerCase();
        const lowercasedAddress = address.toLowerCase();
        // const lowercasedPhone = phone.toLowerCase();
        const lowercasedEmail = email.toLowerCase();
        const lowercasedMedDate = meddate.toLowerCase();
        // const lowercasedPolisNum = polisnum.toLowerCase();
        const lowercasedPolisFinalDate = polisfinaldate.toLowerCase();
        // const lowercasedPhoto = photo.toLowerCase();

        
        // Проверяем, содержит ли хотя бы одно свойство доктора искомое значение
        return (
            lowercasedLastname.includes(search) ||
            lowercasedName.includes(search) ||
            lowercasedSurname.includes(search) ||
            lowercasedBirthday.includes(search) ||
            // lowercasedPassportSeries.includes(search) ||
            // lowercasedPassportNum.includes(search) ||
            // lowercasedGender.includes(search) ||
            lowercasedAddress.includes(search) ||
            // lowercasedPhone.includes(search) ||
            lowercasedEmail.includes(search) ||
            lowercasedMedDate.includes(search) ||
            // lowercasedPolisNum.includes(search) ||
            lowercasedPolisFinalDate.includes(search)
            // lowercasedPhoto.includes(search)

        );
    });

    return filteredPatients;
}



function PatientsContentPanel() {

    const [doctorsData, setDoctorsData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [searchText, setSearchText] = useState('');

    // ассинхронно получаем данные врачей из апи
    useEffect(() => {
        async function fetchData() {
            try {
                const doctors = await getPatients();
                setDoctorsData(doctors);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchData();
    }, [doctorsData]);

    const handleEditDoctor = (doctorId) => {
        console.log("редактирование врача: ", doctorId);
    };

    const handleDeleteDoctor = (doctorId) => {
        console.log("удаление врача: ", doctorId);
    };


    useEffect(() => {
        console.log('Значение value изменилось:', searchText);
        if (searchText.trim() === '') {
            // searchData = doctorsData;
            setSearchData(doctorsData);
        } else {
            setSearchData(searchPatients(doctorsData, searchText));
            console.log(searchData);
        }
    }, [searchText]);



    return (
        <div className='content_panel'>
            <ContentLabel title="Пациенты" />
            <SearchPanel onChange={e => setSearchText(e.target.value)} value={searchText} />

            {doctorsData != [] ? (

                // если данные из апи получены и есть что показать по поиску
                searchData.length > 0 ? 
                
                <div className='table_frame'>
                <table className='data_table'>
                    <thead>
                        <tr>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th>Дата рождения</th>
                            <th>Серия паспорта</th>
                            <th>Номер паспорта</th>
                            {/* <th>Пол</th> */}
                            <th>Адрес</th>
                            <th>Телефон</th>
                            <th>E-mail</th>
                            <th>Номер полиса</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchData.map(doctor => (
                            <tr key={doctor.id}>
                                <td>{doctor.lastname}</td>
                                <td>{doctor.name}</td>
                                <td>{doctor.surname}</td>
                                <td>{doctor.birthday}</td>
                                <td>{doctor.passportseries}</td>
                                <td>{doctor.passportnum}</td>
                                {/* <td>{doctor.gender}</td> */}
                                <td>{doctor.address}</td>
                                <td>{doctor.phone}</td>
                                <td>{doctor.email}</td>
                                {/* <td>{doctor.meddate}</td> */}
                                <td>{doctor.polisnum}</td>
                                {/* <td>{doctor.polisfinaldate}</td> */}
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
            // если мы уже получили данные с апи     
            : 
            <div className='table_frame'>
                <table className='data_table'>
                    <thead>
                        <tr>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th>Дата рождения</th>
                            <th>Серия паспорта</th>
                            <th>Номер паспорта</th>
                            {/* <th>Пол</th> */}
                            <th>Адрес</th>
                            <th>Телефон</th>
                            <th>E-mail</th>
                            <th>Номер полиса</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctorsData.map(doctor => (
                            <tr key={doctor.id}>
                                <td>{doctor.lastname}</td>
                                <td>{doctor.name}</td>
                                <td>{doctor.surname}</td>
                                <td>{doctor.birthday}</td>
                                <td>{doctor.passportseries}</td>
                                <td>{doctor.passportnum}</td>
                                {/* <td>{doctor.gender}</td> */}
                                <td>{doctor.address}</td>
                                <td>{doctor.phone}</td>
                                <td>{doctor.email}</td>
                                {/* <td>{doctor.meddate}</td> */}
                                <td>{doctor.polisnum}</td>
                                {/* <td>{doctor.polisfinaldate}</td> */}
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
            
            ) : (
                <div className="no_results">Ничего не найдено</div>
            )}

        </div>
    )



}

export {PatientsContentPanel}