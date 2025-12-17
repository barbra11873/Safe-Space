import React from 'react'
import SafeSpaceHeader from './SafeSpaceHeader'
import SectionTemplate from './SectionTemplate'
import SafeSpaceFooter from './SafeSpaceFooter'
import { useLocation } from 'react-router-dom'
import errorImage from './assets/images/404.svg'

const DefaultRouteErrors = () => {
    const location = useLocation();
    return (
        <>
            <SafeSpaceHeader/>
            <SectionTemplate
                title = "404 Not Found"
                subTitle = "could not find the page you are looking for"
                text = {location.pathname.toString() + "  does not exist please check your url"}
                button={{buttonText:"Go to Home Page",buttonLink:"/"}}
                sectionImage = {errorImage}
            />
            <SafeSpaceFooter/>
        </>
    )
}

export default DefaultRouteErrors
