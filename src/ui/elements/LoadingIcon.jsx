import React from 'react';
import { motion } from 'framer-motion';
import loadingIcon from '../../assets/icons/refresh-2-svgrepo-com.svg';

export default function LoadingIcon () {
    return (
        <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <img src={loadingIcon} alt="Loading" style={{
                width: '30px', height: '30px',
                borderRadius: '50px', padding: '6px'
            }} />
        </motion.div>
    );
};