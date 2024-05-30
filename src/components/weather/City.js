import React from 'react';

//get props
const City = ({ getLocation, cityName, setCityName }) => {
    //return a city search
    return(
        <div className='weather d-flex justify-content-end'>
            <form onSubmit={getLocation}>
                {/* set the user input as the city name */}
                <input placeholder='enter a city' type='text' id='city' onChange={e => setCityName(e.target.value)}/>
                {/* submit! */}
                <button type='submit' disabled={!cityName} className='btn' onSubmit={getLocation}>Search for weather</button>
            </form>
        </div>
    )
}

export default City;