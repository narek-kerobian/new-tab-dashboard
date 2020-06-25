export class Weather {

    _controlWeatherContainer;
    _controlWeatherTitle;
    _controlWeatherList;

    _dataWeatherKey;
    _dataWeatherCityId;

    constructor()
    {
        this._controlWeatherContainer = document.querySelector('.left-col .weather');
        this._controlWeatherTitle = this._controlWeatherContainer.querySelector('h3');
        this._controlWeatherList = this._controlWeatherContainer.querySelector('ul');

        this._dataWeatherKey = document.config['open_weather_map']['api_key'];
        this._dataWeatherCityId = document.config['open_weather_map']['city_id'];
    }

    Init()
    {
        this._getWeather();
    }

    _getWeather()
    {
        fetch(`http://api.openweathermap.org/data/2.5/weather?id=${this._dataWeatherCityId}&APPID=${this._dataWeatherKey}&units=metric`)
            .then(res => res.json())
            .then(json => {
                let params = ``;
                let feelsLike = json.main['feels_like'];
                let temp = json.main['temp'];
                let humidity = json.main['humidity'];
                let pressure = json.main['pressure'];

                // Get main params
                let main = `
                    <li><div class="title">${document.locale.weather['current']}</div> <div class="value">${temp}<span class="measure"><sup>o</sup>C</span></div></li>
                    <li><div class="title">${document.locale.weather['real']}</div> <div class="value">${feelsLike}<span class="measure"><sup>o</sup>C</span></div></li>
                    <li><div class="title">${document.locale.weather['pressure']}</div> <div class="value">${pressure}<span class="measure">hPa</span></div></li>
                    <li><div class="title">${document.locale.weather['humidity']}</div> <div class="value">${humidity}<span class="measure">%</span></div></li>
                `;
                params += main;

                // Get clouds
                if(typeof json['clouds'] !== 'undefined') {
                    let clouds = `
                    <li><div class="title">${document.locale.weather['cloudiness']}</div> <div class="value">${json['clouds']['all']}<span class="measure">%</span></div></li>
                `;
                    params += clouds;
                }

                // Get rain
                if(typeof json['rain'] !== 'undefined') {
                    if(typeof json['rain']['1h'] !== 'undefined') {
                        let rain1h = `
                        <li><div class="title">${document.locale.weather['rainfall1h']}</div> <div class="value">${json['rain']['1h']}<span class="measure">${document.locale.measurements['mm']}</span></div></li>
                    `;
                        params += rain1h;
                    }
                    if(typeof json['rain']['3h'] !== 'undefined') {
                        let rain3h = `
                        <li><div class="title">${document.locale.weather['rainfall3h']}</div> <div class="value">${json['rain']['3h']}<span class="measure">${document.locale.measurements['mm']}</span></div></li>
                    `;
                        params += rain3h;
                    }
                }

                // Get snow
                if(typeof json['snow'] !== 'undefined') {
                    if(typeof json['snow']['1h'] !== 'undefined') {
                        let snow1h = `
                        <li><div class="title">${document.locale.weather['showfall1h']}</div> <div class="value">${json['snow']['1h']}<span class="measure">${document.locale.measurements['mm']}</span></div></li>
                    `;
                        params += snow1h;
                    }
                    if(typeof json['snow']['3h'] !== 'undefined') {
                        let snow3h = `
                        <li><div class="title">${document.locale.weather['showfall3h']}</div> <div class="value">${json['snow']['3h']}<span class="measure">${document.locale.measurements['mm']}</span></div></li>
                    `;
                        params += snow3h;
                    }
                }

                // Get wind
                if(typeof json['wind'] !== 'undefined') {
                    let wind = `
                    <li><div class="title">${document.locale.weather['wind']}</div> <div class="value">${json['wind']['speed']}<span class="measure">${document.locale.measurements['ms']}</span></div></li>
                `;
                    params += wind;
                }
                this._controlWeatherTitle.innerHTML = document.locale.weather['title'];
                this._controlWeatherList.innerHTML = params;
            })
            .catch(err => console.log(err))
    }

}

export default Weather;