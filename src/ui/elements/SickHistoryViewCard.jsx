import React from 'react';
import './styles.css';

function SickHistoryViewCard(props) {
    return (
        <div className='sick_history_card_frame' onClick={props.onClick}>
            <div className='history_main_info_col'>
                <p>Диагноз: {props.diagnos}</p>
                <p>Симптомы: {props.symptoms}</p>
                <p>Рекомендации: {props.recomendations}</p>
                <p>Установлен: {props.doctor.lastname} {props.doctor.name} {props.doctor.surname}</p>
                <p>Дата установки: {props.diagnosDate}</p>
            </div>
            <div className='history_desc_col'>

            </div>
        </div>
    )
}

export default SickHistoryViewCard