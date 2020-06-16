import config from "../config.js";
import Page from "./modules/page.js";
import Locale from "./i18n/locale.js";

let locale = new Locale();
locale.getLocale(config['locale'])
    .then(loc => {
        let page = new Page(config, loc);
        page.Init();
    })
    .catch(err => console.log(err))