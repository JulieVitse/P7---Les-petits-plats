class Filter {

    constructor(filter) {
        this.name = filter.dataset.filter;
        this.container = filter;
        this.label = filter.querySelector('[data-filter-label]');
        this.input = filter.querySelector('[data-filter-input]');
        this.list = filter.querySelector('[data-filter-list]');
        this.control = filter.querySelector('[data-filter-control]');
    }
};

class ListElements {
    constructor(name) {
        this.name = name;
    }

    displayItem() {
        const listElem = document.createElement('li');
        listElem.innerText = this.name;
        return listElem;
    }
}