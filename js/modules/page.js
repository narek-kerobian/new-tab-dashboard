import Search from "./search.js";

export class Page {

    config;
    locale;

    body;
    bgImage;

    panelLeft;
    panelRight;

    newsFeedContainer;
    newsFeedList;

    showerThoughtsTitle;
    showerThoughtsList;

    controlWeatherContainer;
    controlWeather;
    controlTime;
    controlDate;

    controlTimeInterval;

    weatherKey;
    weatherCityId;

    unsplashKeywords;
    unsplashUpdateDaily;

    constructor(config, locale) {
        this.locale = locale;
        this.config = config;

        this.body = document.body;
        this.bgImage = document.querySelector('.bg-image');

        this.panelLeft = document.querySelector('.left-col');
        this.panelRight = document.querySelector('.right-col');

        this.newsFeedContainer = document.querySelector('.news-feed');
        this.newsFeedList = this.newsFeedContainer.querySelector('.feed-list');

        this.showerThoughtsTitle = document.querySelector('.shower-thoughts h3 a');
        this.showerThoughtsList = document.querySelector('.shower-thoughts ul');

        this.controlWeatherContainer = document.querySelector('.left-col .weather');
        this.controlWeatherTitle = this.controlWeatherContainer.querySelector('h3');
        this.controlWeather = this.controlWeatherContainer.querySelector('ul');
        this.controlTime = document.querySelector('.right-col .time');
        this.controlDate = document.querySelector('.right-col .date');

        this.weatherKey = this.config['open_weather_map']['api_key'];
        this.weatherCityId = this.config['open_weather_map']['city_id'];

        this.unsplashKeywords = this.config['unsplash']['keywords'];
        this.unsplashUpdateDaily = (this.config['unsplash']['update_daily']) ? '/daily' : '';
    }

    Init()
    {
        this.controlTimeInterval = setInterval(() => {
            this.updateTime();
        }, 10000);
        this._initSearchEngines(this.config['search_engines']);

        this.updateBackground(() => {});
        this.updateTime();
        this.getWeather();

        this.getNews();
        this.getShowerThoughts();

        this.initScrollbars();
    }

    _initSearchEngines(engines)
    {
        let search = new Search(engines);
        search.init();
    }

    updateBackground(onload)
    {
        fetch(`https://source.unsplash.com/1920x1080${this.unsplashUpdateDaily}?${this.unsplashKeywords.join(',')}`)
            .then(res => {
                this.loadImage(res.url)
                    .then(img => {
                        this.bgImage.style.background = `radial-gradient(circle at center, rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 0.5) 55%, rgba(0,0,0, 0.8) 95%), url('${img.src}') no-repeat center`;
                        this.bgImage.classList.add('animate');
                        onload();
                    })
            })
    }

    updateTime()
    {
        let now = new Date();
        let hours = (now.getHours() < 10) ? `0${now.getHours()}` : now.getHours();
        let minutes = (now.getMinutes() < 10) ? `0${now.getMinutes()}` : now.getMinutes();
        let seconds = (now.getSeconds() < 10) ? `0${now.getSeconds()}` : now.getSeconds();

        let date = (now.getDate() < 10) ? `0${now.getDate()}` : now.getDate();
        let month = this.locale.months[now.getMonth()];

        this.controlTime.innerText = `${hours}:${minutes}`;
        this.controlDate.innerText = `${this.locale.weekDays[now.getDay()]}, ${month} ${date}`;
    }

    getWeather()
    {
        fetch(`http://api.openweathermap.org/data/2.5/weather?id=${this.weatherCityId}&APPID=${this.weatherKey}&units=metric`)
            .then(res => res.json())
            .then(json => {
                let params = ``;
                let feelsLike = json.main['feels_like'];
                let temp = json.main['temp'];
                let humidity = json.main['humidity'];
                let pressure = json.main['pressure'];

                // Get main params
                let main = `
                    <li><div class="title">${this.locale.weather['current']}</div> <div class="value">${temp}<span class="measure"><sup>o</sup>C</span></div></li>
                    <li><div class="title">${this.locale.weather['real']}</div> <div class="value">${feelsLike}<span class="measure"><sup>o</sup>C</span></div></li>
                    <li><div class="title">${this.locale.weather['pressure']}</div> <div class="value">${pressure}<span class="measure">hPa</span></div></li>
                    <li><div class="title">${this.locale.weather['humidity']}</div> <div class="value">${humidity}<span class="measure">%</span></div></li>
                `;
                params += main;

                // Get clouds
                if(typeof json['clouds'] !== 'undefined') {
                    let clouds = `
                    <li><div class="title">${this.locale.weather['cloudiness']}</div> <div class="value">${json['clouds']['all']}<span class="measure">%</span></div></li>
                `;
                    params += clouds;
                }

                // Get rain
                if(typeof json['rain'] !== 'undefined') {
                    if(typeof json['rain']['1h'] !== 'undefined') {
                        let rain1h = `
                        <li><div class="title">${this.locale.weather['rainfall1h']}</div> <div class="value">${json['rain']['1h']}<span class="measure">${this.locale.measurements['mm']}</span></div></li>
                    `;
                        params += rain1h;
                    }
                    if(typeof json['rain']['3h'] !== 'undefined') {
                        let rain3h = `
                        <li><div class="title">${this.locale.weather['rainfall3h']}</div> <div class="value">${json['rain']['3h']}<span class="measure">${this.locale.measurements['mm']}</span></div></li>
                    `;
                        params += rain3h;
                    }
                }

                // Get snow
                if(typeof json['snow'] !== 'undefined') {
                    if(typeof json['snow']['1h'] !== 'undefined') {
                        let snow1h = `
                        <li><div class="title">${this.locale.weather['showfall1h']}</div> <div class="value">${json['snow']['1h']}<span class="measure">${this.locale.measurements['mm']}</span></div></li>
                    `;
                        params += snow1h;
                    }
                    if(typeof json['snow']['3h'] !== 'undefined') {
                        let snow3h = `
                        <li><div class="title">${this.locale.weather['showfall3h']}</div> <div class="value">${json['snow']['3h']}<span class="measure">${this.locale.measurements['mm']}</span></div></li>
                    `;
                        params += snow3h;
                    }
                }

                // Get wind
                if(typeof json['wind'] !== 'undefined') {
                    let wind = `
                    <li><div class="title">${this.locale.weather['wind']}</div> <div class="value">${json['wind']['speed']}<span class="measure">${this.locale.measurements['ms']}</span></div></li>
                `;
                    params += wind;
                }
                this.controlWeatherTitle.innerHTML = this.locale.weather['title'];
                this.controlWeather.innerHTML = params;
            })
            .catch(err => console.log(err))
    }

