import React, { useState } from 'react';
import { motion } from 'framer-motion';
import arrowIcon from '../../assets/icons/chevron-down-svgrepo-com.svg';

function PatientInfoCard({ patient, position, onClickSickHistory, onClickAnalises, onClickGospitalization }) {

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <h4>{patient.lastname} {patient.name} {patient.surname}</h4>
                <p>Дата рождения: {patient.birthday} ({patient.age})</p>
                <p>Пол: {patient.gender.name}</p>
                <button
                    style={styles.buttonStyles}
                    onClick={() => onClickSickHistory(patient)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHoverStyles.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.buttonStyles.backgroundColor}
                >
                    История болезни
                </button>
                <button
                    style={styles.buttonStyles}
                    onClick={() => onClickAnalises(patient)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHoverStyles.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.buttonStyles.backgroundColor}
                >
                    Анализы
                </button>
                {position === 'Терапевт' && (
                    <button
                        style={styles.buttonStyles}
                        onClick={() => onClickGospitalization(patient)}
                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHoverStyles.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = styles.buttonStyles.backgroundColor}
                    >
                        Госпитализация
                    </button>
                )}
            </div>
            <button onClick={toggleExpand} style={styles.button}>
                <motion.img
                    src={arrowIcon}
                    alt='Показать информацию'
                    style={styles.icon}
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </button>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ overflow: 'hidden' }}
            >
                {isExpanded && (
                    <div style={styles.additionalInfo}>
                        <p>Зарегистрирован в системе: {patient.med_date}</p>
                        <p>Номер страхового полиса: {patient.polis_num}</p>
                        <p>Дата окончания страхового полиса: {patient.polis_final_date}</p>
                        <p>Серия паспорта: {patient.passport_series}</p>
                        <p>Номер паспорта: {patient.passport_num}</p>
                        <p>Почта: {patient.email}</p>
                        <p>Телефон: {patient.phone}</p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

// Пример стилей для карточки пациента
const styles = {
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '-20px -10px',
        maxWidth: '400px',
        width: '100%',
        height: 'fit-content',
        margin: '20px 15px',
        // marginBottom: '20px',
        fontSize: '16px',
    },
    header: {
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#ffffff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        outline: 'none',
    },
    icon: {
        width: '30px',
        height: '30px',
    },
    additionalInfo: {
        marginTop: '20px',
        borderTop: '1px solid #e0e0e0',
        paddingTop: '10px',
    },
    buttonStyles: {
        backgroundColor: '#4B5672',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        margin: '6px 10px'
    },
    buttonHoverStyles: {
        backgroundColor: '#4B5672'
    },
};

export default PatientInfoCard