import React from 'react';
import PropTypes from 'prop-types';
import { DeleteButton, EditButton } from '../components/Buttons';
import DataDisplay from '../../../dataProviders/DataDisplay';
import '../styles.css';

const DoctorsTable = ({ doctorsData, handleEditDoctor, handleDeleteDoctor }) => {
    return (
        <DataDisplay
            endpoint="get_doctors"
            params={{}}
            render={(data) => (

                <div className='table_frame'>
                    <table className='data_table'>
                        <thead>
                            <tr>
                                <th>Фамилия</th>
                                <th>Имя</th>
                                <th>Отчество</th>
                                <th>Должность</th>
                                <th>Доступен для записи</th>
                                <th>Архивирован</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctorsData.map(doctor => (
                                <tr key={doctor.id}>
                                    <td>{doctor.lastname}</td>
                                    <td>{doctor.name}</td>
                                    <td>{doctor.surname}</td>
                                    <td>{doctor.position_name}</td>
                                    <td>{doctor.is_available ? 'Да' : 'Нет'}</td>
                                    <td>{doctor.is_archived ? 'Да' : 'Нет'}</td>
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
            )}
        />
    );
};

DoctorsTable.propTypes = {
    doctorsData: PropTypes.array.isRequired,
    handleEditDoctor: PropTypes.func.isRequired,
    handleDeleteDoctor: PropTypes.func.isRequired,
  };

export default DoctorsTable;