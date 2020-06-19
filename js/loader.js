import config from "../config.js";
import Page from "./modules/page.js";
import Locale from "./i18n/locale.js";

let locale = new Locale();
locale.getLocale(config['locale'])
    .then(loc => {
        document.config = config;
        document.locale = loc;

        let page = new Page();
        page.Init();
    })
    .catch(err => console.log(err))