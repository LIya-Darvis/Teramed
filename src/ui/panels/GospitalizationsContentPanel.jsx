import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentLabel from '../elements/components/ContentLabel';
import GospitalizationReferralTable from '../elements/tables/GospitalizationReferralTable';


export default function GospitalizationContentPanel() {

    return (
        <div>
            <ContentLabel title="Госпитализация" />

            <GospitalizationReferralTable patientId={null}/>
        </div>
    )
}
