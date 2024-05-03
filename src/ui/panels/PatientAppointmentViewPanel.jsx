import React from 'react';
import { useData } from '../../components/DataProvider';
import ContentLabel from '../elements/ContentLabel'
import './styles.css';

function PatientAppointmentViewPanel() {
  return (
    <div className='content_panel'>
        <ContentLabel title="Назначенные приемы" />
    </div>
  )
}

export default PatientAppointmentViewPanel