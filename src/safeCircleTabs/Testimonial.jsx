import React from 'react'
import '../SafeCircle.css'
import defaultProfile from '../assets/images/undraw_female-avatar_7t6k.svg'

const Testimonial = ({
    profileImage = defaultProfile,
    name = "user",
    title = 'title',
    description
}) => {
    return (
        <div class="admin-card">
            <img src={profileImage} alt="" class="profile"/>
            <div class="name">{name}</div>
            <div class="title">{title}</div>
            <p class="description">{description} </p>
        </div>
    )
}

export default Testimonial
