export class Parser {

    _proxy = "";

    constructor()
    {
        if(typeof document.config['proxy_server'] !== 'undefined') {
            if(document.config['proxy_server'] !== "") {
                this._proxy = document.config['proxy_server'];
            }
        }
    }

    ParseFeed(feedUrl, queryTag)
    {
        return new Promise(resolve => {
            let url = feedUrl;
            url = this._proxy + feedUrl;
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

}

export default Parser;