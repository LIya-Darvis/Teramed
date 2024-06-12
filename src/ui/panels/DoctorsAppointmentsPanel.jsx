import React, { useState, useEffect } from 'react'
import { useData } from '../../dataProviders/DataProvider';
import { AddButton, CloseButton, TopPanelButton, TopPanelDopButton } from '../elements/components/Buttons';
import './styles.css';



function DoctorsAppointmentsPanel() {
  const { data, setData } = useData();

  return (
    <div>
      направления определенного врача

    </div>
  )
}

export default DoctorsAppointmentsPanel

