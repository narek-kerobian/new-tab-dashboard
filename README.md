#### Custom dashboard for google chrome
![Screenshot](screenshot.png?raw=true)
A simple chrome extension aimed to make the new tab screen less dull by adding nice backgrounds and providing some headlines from various RSS feeds of your choice.  

#### Configuration
1. Copy and rename the config.js.dist to config.js
2. Set open weather map key and location id <pre><code>"open_weather_map": {
    "api_key": "",
    "city_id": ""
}</code></pre>
3. Add comma separated keywords for unsplash config.  
  If "update_daily" is set to true, the background will be updated once per day (duh) <pre><code>"unsplash": {
    "update_daily": true,
    "keywords": [""]
}</code></pre>
4. Add feed sources to the "rss_feed" section as shown below: <pre><code>"rss_feed": {
    "items_per_feed": 9,
    "feeds": [
        {
            "title": "RSS source #1",
            "url": "website_url",
            "feed": "feed_url"
        },
        {
            "title": "RSS source #2",
            "url": "website_url",
            "feed": "feed_url"
        }
    ]
}</code></pre> 
You can add as many feeds as you like, a random source would be selected on each page load.
5. As a workaround to CORS problem, use "proxy_server" config option to specify a server like: https://cors-anywhere.herokuapp.com/
6. Modify search engines section to your liking <pre><code>"search_engines": [
   {
       "title": "Google",
       "font_awesome_icon": "fa-google",
       "icon_url": "",
       "search_url": "https://www.google.com/search?q="
   },
   {
       "title": "Duckduckgo",
       "font_awesome_icon": "",
       "icon_url": "https://duckduckgo.com/assets/logo_header.v108.svg",
       "search_url": "https://duckduckgo.com/?q="
   }
]</code></pre>

#### Installation
1. Go to chrome://extensions/ (or equivalent)
2. Enable "Developer mode"
3. Click "Load unpacked" and select the project directory 

#### Development
Being a side project the development is not very active. Some future improvements are planned for the code, mainly better structure (logic separation), integration with WebPack, responsive design, ability to choose the content position from the config file, etc.  

#### License
Everything in this repository is provided "as is", without any warranty.  
Download, use, modify, redistribute, do whatever you like, no limits!  
Contributions are welcome.


The extension has been tested on google chrome (83.0.4103.106) and brave (V1.10.90) browsers.