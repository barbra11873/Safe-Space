import React from 'react'
import sampleImage from './assets/images/aboutcardImage1.png'

const aboutCard = ({
    title="title",
    text="card description",
    img= sampleImage,
    style = {}
}) => {
    return (
        <div className='cardContainer' style={style}>
            <div className="titleWrapper">
                <h3 className="title">{title}</h3>
            </div>
            <div className="imageWrapper">
                <img src={img} alt="" />
            </div>
            <div className="textWrapper">
                <p className="text">{text}</p>
            </div>
        </div>
    )
}

export default aboutCard
