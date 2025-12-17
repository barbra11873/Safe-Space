import React from 'react'
import './HeroSection.css'
import heroDefaultImage from './assets/images/unsplash_G2mR7oP-Ids.png'
import circle1 from './assets/images/Ellipse 4.png'
import Rect from './assets/images/Rectangle 6.png'
import circle2 from './assets/images/Ellipse 5.png'
import { Link } from 'react-router-dom'

const HeroSection = ({
    title = "Hero Title",
    text = "hero main message",
    btn = {buttonText:"button",handler:null,buttonLink:"#"},
    heroImage = heroDefaultImage,
    showLogin = false
}) => {
    return (
        <section className="main-content">
            <img src={circle1} alt="" className="circle1"/>
            <img src={Rect} alt="" id="greenPolygon"/>
            <img src={heroImage} alt="" id="heroIllustration"/>
            <div className="hero-text">
                <h1 className="title">{title}</h1>
                <p>{text}
                    <a href="#" ></a>
                </p>
                <div className="hero-buttons">
                    <Link to={btn.buttonLink} className="hero-cta">{btn.buttonText}</Link>
                    {showLogin && (
                        <Link to="/login" className="hero-cta login-btn">Login</Link>
                    )}
                </div>
            </div>
            <img src={circle2} alt="" className="circle2"/>
        </section>
    )
}

export default HeroSection
