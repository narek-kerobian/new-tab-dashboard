import Parser from './parser.js';

export class Feed {

    _parser;

    _dataItemsPerFeed;
    _dataFeeds;

    _controlNewsFeedContainer;
    _controlNewsFeedSelector;
    _controlNewsFeedList

    constructor()
    {
        this._parser = new Parser();
        this._controlNewsFeedContainer = document.querySelector('.news-feed');
        this._controlNewsFeedSelector = this._controlNewsFeedContainer.querySelector('.feed-selector');
        this._controlNewsFeedList = this._controlNewsFeedContainer.querySelector('.feed-list');
    }

    Init(feeds)
    {
        this._dataItemsPerFeed = feeds['items_per_feed'];
        this._dataFeeds = feeds['feeds'];
        this._setFeedSelectors();
        this._eventFeedSelector();
        this._readFeeds(0);
    }

    _setFeedSelectors()
    {
        this._dataFeeds.forEach((feed, index) => {
            let option = document.createElement('option');
            option.value = index;
            option.innerHTML = feed['title'];
            this._controlNewsFeedSelector.appendChild(option);
        })
    }

    _readFeeds(feedIndex)
    {
        let feedSelected = this._dataFeeds[feedIndex];
        this._parser.ParseFeed(feedSelected['feed'], 'item')
            .then(items => {
                if(items.length > 0) {
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

                    this._controlNewsFeedList.innerHTML = "";
                    this._controlNewsFeedList.appendChild(feedList)
                }
            })
    }

    _eventFeedSelector()
    {
        this._controlNewsFeedSelector.addEventListener('change', e => {
            this._readFeeds(this._controlNewsFeedSelector.value);
        })   
    }

}

export default Feed;