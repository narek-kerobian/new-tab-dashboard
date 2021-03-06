import Parser from '../functional/parser.js';
import initScroll from "../functional/scroll.js";

export class Feed {

    _parser;

    _dataItemsPerFeed;
    _dataFeeds;

    _controlNewsFeedContainer;
    _controlNewsFeedSelector;
    _controlNewsFeedList

    _controlScrollElement;

    constructor()
    {
        this._parser = new Parser();
        this._controlNewsFeedContainer = document.querySelector('.news-feed');
        this._controlNewsFeedSelector = this._controlNewsFeedContainer.querySelector('.feed-selector');
        this._controlNewsFeedButton = this._controlNewsFeedSelector.querySelector('.dropdown-toggle');
        this._controlNewsFeedMenu = this._controlNewsFeedSelector.querySelector('.dropdown-menu');

        this._controlNewsFeedList = this._controlNewsFeedContainer.querySelector('.feed-list ul');
        this._controlScrollElement = $('.news-feed .scrollbar-left');
    }

    Init()
    {
        this._dataItemsPerFeed = document.config['rss_feed']['items_per_feed'];
        this._dataFeeds = document.config['rss_feed']['feeds'];
        this._setFeedSelectors();
        this._readFeeds(0);
    }

    _setFeedSelectors()
    {
        this._dataFeeds.forEach((feed, index) => {
            let source = document.createElement('a');
            source.href = '#';
            source.dataset.value = index;
            source.classList.add('dropdown-item');
            source.innerHTML = feed['title'];
            this._controlNewsFeedMenu.appendChild(source);
            this._eventFeedSelector(source);
        })
    }

    _readFeeds(feedIndex)
    {
        let feedSelected = this._dataFeeds[feedIndex];
        this._controlNewsFeedButton.innerText = feedSelected['title'];
        this._parser.ParseFeed(feedSelected['feed'], 'item')
            .then(items => {
                if(items.length > 0) {
                    this._controlNewsFeedList.innerHTML = "";

                    for (let i = 0; i < items.length; i++) {
                        if(this._dataItemsPerFeed) {
                            if((i + 1) > this._dataItemsPerFeed) {
                                break;
                            }
                        }
                        let title = items[i].querySelector('title');
                        let link = items[i].querySelector('link');
                        let date = items[i].querySelector('pubDate');

                        let dateTime = new Date(date.innerHTML);
                        let hours = (dateTime.getHours() < 10) ? `0${dateTime.getHours()}` : dateTime.getHours();
                        let minutes = (dateTime.getMinutes() < 10) ? `0${dateTime.getMinutes()}` : dateTime.getMinutes();

                        let dateNum = (dateTime.getDate() < 10) ? `0${dateTime.getDate()}` : dateTime.getDate();
                        let month = document.locale.months[dateTime.getMonth()];

                        let feedItem = document.createElement('li');
                        feedItem.innerHTML = `
                            <a class="title" href="${link.innerHTML}">${title.textContent}</a>
                            <span class="date">${hours}:${minutes} | ${document.locale.weekDays[dateTime.getDay()]}, ${month} ${dateNum}</span>
                        `;
                        this._controlNewsFeedList.appendChild(feedItem)
                    }
                    initScroll(this._controlScrollElement);
                }
            })
    }

    _eventFeedSelector(element)
    {
        element.addEventListener('click', e => {
            e.preventDefault();
            this._readFeeds(element.dataset.value);
        })   
    }

}

export default Feed;