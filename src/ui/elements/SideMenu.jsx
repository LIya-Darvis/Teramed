import { Children, useState } from 'react';
import { useData } from '../../dataProviders/DataProvider';
import './styles.css';
import UserAccountPanel from '../panels/UserAccountPanel';
import { LogOutButton } from './components/Buttons';

function SideMenu({ children }) {
    const { data, setData } = useData();    

    const handleLogOutClick = () => {
        setData({ isLogin: false, userData: null })
    };

    return (
        <div className='side_menu_panel'>
            <UserAccountPanel/>
            <div className='side_buttons_panel'>
                {children}
            </div>
            <LogOutButton onClick={() => handleLogOutClick()}/>
        </div>
    )
}
export {SideMenu}





