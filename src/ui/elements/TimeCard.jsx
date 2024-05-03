import React from 'react'
import './styles.css'

export function TimeCard(props) {
  return (
    <div className='time_card_frame' onClick={props.onClick}>
        <p>{props.hour}:{props.minute}</p> 
    </div>
  )
}

