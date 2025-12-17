import React from 'react'
import '../SafeCircle.css'
import bulletImage from '../assets/images/material-symbols_amp-stories-rounded.svg'
import SectionTemplate from '../SectionTemplate'
import storiesIcon from '../assets/images/material-symbols_web-stories.svg'
import storiesSectionImage from '../assets/images/EXTRA_3.png'
import eventsIcon from '../assets/images/mdi_events-check.svg'
import eventsSectionImage from '../assets/images/events.svg'
import Testimonial from './Testimonial'
import shortImage from '../assets/images/shorti.svg'
import steveProfile from '../assets/images/daktariSteveOwilli.svg'
import me from '../assets/images/me3 1.png'
import learnIcon from '../assets/images/tdesign_education-filled.svg'
import learnSectionImage from '../assets/images/EXTRA_31.png'
import supportIcon from '../assets/images/streamline-plump_customer-support-7-solid.png'
import supportSectionImage from '../assets/images/admins.svg'
import safeCircleImage from '../assets/images/safeCircle.svg'


const HomeTab = () => {
    return (
        <section class="home-component tab" id="homeTab">
            <div class="homeTabHero">
                <div class="hero-content">
                    <h1>About safe circle</h1>
                    <p><strong>Safe Circle</strong> is your confidential sanctuary for combating gender-based violence.</p>
                    <p>Discover GBV through captivating infographics, articles, and videos, connect with powerful survivor stories, share your voice safely, access professional support, join awareness events, make a difference by supporting anti-GBV movements.</p>
                    <p>Enjoy <em>complete anonymity</em>, <em>confidentiality</em>, <em>instant access</em>, and <em>top security</em>. Empower yourself to heal, learn, and advocate!</p>
                </div>
                <img src={safeCircleImage} alt="Safe Circle - We Got You" className="hero-illustration" />
            </div>
            <SectionTemplate
                title='Survivor Proved Stories'
                subTitle='Empower yourself with the wisdom of survivors: Learn from real experiences to prevent future harm'
                text='watch hundreds of vedios and articles from victims of GBV, how silence is the worst perpetrator,
                    learn from peoples potholes, get enlightened!'
                button={{ buttonText: "Stories Tab", buttonImage: storiesIcon, buttonLink: "stories" }}
                sectionImage={storiesSectionImage}
            />
            <SectionTemplate
                title='Follow Our Events'
                subTitle='mark your calendar, stay in the loop'
                text='use the events tab to access the calender, know about our seminars, virtual confrencres, awareness campaigns,
                    talk shows and live events'
                button={{ buttonText: "Events Tab", buttonImage: eventsIcon, buttonLink: "events" }}
                sectionImage={eventsSectionImage}
            />
            <div class="specs">
                <div class="item">
                    <p class="number">201+</p>
                    <p class="description">survivors</p>
                </div>
                <div class="item">
                    <p class="number">1050+</p>
                    <p class="description">users</p>
                </div>
                <div class="item">
                    <p class="number">45+</p>
                    <p class="description">staff</p>
                </div>
            </div>
            <div class="admins">
                <h1>safe space adminmistrators</h1>
                <div class="AdminCardContainer">

                    <Testimonial
                        name='Dr. Steve Owilli'
                        title='General system administration'
                        profileImage={steveProfile}
                        description="i handle the admin panel, direct the production and publication of survivor proved stories,
                            post educative content in the learn tab"
                    />

                </div>
            </div>
            <SectionTemplate
                title='Learn About GBV'
                subTitle='The most potent weapon in the hands of the oppressor is the mind of the oppressed.'
                text='The best weapon is to be informed, Use the learn tab to access tons of educative material about GBV
                    , learn in form of short videos, documentaries, articles and infographics'
                button={{ buttonText: "Learn Tab", buttonImage: learnIcon, buttonLink: "learn" }}
                sectionImage={learnSectionImage}
            />
            <SectionTemplate
                title='Get Support'
                subTitle='need emotional or phycological  support?'
                text='we will follow up on you both emotionally and mentallly through the support tab.
                    it is our primary communication channel to you, so be sure to check it out'
                button={{ buttonText: "get Support", buttonImage: supportIcon, buttonLink: "/getHelp" }}
                sectionImage={supportSectionImage}
            />
        </section>
    )
}

export default HomeTab
