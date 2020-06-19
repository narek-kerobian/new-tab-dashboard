import Parser from './parser.js';

export class Feed {

    _parser;

    _dataItemsPerFeed;
    _dataFeeds;

    _controlNewsFeedContainer;
    _controlNewsFeedList

    constructor()
    {
        this._parser = new Parser();
        this._controlNewsFeedContainer = document.querySelector('.news-feed');
        this._controlNewsFeedList = this._controlNewsFeedContainer.querySelector('.feed-list');
    }

    Init(feeds)
    {
        this._dataItemsPerFeed = feeds['items_per_feed'];
        this._dataFeeds = feeds['feeds'];
        this._readFeeds();
    }

    _readFeeds()
    {
        let feedRand = this._dataFeeds[Math.floor(Math.random() * this._dataFeeds.length)];
        this._parser.ParseFeed(feedRand['feed'], 'item')
            .then(items => {
                if(items.length > 0) {
                    let feedItem = document.createElement('div');
                    feedItem.classList.add('feed')

                    let feedTitle = document.createElement('h3');
                    feedTitle.classList.add('feed-title')
                    feedTitle.innerHTML = `<a href="${feedRand['url']}">${feedRand['title']}</a>`

                    let feedList = document.createElement('ul');

                    items.forEach((item, index) => {
                        if((index + 1) <= this._dataItemsPerFeed) {
                            let title = item.querySelector('title');
                            let link = item.querySelector('link');
                            let date = item.querySelector('pubDate');

                            let dateTime = new Date(date.innerHTML);
                            let hours = (dateTime.getHours() < 10) ? `0${dateTime.getHours()}` : dateTime.getHours();
                            let minutes = (dateTime.getMinutes() < 10) ? `0${dateTime.getMinutes()}` : dateTime.getMinutes();

                            let dateNum = (dateTime.getDate() < 10) ? `0${dateTime.getDate()}` : dateTime.getDate();
                            let month = document.locale.months[dateTime.getMonth()];

                            let feedItem = document.createElement('li');
                            feedItem.innerHTML = `
                                <a class="title" href="${link.innerHTML}">${title.innerHTML}</a>
                                <span class="date">${hours}:${minutes} | ${document.locale.weekDays[dateTime.getDay()]}, ${month} ${dateNum}</span>
                            `;
                            feedList.appendChild(feedItem);
                        }
                    })

                    feedItem.appendChild(feedTitle);
                    feedItem.appendChild(feedList);

                    this._controlNewsFeedList.appendChild(feedItem)
                    this._controlNewsFeedContainer.classList.remove('d-none')
                }
            })
    }

}

export default Feed;