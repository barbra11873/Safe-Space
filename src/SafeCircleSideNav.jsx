import React from 'react'
import './SafeCircle.css'
import logo from './assets/images/safecirclewhite.svg'
import SideMenuListItem from './SideMenuListItem'
import homeIcon from './assets/images/uis_clinic-medical.svg'
import storiesIcon from './assets/images/material-symbols_web-stories.svg'
import eventsIcon from './assets/images/mdi_events-check.svg'
import chatBotIcon from './assets/images/streamline-plump_customer-support-7-solid.png'
import learnIcon from './assets/images/tdesign_education-filled.svg'

const SafeCircleSideNav = () => {
    return (
        <nav>
            <div className="top">
                <img src={logo} alt="logo" className="logo"/>
                <h2 id="site-name">Safe Circle &trade;</h2>
            </div>
            <ul className="side-menu">
                <li className="side-menu-item" id="001">
                    <SideMenuListItem menuTitle='Home'
                        menuIcon={homeIcon}
                        id={1}
                        LinkUrl=''
                    />
                </li>
                <li className="side-menu-item" id="002">
                    <SideMenuListItem menuTitle='Stories'
                        menuIcon={storiesIcon}
                        id={2}
                        LinkUrl='stories'
                    />
                </li>
                <li className="side-menu-item" id="003">
                    <SideMenuListItem menuTitle='Events'
                        menuIcon={eventsIcon}
                        id={3}
                        LinkUrl='events'
                    />
                </li>
                <li className="side-menu-item" id="004">
                    <SideMenuListItem menuTitle='Tamara'
                        menuIcon={chatBotIcon}
                        id={4}
                        LinkUrl='chatBot'
                    />
                </li>
                <li className="side-menu-item" id="005">
                    <SideMenuListItem menuTitle='Learn'
                        menuIcon={learnIcon}
                        id={5}
                        LinkUrl='learn'
                    />
                </li>
            </ul>
        </nav>
    )
}

export default SafeCircleSideNav;
