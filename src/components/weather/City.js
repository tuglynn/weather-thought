import React from 'react';


const City = ({ getLocation, cityName, setCityName }) => {

    return(
        <div className='weather d-flex justify-content-end'>
            <form onSubmit={getLocation}>
                <input placeholder='enter a city' type='text' id='city' onChange={e => setCityName(e.target.value)}/>
                <button type='submit' disabled={!cityName} className='btn' onSubmit={getLocation}>Search for weather</button>
            </form>
        </div>
    )
}

export default City;