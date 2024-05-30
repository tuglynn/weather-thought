import React, { useState, useEffect } from 'react';
import Weather from './Weather';
import City from './City';


const Widget = ({database, set, databaseRef, get}) => {
        //set states
        const [city, setCity] = useState(false);
        const [cityName, setCityName] = useState('')
        const [lat, setLat] = useState('');
        const [lon, setLon] = useState('');
        //get location of city
        const getLocation = e => {
            e.preventDefault();
            //API string
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=3c14cb22ffaf4d072b073707ac46bb12`
            //fetch lat & lon
            fetch(geoUrl).then(res => res.json()).then(data => {
                //set lat and lon in database
                const weatherRef = databaseRef(database, 'weather');
                set(weatherRef, {
                    lat: data[0].lat,
                    lon: data[0].lon
                });
                //set Lat Lon state
             setLat(data[0].lat);
             setLon(data[0].lon);
             setCity(true);
            }).catch(error => console.error(error));
        };
        //reset weather
        const handleReset = () => {
            //boolean to false
            setCity(false);
            //set city name to empty string
            setCityName('');
        }
        //on load
        useEffect(() => {
            //check database for weather
            const weatherRef = databaseRef(database, 'weather');
            get(weatherRef).then(snapshot => {
              if (snapshot.exists()) {
                //set the variables
                setCity(true);
                const lat2 = snapshot.val().lat;
                const lon2 = snapshot.val().lon;
                setLat(lat2);
                setLon(lon2);
              } else {
                //no data
                console.log('no data');
              }
            });
          }, [database]);
    return(
        <>
            {/* check for boolean */}
            {city ? (
                //widget with weather
                <div className='d-flex justify-content-end'>
                <Weather lat={lat} lon={lon} setCity={setCity}/>
                {/* reset button */}
                <button className='btn' onClick={handleReset}>X</button>
                </div>
            ) : (
                //else show city search
                < City cityName={cityName} setCityName={setCityName} getLocation={getLocation} />
            )}
        </>
    )
}

export default Widget;