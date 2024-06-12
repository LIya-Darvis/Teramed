import React, { useEffect, useState } from 'react'
import ContentLabel from '../elements/components/ContentLabel'
import { useData } from '../../dataProviders/DataProvider';

function PatientAppointmentReferralsViewPanel() {
  const { data, setData } = useData();

  return (
    <div>
      <ContentLabel title="Мои направления на прием" />
      
    </div>
  )
}

export default PatientAppointmentReferralsViewPanel





