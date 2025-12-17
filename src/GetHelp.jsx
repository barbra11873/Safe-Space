import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './GetHelp.css'
import SafeSpaceHeader from './SafeSpaceHeader'
import SafeSpaceFooter from './SafeSpaceFooter'
import femaleAvatar from './assets/images/undraw_female-avatar_7t6k.svg'
import line1 from './assets/images/Line 1.svg'
import phoneIllustration from "./assets/images/undraw_talking-on-the-phone_lc9v 1.svg"
import shelterImage1 from "./assets/images/unsplash_OyFlLGOaWmA.png"
import shelterImage2 from "./assets/images//unsplash_XGvwt544g8k.svg"
import shelterImage3 from "./assets/images/unsplash_yEeUZ1snEuk.svg"
import house1 from "./assets/images/unsplash_BpLS--lmh5E.png"
import house2 from "./assets/images/unsplash_q9Gg5iWl3VQ.png"
import map from "./assets/images/map sample 1.png"

const helpCenters = {
  kisii: {
    'kitutu chache': [
      { name: 'Kisii Huduma Center', address: 'Located in Kitutu Chache, Kisii County' },
      { name: 'Kisii Umoja Center', address: 'Near Kitutu Chache subcounty office' },
      { name: 'Kitutu Chache Police Station', address: 'Kitutu Chache, Kisii County' }
    ],
    'kitutu masaba': [
      { name: 'Kisii Huduma Center', address: 'Kitutu Masaba, Kisii' },
      { name: 'Kisii Umoja Center', address: 'Kitutu Masaba, Kisii County' },
      { name: 'Kitutu Masaba Police Station', address: 'Kitutu Masaba, Kisii County' }
    ]
  },
  kisumu: {
    'kisumu central': [
      { name: 'Kondele Safe Shelter', address: 'Inside kondele slum at 3rd street, rech road 4th avenue' },
      { name: 'Eshikulu Fortress', address: 'Inside langas estate at 3rd street, kona near eldo bliss hospital' },
      { name: 'Kisumu Central Police Station', address: 'Kisumu Central, Kisumu County' }
    ]
  }
  // Add more counties and subcounties as needed
}

const mapUrls = {
  kisii: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.5!2d34.7667!3d-0.6833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182aa75a5a3a5a5a%3A0x5a5a5a5a5a5a5a5a!2sKisii%2C%20Kenya!5e0!3m2!1sen!2s!4v1690000000!5m2!1sen!2s",
  kisumu: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.5!2d34.7667!3d-0.6833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182aa75a5a3a5a5a%3A0x5a5a5a5a5a5a5a5a!2sKisumu%2C%20Kenya!5e0!3m2!1sen!2s!4v1690000000!5m2!1sen!2s"
}

const GetHelp = () => {
    const [selectedCounty, setSelectedCounty] = useState('')
    const [selectedSubcounty, setSelectedSubcounty] = useState('')
    const [formData, setFormData] = useState({helpType: ''})
    const fascilitiesRef = useRef()
    const navigate = useNavigate()

    const centers = selectedCounty && selectedSubcounty ? helpCenters[selectedCounty.toLowerCase()]?.[selectedSubcounty.toLowerCase()] || [] : []

    return (
        <>
            <SafeSpaceHeader/>
            <section className="hero-section">
                <h1 className="title">we are here to help</h1>
                <div className="wrapper">
                    <div className="emergency-card">
                        <h3>emergency hotline</h3>
                        <p className="top-container"><img src={femaleAvatar} alt="" className="avatar"/>
                            <span>dont hesitate to call us any time you need any help</span>
                        </p>
                        <p className="contact-container">
                            <span className="phone-no">+254719577808</span>
                            <img src={line1} alt="-->" className="line"/>
                            <span className="name">zara</span>
                        </p>
                        <p className="contact-container">
                            <span className="phone-no">+254110650202</span>
                            <img src={line1} alt="-->" className="line"/>
                            <span className="name">nicole</span>
                        </p>
                        <p className="bottom">Our activists cant wait to address your emergency, answere your question, guide you or simply chat</p>
                    </div>
                    <img src={phoneIllustration} alt="call hero image" className="hero-illustration"/>
                </div>
            </section>
            <section className="shelters">
                <div className="images-container">
                    <img src={shelterImage1} alt="" className="house" id="house1"/>
                    <img src={shelterImage2} alt="" className="house" id="house2"/>
                    <img src={shelterImage3} alt="" className="house" id="house3"/>
                </div>
                <div className="content">
                    <h1 className="title">safe space shelters</h1>
                    <h5>need a shelter?</h5>
                    <p>we are ready to accomodate you in one of our fascilities nearest to your location</p>
                    <div className="button-wrapper">
                        <a href="#contact" className="primary-cta">get precise address</a>
                        <a href="#" className="secondary-cta">learn more</a>
                    </div>
                    
                </div>
            </section>
            <section className="contact" id="contact">
                <div className="form-wrapper">
                    <form action="#" className="contact-form" onSubmit={(e) => { e.preventDefault(); if (formData.helpType === 'other') { navigate('/forum/chatBot'); } else if (selectedCounty) { let query = ''; if (formData.helpType === 'shelter') query = 'help centers'; else if (formData.helpType === 'medical') query = 'hospitals'; else if (formData.helpType === 'rescue') query = 'rescue centers'; else if (formData.helpType === 'counseling') query = 'counseling centers'; if (query) window.open(`https://www.google.com/maps/search/${query}+in+${selectedCounty}+${selectedSubcounty},+Kenya`, '_blank'); } }}>
                        <h4 className="title">Contact form</h4>
                        <input type="text" name="name" id="name" placeholder="please enter your full name"/>
                        <input type="text" name="phone" id="phone" placeholder="please enter your phone number"/>
                        <input type="email" name="email" id="email" placeholder="please enter your email address"/>
                        <select name="county" id="county" value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)}>
                            <option value="">Select County</option>
                            <option value="Kisii">Kisii</option>
                            <option value="Kisumu">Kisumu</option>
                            <option value="Nairobi">Nairobi</option>
                            <option value="Mombasa">Mombasa</option>
                        </select>
                        <input type="text" name="subcounty" id="subcounty" placeholder="Enter Subcounty" value={selectedSubcounty} onChange={(e) => setSelectedSubcounty(e.target.value)}/>
                        <select name="helpType" id="helpType" value={formData.helpType} onChange={(e) => { setFormData({...formData, helpType: e.target.value}); if (e.target.value === 'other') { navigate('/forum/chatBot'); } }}>
                            <option value="">Select type of help needed</option>
                            <option value="shelter">Shelter</option>
                            <option value="medical">Medical Help</option>
                            <option value="counseling">Counseling</option>
                            <option value="rescue">Rescue</option>
                            <option value="other">Other</option>
                        </select>
                        <textarea name="description" id="description" placeholder="describe your issue" rows="7"></textarea>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="text-wrapper">
                    <h3 className="title">Reach out to us</h3>
                    <p>are u a victim? please share with us your story, submit the form and we will get back to you with help as soon as possible</p>
                </div>
            </section>
            <section className="chat-guidance">
                <h3>Need further guidance?</h3>
                <p>Chat with Tamara, our AI support companion, for anonymous and confidential help.</p>
                <Link to="/forum/chatBot" className="chat-button">Chat with Tamara</Link>
            </section>
            <SafeSpaceFooter/>
        </>
    )
}

export default GetHelp
