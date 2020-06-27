export class Parser {

    ParseFeed(feedUrl, queryTag)
    {
        return new Promise(resolve => {
            fetch(feedUrl)
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