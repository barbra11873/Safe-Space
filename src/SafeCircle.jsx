import React from 'react'
import './SafeCircle.css'
import SafeCircleSideNav from './SafeCircleSideNav'
import SafeCircleHeader from './SafeCircleHeader'
import SafeSpaceFooter from './SafeSpaceFooter'
import { Outlet } from 'react-router-dom'

const SafeCircle = () => {
    return (
        <main>
            <SafeCircleSideNav/>
            <section className="mainWrapper">
                <SafeCircleHeader/>
                    <Outlet/>
                <SafeSpaceFooter/>
            </section>
        </main>
    )
}

export default SafeCircle
