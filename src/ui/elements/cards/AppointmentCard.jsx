import React from "react";

const AppointmentCard = ({ appointment, onClick }) => {

    console.log(appointment)

    const cardStyles = {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '2px 25px 34px 25px',
        // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        // margin: '16px',
        textAlign: 'center'
    };

    const headerStyles = {
        fontSize: '24px',
        marginBottom: '16px'
    };

    const textStyles = {
        margin: '7px 0px',
        fontSize: '18px'
    };

    const buttonStyles = {
        backgroundColor: '#4B5672',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '16px'
    };

    const buttonHoverStyles = {
        backgroundColor: '#4B5672'
    };

    return (
        <div style={cardStyles}>
            <h3 style={headerStyles}>{appointment.event.name}</h3>
            <p style={textStyles}>Специалист: {appointment.doctor.lastname} {appointment.doctor.name} {appointment.doctor.surname}</p>
            <p style={textStyles}>Пациент: {appointment.patient.lastname} {appointment.patient.name} {appointment.patient.surname}</p>
            <p style={textStyles}>Дата: {appointment.datetime.toLocaleDateString()} {appointment.datetime.toLocaleTimeString()}</p>
            <p style={textStyles}>Кабинет: {appointment.room.num}</p>
            <button 
                style={buttonStyles} 
                onClick={() => onClick(appointment)}
                onMouseEnter={(e) => e.target.style.backgroundColor = buttonHoverStyles.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = buttonStyles.backgroundColor}
            >
                Информация о пациенте
            </button>
        </div>
    );
};

export default AppointmentCard;