import React from 'react'
import './AboutGbv.css'
import SafeSpaceHeader from './SafeSpaceHeader'
import SafeSpaceFooter from './SafeSpaceFooter'
import { Link } from 'react-router-dom'
import tick from './assets/images/checkmark.svg'

const ResponsePrevention = () => {
    return (
        <>
            <SafeSpaceHeader/>
            <section className="aboutPageSection response">
                <div className="colourWrapper">
                    <h1 className="title">Response and Prevention</h1>
                    <h2 className="subTitle">
                        preventing and responding to GBV requires a multi-faceted approach
                    </h2>
                    <ul>
                        <li>
                            <span className="title">
                                <img src={tick} alt="" className="check" />
                                <span>Empowering women and girls</span>
                            </span>
                            <span className="description">
                                Promoting economic independence, ensuring access to education, and providing safe spaces.
                            </span>
                        </li>
                        <li>
                            <span className="title">
                                <img src={tick} alt="" className="check" />
                                <span>Challenging the norms</span>
                            </span>
                            <span className="description">
                                Addressing harmful social norms and beliefs that perpetuate violence.
                            </span>
                        </li>
                        <li>
                            <span className="title">
                                <img src={tick} alt="" className="check" />
                                <span>Involving men and boys</span>
                            </span>
                            <span className="description">
                                Engaging men in conversations about gender equality and promoting respectful, non-violent behavior.
                            </span>
                        </li>
                        <li>
                            <span className="title">
                                <img src={tick} alt="" className="check" />
                                <span>Strengthening support systems</span>
                            </span>
                            <span className="description">
                                Providing access to essential services for survivors, including medical care, counseling, and legal assistance.
                            </span>
                        </li>
                        <li>
                            <span className="title">
                                <img src={tick} alt="" className="check" />
                                <span>Adopting survivor centered approach</span>
                            </span>
                            <span className="description">
                                Ensuring a survivor is treated with dignity, respect, and confidentiality during all stages of response.
                            </span>
                        </li>
                    </ul>
                </div>
            </section>
            
            <section className="aboutPageSection" style={{
                backgroundColor: '#2F2E41',
                color: '#ffffff',
                padding: '3em 2em',
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: '2.5em',
                    color: '#AFABEE',
                    marginBottom: '1.5em',
                    fontWeight: '600'
                }}>Quick Links</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5em',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <Link to="/" style={{
                        padding: '1.2em',
                        backgroundColor: '#AFABEE',
                        color: '#2F2E41',
                        textDecoration: 'none',
                        borderRadius: '15px',
                        fontSize: '1.1em',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'block'
                    }}>
                        🏠 Home
                    </Link>
                    <Link to="/aboutGBV" style={{
                        padding: '1.2em',
                        backgroundColor: '#AFABEE',
                        color: '#2F2E41',
                        textDecoration: 'none',
                        borderRadius: '15px',
                        fontSize: '1.1em',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'block'
                    }}>
                        📚 What is GBV?
                    </Link>
                    <Link to="/getHelp" style={{
                        padding: '1.2em',
                        backgroundColor: '#AFABEE',
                        color: '#2F2E41',
                        textDecoration: 'none',
                        borderRadius: '15px',
                        fontSize: '1.1em',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'block'
                    }}>
                        🆘 Get Help
                    </Link>
                    <Link to="/forum" style={{
                        padding: '1.2em',
                        backgroundColor: '#AFABEE',
                        color: '#2F2E41',
                        textDecoration: 'none',
                        borderRadius: '15px',
                        fontSize: '1.1em',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'block'
                    }}>
                        💬 Safe Circle
                    </Link>
                    <Link to="/myths&facts" style={{
                        padding: '1.2em',
                        backgroundColor: '#AFABEE',
                        color: '#2F2E41',
                        textDecoration: 'none',
                        borderRadius: '15px',
                        fontSize: '1.1em',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'block'
                    }}>
                        🔍 Myths & Facts
                    </Link>
                    <Link to="/quiz" style={{
                        padding: '1.2em',
                        backgroundColor: '#AFABEE',
                        color: '#2F2E41',
                        textDecoration: 'none',
                        borderRadius: '15px',
                        fontSize: '1.1em',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'block'
                    }}>
                        🎯 Take Quiz
                    </Link>
                </div>
            </section>
            
            <SafeSpaceFooter/>
        </>
    )
}

export default ResponsePrevention
