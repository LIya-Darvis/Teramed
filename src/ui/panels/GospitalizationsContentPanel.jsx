import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentLabel from '../elements/components/ContentLabel';
import {
    getLdms, getDoctorLocationsByPositionId,
    findDoctorByPositionId, getAppointments, getLdmTypes
} from '../../api/fire_api';
import { generateTimeSlots } from '../../dataProviders/generations';
import LoadingIcon from '../elements/components/LoadingIcon';

const workHours = {
    startHour: 8, // Часы начала рабочего дня
    startMinute: 0, // Минуты начала рабочего дня
    endHour: 17, // Часы окончания рабочего дня
    endMinute: 0 // Минуты окончания рабочего дня
};

const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; // Дни недели, в которые клиника работает



export default function GospitalizationContentPanel() {



    return (
        <div>
            <ContentLabel title="Госпитализация" />


        </div>
    )
}
