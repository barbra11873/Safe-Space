import React from 'react'
import './SafeSpaceFooter.css'
import { Link } from 'react-router-dom'

const SafeSpaceFooter = () => {
    return (
        <footer>
            <div className="copyright">
                <div className="flex-container">
                    <img src="images/safeCircle.svg" alt="" className="logo"/>
                    <span>&copy; SafeSpace &trade;   2025 </span>
                    <span>all rights reserved</span>
                </div>
                
            </div>
            <div className="usefulLinks">
                <h3>Quick links</h3>
                <ul>
                    <li><Link to = "/chatBot" className="footerlink">chat Bot</Link></li>
                    <li><Link to = "/quiz" className="footerlink">Quizes</Link></li>
                    <li><Link to = "/myths&facts" className="footerlink">myths and facts</Link></li>
                </ul>
            </div>
            <div className="usefulLinks">
                <h3>useful links</h3>
                <ul>
                    <li><Link to = "/" className="footerlink">safeSpace Home</Link></li>
                    <li><Link to = "/aboutGbv" className="footerlink">about GBV</Link></li>
                    <li><Link to = "/aboutUs" className="footerlink">about safe space system</Link></li>
                </ul>
            </div>
        </footer>
    )
}

export default SafeSpaceFooter
