import config from "../config.js";
import Main from "./modules/main.js";
import Locale from "./i18n/locale.js";

let locale = new Locale();
locale.getLocale(config['locale'])
    .then(loc => {
        document.config = config;
        document.locale = loc;

        let main = new Main();
        main.Init();
    })
    .catch(err => console.log(err))