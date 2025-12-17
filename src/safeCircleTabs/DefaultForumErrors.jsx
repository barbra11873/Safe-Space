import React from 'react'
import SectionTemplate from '../SectionTemplate'
import errorImage from '../assets/images/4042.svg'
import { useLocation } from 'react-router-dom'

const DefaultForumErrors = () => {
    const location = useLocation();
    return (
        <div>
            <SectionTemplate
                title = "404 Not Found"
                subTitle = "could not find the page you are looking for"
                text = {location.pathname.toString() + "  does not exist please check your url"}
                button={{buttonText:"Go to Home Page",buttonLink:"/forum"}}
                sectionImage = {errorImage}
            />
        </div>
    )
}

export default DefaultForumErrors
