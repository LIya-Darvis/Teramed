import PropTypes from 'prop-types';
import { DopInfoButton, EditButton } from "../components/Buttons";
import './styles.css';

const PatientsTable = ({ patientsData, handleDiagnosPatient, handleAnalysPatient, handleAppointmentReferralPatient, handleGospitalizationsPatient, handleOpenModal, doctorPosition }) => {
    return (

        <div className='table_frame'>
            {patientsData.length > 0 ? (
                <table className='data_table'>
                    <thead>
                        <tr>
                            <th>Пациент</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientsData.map(patient => (
                            <tr key={patient.id}>
                                <td>{patient.lastname} {patient.name} {patient.surname}</td>
                                <td>
                                    <div className='table_buttons_frame'>
                                        <DopInfoButton onClick={() => handleAnalysPatient(patient.patient_id)} title={"Анализы"} />
                                        <DopInfoButton onClick={() => handleDiagnosPatient(patient.patient_id)} title={"Диагнозы"} />
                                        <DopInfoButton onClick={() => handleAppointmentReferralPatient(patient.patient_id)} title={"Направление"} />
                                        <DopInfoButton onClick={() => handleGospitalizationsPatient(patient.patient_id)} title={"Госпитализация"} />
                                        <DopInfoButton onClick={() => handleOpenModal(patient)} title={"Подробнее"} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет данных</p>
            )}
        </div>

    );
};

PatientsTable.propTypes = {
    patientsData: PropTypes.array.isRequired,
    handleDiagnosPatient: PropTypes.func.isRequired,
    handleAnalysPatient: PropTypes.func.isRequired,
    handleAppointmentReferralPatient: PropTypes.func.isRequired,
    handleGospitalizationsPatient: PropTypes.func.isRequired,
    handleOpenModal: PropTypes.func.isRequired,
    doctorPosition: PropTypes.string,
};

export default PatientsTable;