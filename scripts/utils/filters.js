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

class Tag {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }

    displayTag(classType = 'primary') {
        const tag = document.createElement('span');
        tag.className = `search__tags__tag`
        tag.classList.add("search__tags__tag--" + classType)

        const tagExit = document.createElement('button');
        const tagExitBtn = document.createElement('img');
        tagExit.className = "search__tags__tag__btn";
        tagExitBtn.className = "search__tags__tag__btn__icon";
        tagExitBtn.src = "assets/icon-close.png";

        tag.innerText = this.name;
        tagExit.append(tagExitBtn);
        tag.append(tagExit);
        return tag;
    }

    displayItem() {
        const listElem = document.createElement('li');
        listElem.innerText = this.name;
        return listElem;
    }
}