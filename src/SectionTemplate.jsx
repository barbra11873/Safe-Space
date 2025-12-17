import React from 'react'
import './SectionTemplate.css'
import image from './assets/images/admins.svg'
import defaultButton from './assets/images/arrow1.svg'
import { Link } from 'react-router-dom'

const sectionTemplate = ({
    title="section title",
    subTitle = "",
    text = "section text",
    button = {buttonText:"button",buttonImage:defaultButton,buttonHandler:null,buttonLink:"#"},
    sectionImage = image,
    classNames = ""
}) => {
    return (
        <div className={"stories tab-desc " + classNames}>
            <div className="text">
                <h1>{title}</h1>
                <h4>{subTitle}</h4>
                <p>{text}
                </p>
                <Link to={button.buttonLink} className="link"><img src={button.buttonImage} alt=""/><span>{button.buttonText}</span></Link>
            </div>
            <img className="illustration" src={sectionImage} alt=""/>
        </div>
    )
}

export default sectionTemplate
