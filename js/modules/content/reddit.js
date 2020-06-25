import Parser from '../functional/parser.js';
import initScroll from "../functional/scroll.js";

export class Reddit {

    _parser;

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
        this._getShowerThoughts();
    }

    _getShowerThoughts()
    {
        this._parser.ParseFeed(document.config['shower_thoughts']['feed'], 'entry')
            .then(items => {
                let content = ``;
                items.forEach((item, index) => {
                    if((index+1) <= document.config['shower_thoughts']['items_per_feed']) {
                        let title = item.querySelector('title');
                        let link = item.querySelector('link');
                        let thought = `
                            <li>
                                <a href="${link.getAttribute('href')}">${title.textContent}</a>
                            </li>
                        `;
                        content += thought;
                    }
                })

                this._controlRedditTitle.innerText = 'Shower Thoughts';
                this._controlRedditList.innerHTML = content;
                initScroll(this._controlScrollElement);
            })
            .catch(err => console.log(err))
    }

}

export default Reddit;