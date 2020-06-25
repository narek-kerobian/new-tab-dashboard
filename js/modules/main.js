import Search from "./content/search.js";
import Weather from "./content/weather.js";
import Feed from "./content/feed.js";
import Reddit from "./content/reddit.js";

export class Main {

    body;
    bgImage;

    panelLeft;
    panelRight;

    newsFeedContainer;
    newsFeedList;

    controlTime;
    controlDate;

    controlTimeInterval;

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
        this._initReddit();

        this.updateBackground(() => {});
        this.updateTime();
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

    _initFeeds()
    {
        if(typeof document.config['rss_feed'] !== 'undefined') {
            if(document.config['rss_feed']['feeds'].length !== 0) {
                let feed = new Feed();
                feed.Init();
            }
        }
    }

    _initReddit()
    {
        if(typeof document.config['shower_thoughts'] !== 'undefined') {
            let reddit = new Reddit();
            reddit.Init();
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

export default Main;
