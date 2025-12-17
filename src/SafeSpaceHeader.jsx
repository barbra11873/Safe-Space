import React, { useState } from 'react'
import './SafeSpaceHeader.css'
import logo from './assets/safeCircle.svg'
import {Link} from 'react-router-dom'

const SafeSpaceHeader = ({bgColor = "#F0F8FF"}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header style={{backgroundColor: bgColor}}>
            <div className="left">
                <Link to="/">
                    <img src={logo} alt="logo" className="logo"/>
                    <div className="left-wrapper">
                        <h2 id="site-name">Safe Space</h2>
                        <p id="site-slogan">Together we build safer spaces</p>
                    </div>
                </Link>
            </div>
            <div className="right">
                <ul className={`menu ${isMenuOpen ? 'menu-open' : ''}`}>
                    <li className="menu-item">
                        <Link to="/aboutGBV" onClick={() => setIsMenuOpen(false)}>about</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/myths&facts" onClick={() => setIsMenuOpen(false)}>myths & facts</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/quiz" onClick={() => setIsMenuOpen(false)}>quiz</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/forum" onClick={() => setIsMenuOpen(false)}>forum</Link>
                    </li>
                </ul>

                <div className="contact-info">
                    <Link to="/getHelp" className="get-help-link">Get Help</Link>
                </div>

                <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </div>
        </header>
    )
}

export default SafeSpaceHeader
