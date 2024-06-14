import React, { useEffect, useState } from 'react'
import ContentLabel from '../elements/components/ContentLabel'
import { useData } from '../../dataProviders/DataProvider';
import GospitalizationReferralTable from '../elements/tables/GospitalizationReferralTable';


function GospitalizationReferralsPanel() {
    const { data, setData } = useData();

    return (
        <div className='content_panel'>
            <ContentLabel title="Направления на госпитализацию" />
            <GospitalizationReferralTable patientId={null} />
        </div>
    )
}

export default GospitalizationReferralsPanel