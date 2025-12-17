import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import arrowImage from './assets/images/arrow1.svg'
import iconImage from './assets/images/uis_clinic-medical.svg'
import './SafeCircle.css'

const SideMenuListItem = ({
    menuTitle = "menu item",
    menuArrowImage = arrowImage,
    menuIcon = iconImage,
    eventHanlder = null,
    LinkUrl = "/forum",
    id = 0
}) => {
    return (
        <NavLink to = {LinkUrl} className="side-menu-item" id={id} onClick={eventHanlder}>
            <img src={menuIcon} alt="" className="icon"/>
            <span className="tab-link">{menuTitle}</span>
            <img src={menuArrowImage} alt="->" className="arrow"/>
        </NavLink>
    )
}

export default SideMenuListItem
