import React from 'react';
import './styles.css';

function AnalysViewCard(props) {
    return (
        <div className='sick_history_card_frame' onClick={props.onClick}>
            <div className='history_main_info_col'>
                <h4>{props.analysType.name}</h4>
                <p>{props.value} {props.analysType.unit}</p>
                <p>{props.doctor.lastname}</p>
                <p>Дата установки: {props.analysDate}</p>
                <p>{props.comment}</p>
            </div>
            <div className='history_desc_col'>

            </div>
        </div>
    )
}

export default AnalysViewCard