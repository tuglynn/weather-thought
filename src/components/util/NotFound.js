import React from 'react';
import { Link } from 'react-router-dom';
//404 page
const NotFound = () => {
    return(
        <div className='container'>
            <h1>404 Page not found</h1>
            <Link to={'/weather-thought'}>Go back</Link>
        </div>
    )
};

export default NotFound;