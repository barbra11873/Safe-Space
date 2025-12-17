import React from 'react'
import './progressBar.css'
const progressBar = ({
    progress = 20,
}) => {
    return (
        <div className="progress-bar-container">
            <div className="progress-bar">
                <div className="progress" style={{width:progress+"%"}}></div>
            </div>
            <div className="progress-pointer" style={{marginLeft:`calc(${progress}% - 20px)`}}>
                <p className="progress-text">{progress}%</p>
            </div>
        </div>
    )
}

export default progressBar
