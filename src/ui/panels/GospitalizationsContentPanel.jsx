import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentLabel from '../elements/components/ContentLabel';
import GospitalizationReferralTable from '../elements/tables/GospitalizationReferralTable';
import './styles.css';
import GospitalizationTable from '../elements/tables/GospitalizationTable';
import { useData } from '../../dataProviders/DataProvider';

export default function GospitalizationContentPanel() {
    const { data, setData } = useData();

    return (
        <div className='content_panel'>
            <ContentLabel title="Госпитализация" />
            <GospitalizationTable patientId={null}/>
        </div>
    )
}
