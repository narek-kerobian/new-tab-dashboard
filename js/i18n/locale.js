export class Locale {

    localeFallback;

    constructor() {
        this.localeFallback = 'en';
    }

    getLocale(locale)
    {
        return new Promise(resolve => {
            import(`./${locale}.js`)
                .then(mod => {
                    resolve(mod.default)
                })
                .catch(err => {
                    console.error('Locale not found loading fallback')
                    import(`./${this.localeFallback}.js`)
                        .then(mod => {
                            resolve(mod.default)
                        })
                })
        })
    }

}

export default Locale;