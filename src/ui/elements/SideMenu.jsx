import { Children, useState } from 'react';
import { useData } from '../../components/DataProvider';
import './styles.css';
import UserAccountPanel from '../panels/UserAccountPanel';
import { LogOutButton } from './TableButtons';

function SideMenu({ children }) {

    

    return (
        <div className='side_menu_panel'>
            <UserAccountPanel/>
            {/* <h3 className='side_menu_app_name'>TERAMED</h3> */}
            <div className='side_buttons_panel'>
                {children}
            </div>
            <LogOutButton/>
        </div>
    )
}

export {SideMenu}