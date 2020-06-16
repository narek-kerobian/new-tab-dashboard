export class Search {

    engines;
    searchUrl;

    controlSearchForm;
    controlSearch;
    controlSearchSelectorContainer;
    controlSearchSelectorDefault;
    controlSearchSelectorToggle;

    constructor(engines) {
        this.engines = engines;
        this.controlSearchForm = document.querySelector('form.search-form');
        this.controlSearch = document.querySelector('input[name="search"]');
        this.controlSearchSelectorContainer = this.controlSearchForm.querySelector('.input-group-prepend');
        this.controlSearchSelectorDefault = this.controlSearchSelectorContainer.querySelector('.input-group-button .icon');
        this.controlSearchSelectorToggle = this.controlSearchSelectorContainer.querySelector('.dropdown-menu');
    }

    init()
    {
        // Set default engine
        this._setDefaultEngine(this.engines[0]);
        // Set search engine list
        this._setSearchEngineList();
        // Add search listener
        this._eventSearchForm(this.searchUrl);
    }

    _setDefaultEngine(engine)
    {
        // Add default
        this.searchUrl = engine['search_url'];

        // Set icon
        if(engine['font_awesome_icon'] !== '') {
            this.controlSearchSelectorDefault.innerHTML = `<i class="fa ${engine['font_awesome_icon']}" title="${engine['title']}"></i>`;
        }
        if(engine['icon_url'] !== '') {
            this.controlSearchSelectorDefault.innerHTML = `<img src="${engine['icon_url']}" alt="${engine['title']}" title="${engine['title']}" />`;
        }
    }

    _setSearchEngineList()
    {
        this.engines.forEach((engine, idx) => {
            // <a class="dropdown-item" href="#">Action</a>
            // this.controlSearchSelectorToggle
            let item = document.createElement('a');
            item.classList.add('dropdown-item');

            let icon;
            if(engine['font_awesome_icon'] !== '') {
                icon = document.createElement('i');
                icon.classList.add('fa');
                icon.classList.add(engine['font_awesome_icon']);
            }
            if(engine['icon_url'] !== '') {
                icon = document.createElement('img');
                icon.src = engine['icon_url'];
            }
            icon.classList.add('icon');

            let textNode = document.createTextNode(engine['title']);

            item.appendChild(icon);
            item.appendChild(textNode);
            item.href = '#';
            item.dataset.index = idx;

            item.addEventListener('click', e => {
                e.preventDefault();
                this.searchUrl = this.engines[item.dataset.index]['search_url'];
                this._setDefaultEngine(this.engines[item.dataset.index])
                this._eventSearchForm(this.searchUrl);
            })

            this.controlSearchSelectorToggle.appendChild(item);
        })
    }

    _eventSearchForm(searchUrl)
    {
        this.controlSearchForm.addEventListener('submit', e => {
            e.preventDefault();
            let searchQuery = this.controlSearch.value;
            window.location.href = searchUrl + searchQuery
            return false;
        })
    }

}
export default Search;