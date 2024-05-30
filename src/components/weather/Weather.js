import React from 'react';

//weather
class Weather extends React.Component {
    state = {
        //state object
        isLoaded: false,
        name: '',
        temp: {},
        des: ''
    };
    //
    componentDidMount() {
        //call API
        const {lat, lon} = this.props;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3c14cb22ffaf4d072b073707ac46bb12`).then(res => res.json()).then(weather => {
            this.setState({
                //setState with api data
                isLoaded: true,
                name: weather.name,
                temp: weather.main,
                des: weather.weather[0].description
            })
        }).catch(error => console.error(error));
    }
    //convert K to F
    kelvinToF(temp) {
        return(Math.floor((temp-273.15)*1.8+32.))
    }
    //return
    render() {
        //pass state.
        const {isLoaded, name, temp, des} = this.state
        //if the call hasn't returned show this
        if(!isLoaded) {

            return (
                <div className='d-flex justify-content-end'>
                    <p>Searching...</p>
                </div>)
        }
        //if there is data, display it
        return(
            <div>
                <ul className='weather d-flex justify-content-end'>
                    <li>{name}</li>
                    <li>Current {this.kelvinToF(temp.temp)}º</li>
                    <li>{des}</li>
                    <li>Low {this.kelvinToF(temp.temp_min)}º</li>
                    <li>High {this.kelvinToF(temp.temp_max)}º</li>
                </ul>
            </div>
        )
    }
}

export default Weather;