import Search from "./search.js";
import Weather from "./weather.js";
import Feed from "./feed.js";

export class Page {

    body;
    bgImage;

    panelLeft;
    panelRight;

    newsFeedContainer;
    newsFeedList;

    redditTitle;
    redditList;

    controlTime;
    controlDate;

    controlTimeInterval;

    weatherKey;
    weatherCityId;

    unsplashKeywords;
    unsplashUpdateDaily;

    constructor()
    {
        this.body = document.body;
        this.bgImage = document.querySelector('.bg-image');

        this.panelLeft = document.querySelector('.left-col');
        this.panelRight = document.querySelector('.right-col');

        this.newsFeedContainer = document.querySelector('.news-feed');
        this.newsFeedList = this.newsFeedContainer.querySelector('.feed-list');

        this.redditTitle = document.querySelector('.reddit h3 a');
        this.redditList = document.querySelector('.reddit ul');

        this.controlTime = document.querySelector('.right-col .time');
        this.controlDate = document.querySelector('.right-col .date');

        this.unsplashKeywords = document.config['unsplash']['keywords'];
        this.unsplashUpdateDaily = (document.config['unsplash']['update_daily']) ? '/daily' : '';
    }

    Init()
    {
        this.controlTimeInterval = setInterval(() => {
            this.updateTime();
        }, 10000);
        this._initSearchEngines();
        this._initWeather();
        this._initFeeds();

        this.updateBackground(() => {});
        this.updateTime();
        // this.getWeather();

        this.getShowerThoughts();
    }

    _initSearchEngines(engines)
    {
        if(typeof document.config['search_engines'] !== 'undefined') {
            if(document.config['search_engines'].length > 0) {
                let search = new Search();
                search.init(document.config['search_engines']);
            }
        }
    }

    _initWeather()
    {
        if(typeof document.config['open_weather_map'] !== 'undefined') {
            if(document.config['open_weather_map']['api_key'] !== "" && document.config['open_weather_map']['city_id'] !== "") {
                let weather = new Weather();
                weather.Init();
            }
        }
    }

    _initFeeds(feeds)
    {
        if(typeof document.config['rss_feed'] !== 'undefined') {
            if(document.config['rss_feed']['feeds'].length !== 0) {
                let feed = new Feed();
                feed.Init();
            }
        }
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
        let month = document.locale.months[now.getMonth()];

        this.controlTime.innerText = `${hours}:${minutes}`;
        this.controlDate.innerText = `${document.locale.weekDays[now.getDay()]}, ${month} ${date}`;
    }

    getShowerThoughts()
    {
        this.parseFeed(document.config['shower_thoughts']['feed'], 'entry')
            .then(items => {
                let content = ``;
                items.forEach((item, index) => {
                    if((index+1) <= document.config['shower_thoughts']['items_per_feed']) {
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

                this.redditTitle.innerText = 'Shower Thoughts';
                this.redditList.innerHTML = content;
                $('.bbb').jScrollPane();
            })
            .catch(err => console.log(err))
    }

    parseFeed(feedUrl, queryTag)
    {
        return new Promise(resolve => {
            let url = feedUrl;
            if(typeof document.config['proxy_server'] !== 'undefined') {
                if(document.config['proxy_server'] !== "") {
                    url = document.config['proxy_server'] + feedUrl;
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
