import Parser from '../functional/parser.js';
import initScroll from "../functional/scroll.js";

export class Reddit {

    _parser;

    _dataItemsPerFeed;

    _controlRedditTitle;
    _controlRedditList;
    _controlScrollElement;

    constructor()
    {
        this._parser = new Parser();
        this._controlRedditTitle = document.querySelector('.reddit h3 a');
        this._controlRedditList = document.querySelector('.reddit ul');
        this._controlScrollElement = $('.reddit .scrollbar-right');
    }

    Init()
    {
        this._dataItemsPerFeed = document.config['shower_thoughts']['items_per_feed'];
        this._getShowerThoughts();
    }

    _getShowerThoughts()
    {
        this._parser.ParseFeed(document.config['shower_thoughts']['feed'], 'entry')
            .then(items => {
                let content = ``;

                for (let i = 0; i < items.length; i++) {
                    if(this._dataItemsPerFeed) {
                        if((i + 1) > this._dataItemsPerFeed) {
                            break;
                        }
                    }
                    let title = items[i].querySelector('title');
                    let link = items[i].querySelector('link');
                    let thought = `
                            <li>
                                <a href="${link.getAttribute('href')}">${title.textContent}</a>
                            </li>
                        `;
                    content += thought;
                }

                this._controlRedditTitle.innerText = 'Shower Thoughts';
                this._controlRedditList.innerHTML = content;
                initScroll(this._controlScrollElement);
            })
            .catch(err => console.log(err))
    }

}

export default Reddit;