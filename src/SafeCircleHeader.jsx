import React from 'react'
import notificationsIcon from './assets/images/ion_notifications.svg'
import profileIcon from './assets/images/profile.svg'
import activityIcon from './assets/images/hugeicons_activity-04.svg'
import settingsIcon from './assets/images/fluent_apps-settings-16-filled.svg'
import { Link } from 'react-router-dom'
import './SafeCircle.css'

const SafeCircleHeader = () => {
    return (
        <header id='forumHeader'>
            <div className="left">
                <img src={notificationsIcon} alt="" className="ham-menu"/>
            </div>
            <div className="center">
                <ul className="menu">
                    <li className="menu-item" id="menuLink1">
                        <Link ><img src={profileIcon} alt=""/></Link>
                    </li>
                    <li className="menu-item" id="menuLink2">
                        <Link ><img src={activityIcon} alt=""/></Link>
                    </li>
                    <li className="menu-item" id="menuLink2">
                        <Link><img src={settingsIcon} alt=""/></Link>
                    </li>
                </ul>
                
            </div>
            <div className="right">
                <Link className="log-in">log in</Link>
                <Link className="sign-up">sign in</Link>
            </div>
        </header>
    )
}

export default SafeCircleHeader
