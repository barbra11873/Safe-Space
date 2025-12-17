import React from 'react'
import SafeSpaceHeader from './SafeSpaceHeader'
import SafeSpaceFooter from './SafeSpaceFooter'
import './AboutGbv.css'
import letterS from './assets/images/letter_s.svg'
import letterI from './assets/images/I.svg'
import shortImage from './assets/images/shorti.svg'
import steveProfile from './assets/images/daktariSteveOwilli.svg'
import me from './assets/images/me3 1.png'
import tamtam from './assets/images/talia 1.png'
import bgImage from './assets/images/usImage.png'

const aboutUs = () => {
    return (
        <main className='aboutUsPage'>
            <SafeSpaceHeader />
            <div className="aboutUsHero">
                <div className="colourWrapper">
                    <h1 className="title">
                        About Us
                    </h1>
                    <div className="vision">
                        <p className="vision">Vission: </p>
                        <p className="visionText">" To create a digital community that promotes healing, understanding, and empowerment. "</p>
                    </div>
                </div>
            </div>
            <div className="aboutUsText">
                <div className="textWrapper">
                    <div className="imageWrapper">
                        <img src={letterS} alt="" />
                    </div>
                    <p className="text">
                        afeSpace is an interactive web-based platform designed to raise awareness, provide education, and foster open conversations around Gender-Based Violence (GBV). The system seeks to empower individuals by offering a secure and inclusive environment where users can learn, share, and seek support without fear of stigma or judgment.
                    </p>
                </div>
                <div className="textWrapper">
                    <div className="imageWrapper">
                        <img src={letterI} alt="" />
                    </div>
                    <p className="text">
                        In SafeSpace, every voice matters, every story counts, and every step toward awareness makes a difference.By ensuring anonymity, inclusivity, and empathy, SafeSpace bridges the gap between awareness and action — encouraging everyone, regardless of gender or background, to take part in ending GBV.
                    </p>
                </div>
                <div className="textWrapper">
                    <div className="imageWrapper">
                        <img src={letterS} alt="" />
                    </div>
                    <p className="text">
                        safeSpace integrates multiple features to promote both learning and engagement:Awareness Hub, Anonymous Chatbot,SafeSpace Forum,Interactive Learning and Myths and Facts Section.                        </p>
                </div>
            </div>
            <div className="team" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="colourWrapper">

                    <div className="teamMember">
                        <img src={steveProfile} alt="" />
                        <p className="memberName">Dr Steve Owili</p>
                    </div>
                    <div className="separator"></div>
                    <div className="teamMember" style={{ flexDirection: "column-reverse" }}>
                        <img src={tamtam} alt="" />
                        <p className="memberName">Talia Tamara</p>
                    </div>
                    <div className="separator"></div>
                    <div className="teamMember">
                        <img src={tamtam} alt="" />
                        <p className="memberName">Aaron Barbra</p>
                    </div>
                    <div className="separator"></div>

                </div>
            </div>
            <SafeSpaceFooter />
        </main>
    )
}

export default aboutUs
