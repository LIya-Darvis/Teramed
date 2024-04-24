import { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter, Switch, Route, Router, Redirect} from 'react-router-dom';
import {AuthorizationPage} from '../ui/pages/AuthorizationPage';

import { useData } from './DataProvider';
import UserPage from '../ui/pages/UserPage';

const DataContext = createContext();

function GlobalSpace() { 
    const { data, setData } = useData();
    
    // const {isLoading, setLoading} = useState();

    return (
        <div>
            {data.isLogin === false && <AuthorizationPage/>}
            {data.isLogin === true && <UserPage/>}
        </div>
    )    
}

export {GlobalSpace}
