import React, { useEffect, useState } from 'react'
import ContentLabel from '../elements/components/ContentLabel'
import { useData } from '../../dataProviders/DataProvider';


function PatientMedCardPanel() {
  const { data, setData } = useData();

  return (
    <div className='content_panel'>
      <ContentLabel title="Моя медицинская карта" />

    </div>
  )
}

export default PatientMedCardPanel