import React from 'react'
import './styles.css'

export default function ContentLabel(props) {
  return (
    <div>
        <div className='content_label'>
            {props.title}
        </div>
    </div>
  )
}
