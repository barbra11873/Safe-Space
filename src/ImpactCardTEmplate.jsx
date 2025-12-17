import React from 'react'
import defaultImage from './assets/images/Psychological 2.png'
import './AboutGbv.css'

const ImpactCardTEmplate = ({
    title = "deafult title",
    text = 'lorem ipsum dolor ifitim matrilez',
    image = defaultImage
}) => {
    return (
        <div className='impactCardWrapper'>
            <div className="left">
                <img src={image} alt="" className="leftImage" />
            </div>
            <div className="right">
                <h2 className="title">{title}</h2>
                <p className="text">{text}</p>
            </div>
        </div>
    )
}

export default ImpactCardTEmplate
