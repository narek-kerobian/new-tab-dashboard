#### Custom new tab dashboard
![Screenshot](screenshot.png?raw=true)
A simple browser extension aimed to make the new tab screen less dull by adding nice backgrounds and providing some headlines from various RSS feeds of your choice.  

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
    "items_per_feed": null,
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
If you want to limit the number of articles change the value of "items_per_feed" to any number.  
You can add as many feeds as you like, use dropdown menu to change the source.
5. To avoid CORS issues make sure to add your feeds to the "permissions" section in manifest.json file. Matching pattern examples can be found [here](https://developer.chrome.com/extensions/match_patterns).
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

#### Installation on chrome (or equivalent)
1. Go to chrome://extensions/ (or equivalent)
2. Enable "Developer mode"
3. Click "Load unpacked" and select the project directory 

#### Installation on firefox
1. Go to about:debugging
2. Click on "This Firefox" tab 
3. Click "Load Temporary Add-on..." and select the manifest.json file from projects directory

#### Development
Being a side project the development is not very active. Some future improvements are planned for the code, mainly better structure (logic separation), integration with WebPack, responsive design, ability to choose the content position from the config file, etc.  

#### License
Everything in this repository is provided "as is", without any warranty.  
Download, use, modify, redistribute, do whatever you like, no limits!  
You'll need to consider licences of dependencies as well.  
Contributions are welcome.


The extension has been tested on google chrome (83.0.4103.106), brave (V1.10.90) and firefox (77.0.1) browsers.