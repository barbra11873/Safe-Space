import React from 'react'
import { useLocation,Link } from 'react-router-dom'

const BreadCrumb = () => {
    const location = useLocation();
    let link = "";
    let path = location.pathname.split("/");
    path = path.filter(crumb => crumb !== "")
    return (
        <div className='breadCrumbContainer'>
            {
                path.map((crumb) => {
                    link += `/${crumb}`;
                    console.log(link);
                    return(
                        <Link to = {link} className='crumbItem'>
                            <span className="crumbSeparator"> {">"} </span>
                            <span className="crumbText">{crumb}</span>
                        </Link>
                        
                    )
                })
                
                
            }
        </div>
    )
}

export default BreadCrumb
