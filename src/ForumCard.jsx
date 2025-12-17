import React from 'react'
import cardDefaultImage from './assets/images/card-image3.png'
import cardDefaultBottomImage from './assets/images/card-image5.png'
import './ForumCard.css'
import { Link } from 'react-router-dom'
const forumCard = ({
    cardImage = cardDefaultImage,
    cardBottomImage = cardDefaultBottomImage,
    cardTitle = "card title",
    cardText = "description",
    cardButton = {buttonText:"read now",buttonHandler:null}
}) => {
    return (
        <div className="card">
            <img src={cardImage} alt="" className="card-image"/>
            <h2 className="title">{cardTitle}</h2>
            <p className="description">{cardText}</p>
            <img src={cardBottomImage} alt="" className="bottom-image"/>
            <Link to="forum" className="bottom-cta" onClick={cardButton.buttonHandler}>{cardButton.buttonText}</Link>
        </div>
    )
}

export default forumCard
