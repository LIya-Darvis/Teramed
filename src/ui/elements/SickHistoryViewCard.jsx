import React from 'react';
import './styles.css';

function SickHistoryViewCard(props) {
    return (
        <div className='sick_history_card_frame' onClick={props.onClick}>
            <div className='history_main_info_col'>
                <h4>{props.diagnos}</h4>
                <p>{props.symptoms}</p>
                <p>{props.recomendations}</p>
                <p>{props.doctor}</p>
                <p>Дата установки: {props.diagnosDate}</p>
            </div>
            <div className='history_desc_col'>

            </div>
        </div>
    )
}

export default SickHistoryViewCard