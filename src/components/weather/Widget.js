import React, { useState, useEffect } from 'react';
import Weather from './Weather';
import City from './City';


const Widget = ({database, set, databaseRef, get, child}) => {
        const [city, setCity] = useState(false);
        const [cityName, setCityName] = useState('')
        const [lat, setLat] = useState('');
        const [lon, setLon] = useState('');
        const getLocation = e => {
            e.preventDefault();
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=3c14cb22ffaf4d072b073707ac46bb12`
            //fetch lat & lon
            fetch(geoUrl).then(res => res.json()).then(data => {
                const weatherRef = databaseRef(database, 'weather');
                set(weatherRef, {
                    lat: data[0].lat,
                    lon: data[0].lon
                });
             setLat(data[0].lat);
             setLon(data[0].lon);
             setCity(true);
            }).catch(error => console.error(error));
        };
        const handleReset = () => {
            setCity(false);
            setCityName('');
        }
        useEffect(() => {
            const weatherRef = databaseRef(database, 'weather');
            get(weatherRef).then(snapshot => {
              if (snapshot.exists()) {
                setCity(true);
                const lat2 = snapshot.val().lat;
                const lon2 = snapshot.val().lon;
                setLat(lat2);
                setLon(lon2);
              } else {
                console.log('no data');
              }
            });
          }, [database]);
    return(
        <>
            {city ? (
                <div className='d-flex justify-content-end'>
                <Weather lat={lat} lon={lon} setCity={setCity}/>
                <button className='btn' onClick={handleReset}>X</button>
                </div>
            ) : (
                < City cityName={cityName} setCityName={setCityName} getLocation={getLocation} />
            )}
        </>
    )
}

export default Widget;