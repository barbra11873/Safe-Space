import React from 'react'
import './SiteHome.css'
import SafeSpaceHeader from './SafeSpaceHeader'
import SafeSpaceFooter from './SafeSpaceFooter' 
import SectionTemplate from './SectionTemplate' 
import HeroSection from './HeroSection'
import heroImage1 from './assets/images/homePageHeroimgae1.jpg'
import arrowimage1 from './assets/images/arrow_img.svg'
import speakUpImage from './assets/images/speakimg.png'
import mythsImage from './assets/images/mythsimage.png'
import arrowImage2 from './assets/images/orange arrow.svg'
import logo from './assets/images/safeCircle.svg'
import chatBotImage from './assets/images/chatbotimage.png'
import cardImage1 from './assets/images/card-image1.png'
import cardImage2 from './assets/images/card-image2.png'
import cardImage4 from './assets/images/card-image4.png'
import quizImage from './assets/images/quizIllustration.png'
import greenArrow from './assets/images/arrow-green.svg'
import ForumCard from './ForumCard'
import { Link } from 'react-router-dom'

const SiteHome = () => {
    const handleAboutClick = (event) => {
        console.log("about page",event);
    }
    return (
        <main>
            <SafeSpaceHeader bgColor='#9ae9b0ff'/>
            <HeroSection title='Safe Space Home' text='A gender based violence awareness and educational platform'
                btn={{buttonText:"about us",handler:handleAboutClick,buttonLink:"aboutUs"}}
                heroImage={heroImage1}
            />
            <div className="about-section">
                <div className="sec2">
                    <div className="card">
                        <h1 className="title">What is Gender based violence?</h1>
                        <p className="text">
                            did you know that hundreds of men silently suffer oppression and goes completely un noticed
                        </p>
                    </div>

                    <Link to="aboutGBV" className="learn">learn more</Link>
                </div>
            </div>
            <SectionTemplate
                title='SPEAK UP!!!'
                subTitle='It happens alot more often than you think'
                text='When the going gets tough only the tough get going'
                button={{buttonText:"Get Help",buttonImage:arrowimage1,buttonHandler:null,buttonLink:"getHelp"}}
                sectionImage={speakUpImage}
            />
            <section className="forum safe-circle">
                <h1 className="title">
                    Introducing Safe Circle Forum
                </h1>
                <div className="logo-container">
                    <img src={logo} alt="" className="logo"/>
                </div>
                <p className="intro-text">
                    Our social, informative online forum where you can post and interact with safe space community
                </p>
                <div className="card-container">
                    <ForumCard 
                        cardTitle='Survivor Proved Srories'
                        cardImage={cardImage1}
                        cardText='read and learn from documented accounts of people who have beaten GBV'
                        cardButton={{buttonText:"read now",buttonHandler:null}}
                    />
                    <ForumCard 
                        cardTitle='Infographics'
                        cardImage={cardImage2}
                        cardText='informative slides on Gender based violence, providing a visual representation of GBV concepts'
                        cardButton={{buttonText:"Browse now",buttonHandler:null}}
                    />
                    <ForumCard 
                        cardTitle='Educative Articles'
                        cardText='go through our GBV articles on how to fight, avoid, detect, report and get help with such cases'
                        cardButton={{buttonText:"browse now",buttonHandler:null}}
                    />
                    <ForumCard 
                        cardTitle='Vedios'
                        cardImage={cardImage4}
                        cardText='watch both short and lengthy vedios produced by our activists on how to deal with Gender based violence'
                        cardButton={{buttonText:"watch now",buttonHandler:null}}
                    />
                </div>
            </section>
            <SectionTemplate
                title='Myths & Facts'
                subTitle='Gender based Violence is widely mis-understood'
                text='play an interactive drag and drop game, distinguish reality against common mis-conceptions.'
                button={{buttonText:"Shake the truth from the trash",buttonImage:arrowimage1,buttonHandler:null,buttonLink:"myths&facts"}}
                sectionImage={mythsImage}
            />
            <SectionTemplate
                title='Take a Quiz'
                text='How much do you know about Gender based Violence? find out through a short trivia session'
                button={{buttonText:"GBV Trivia",buttonImage:greenArrow,buttonHandler:null,buttonLink:"quiz"}}
                sectionImage={quizImage}
                classNames={'green'}
            />
            <SectionTemplate
                title='Do you have any querries or inquiries?'
                text='Interact with our cutting age state of the art AI chat bot'
                button={{buttonText:"Ask Tamara",buttonImage:arrowImage2,buttonHandler:null,buttonLink:"forum/chatBot"}}
                sectionImage={chatBotImage}
                classNames='chatBot'
            />
            <SafeSpaceFooter/>
        </main>
    )
}

export default SiteHome
