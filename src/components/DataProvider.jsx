import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { User } from './classes';
const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}

function DataProvider({ children }) {
    // Загрузка данных из апи в глобальную переменную
    // var globalData = {}

    // Задаем стартовые пустые переменные
    var defaultUser = new User(0, 'null', 'null', 'null', 'null');
    var defaultLogin = false;

    const [data, setData] = useState({ isLogin: defaultLogin, userData: defaultUser });

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
}

export { DataProvider }