    getNews()
    {
        if(typeof this.config['rss_feed'] !== 'undefined') {
            if(this.config['rss_feed']['feeds'].length !== 0) {

                let feedRand = this.config['rss_feed']['feeds'][Math.floor(Math.random() * this.config['rss_feed']['feeds'].length)];
                this.parseFeed(feedRand['feed'], 'item')
                    .then(items => {
                        if(items.length > 0) {
                            let feedItem = document.createElement('div');
                            feedItem.classList.add('feed')

                            let feedTitle = document.createElement('h3');
                            feedTitle.classList.add('feed-title')
                            feedTitle.innerHTML = `<a href="${feedRand['url']}">${feedRand['title']}</a>`

                            let feedList = document.createElement('ul');

                            items.forEach((item, index) => {
                                if((index + 1) <= this.config['rss_feed']['items_per_feed']) {
                                    let title = item.querySelector('title');
                                    let link = item.querySelector('link');
                                    let date = item.querySelector('pubDate');

				                    let dateTime = new Date(date.innerHTML);
                                    let hours = (dateTime.getHours() < 10) ? `0${dateTime.getHours()}` : dateTime.getHours();
                                    let minutes = (dateTime.getMinutes() < 10) ? `0${dateTime.getMinutes()}` : dateTime.getMinutes();

                                    let dateNum = (dateTime.getDate() < 10) ? `0${dateTime.getDate()}` : dateTime.getDate();
                                    let month = this.locale.months[dateTime.getMonth()];

                                    let feedItem = document.createElement('li');
                                    feedItem.innerHTML = `
                                        <a class="title" href="${link.innerHTML}">${title.innerHTML}</a>
                                        <span class="date">${hours}:${minutes} | ${this.locale.weekDays[dateTime.getDay()]}, ${month} ${dateNum}</span>
                                    `;
                                    feedList.appendChild(feedItem);
                                }
                            })

                            feedItem.appendChild(feedTitle);
                            feedItem.appendChild(feedList);

                            this.newsFeedList.appendChild(feedItem)
                            this.newsFeedContainer.classList.remove('d-none')
                        }
                    })
            }
        }
    }

    getShowerThoughts()
    {
        this.parseFeed(this.config['shower_thoughts']['feed'], 'entry')
            .then(items => {
                let content = ``;
                items.forEach((item, index) => {
                    if((index+1) <= this.config['shower_thoughts']['items_per_feed']) {
                        let title = item.querySelector('title');
                        let link = item.querySelector('link');
                        let thought = `
                            <li>
                                <a href="${link.getAttribute('href')}">${title.innerHTML}</a>
                            </li>
                        `;
                        content += thought;
                    }
                })

                this.showerThoughtsTitle.innerText = 'Shower Thoughts';
                this.showerThoughtsList.innerHTML = content;

            })
            .catch(err => console.log(err))
    }

    initScrollbars()
    {
        let scrollbar = window.Scrollbar;

        let scrollbarOptions = {
            damping: 20,
            thumbMinSize: 20,
            renderByPixels: true,
            alwaysShowTracks: true,
            continuousScrolling: true,
        }

        scrollbar.initAll(scrollbarOptions);
        let scrollbars = scrollbar.getAll();

        // Move left scrollbar to right
        scrollbars[0].track.yAxis.element.style.left = 0;
    }

    parseFeed(feedUrl, queryTag)
    {
        return new Promise(resolve => {
            let url = feedUrl;
            if(typeof this.config['proxy_server'] !== 'undefined') {
                if(this.config['proxy_server'] !== "") {
                    url = this.config['proxy_server'] + feedUrl;
                }
            }
            fetch(url)
                .then(res => res.text())
                .then(str => {
                    let parser = new DOMParser();
                    let feed = parser.parseFromString(str, 'application/xml')
                    let items = feed.querySelectorAll(queryTag);
                    resolve(items)
                })
                .catch(err => console.log(err))
        })
    }

    loadImage(url)
    {
        return new Promise(resolve => {
            let image = new Image();
            image.src = url;
            image.classList.add('bg-image');
            image.onload = () => {
                resolve(image);
            }
        });
    }

}

export default Page;
