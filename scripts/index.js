let ustensilsArray = [];
let applianceArray = [];
let ingredientsArray = [];

const tagsContainer = document.querySelector('.search__tags');

const filters = {
    ingredients: new Filter(document.querySelector('[data-filter="ingredients"]')),
    appliances: new Filter(document.querySelector('[data-filter="appliances"]')),
    ustensils: new Filter(document.querySelector('[data-filter="ustensils"]'))
};

const filterTypes = ["ingredients", "appliances", "ustensils"];

let currentFilter = null;

/* const tags = {
    ingredients: [],
    appliances: [],
    ustensils: []
} */

const tagsTypes = {
    ingredients: 'primary',
    appliances: 'secondary',
    ustensils: 'tersiary',
}

const selectedTags = [];


function showList (filter){
    if (currentFilter) {
        closeList();
    }
    //console.log(currentFilter)
    currentFilter = filter;

    document.addEventListener('click', clickOut);
    //console.log(currentFilter)
    filter.label.classList.add('hidden');
    filter.input.classList.add('clicked');
    filter.container.classList.add('expandedfirst');
    filter.list.classList.remove('open');
    filter.list.classList.add('openfirst');
}

function expandList(filter){
    if (currentFilter != filter) showList(filter);
    //console.log(currentFilter);
    //console.log(filter);
    filter.control.classList.toggle('rotate');
    filter.label.classList.remove('hidden');
    filter.input.classList.remove("clicked");
    filter.container.classList.toggle('expanded');
    filter.container.classList.remove('expandedfirst');
    filter.list.classList.remove('openfirst');
    filter.list.classList.toggle('open');
}

function closeList(){
    document.removeEventListener('click', clickOut);
    let filter = currentFilter;
    filter.control.classList.remove('rotate');
    filter.label.classList.remove('hidden');
    filter.input.classList.remove("clicked");
    filter.container.classList.remove('expandedfirst');
    filter.container.classList.remove('expanded');
    filter.list.classList.remove('open');
    filter.list.classList.remove('openfirst')
    currentFilter = null;
}

function clickOut(e){
    let clickTarget = e.target;
    if (!currentFilter.container.contains(clickTarget)) {
        closeList();
        //console.log(clickTarget);
    }
}

// créé arrays pour listes de filtre
recipes.map((recipe) => {
    //ustenstiles array
    recipe.ustensils.map((ustensil) => {
        ustensilsArray.push(ustensil.toLowerCase());
        ustensilsArray = [...new Set(ustensilsArray)].sort();
    });
    //ingredients array
    let ingredientList = recipe.ingredients.map(a => a.ingredient.toLowerCase());
    ingredientsArray.push(...ingredientList);
    ingredientsArray = [...new Set(ingredientsArray)].sort();
    // appareils array
    applianceArray.push(recipe.appliance.toLowerCase());
    applianceArray = [...new Set(applianceArray)].sort();
})

function createLists () {
    ingredientsArray.map((ingredient) => {
        const tag = new Tag(ingredient, filters.ingredients.name);
        const li = new ListElements(ingredient).displayItem();
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            addTag(tag);
        })
        filters.ingredients.list.append(li);
    });

    applianceArray.map((appliance) => {
        const tag = new Tag(appliance, filters.appliances.name);
        const li = new ListElements(appliance).displayItem();
        li.addEventListener('click', () => {
            e.stopPropagation();
            addTag(tag);
        })
        filters.appliances.list.append(li);
    });

    ustensilsArray.map((ustensil) => {
        const tag = new Tag(ustensil, filters.ustensils.name);
        const li = new ListElements(ustensil).displayItem();
        li.addEventListener('click', () => {
            e.stopPropagation();
            addTag(tag);
        })
        filters.ustensils.list.append(li);
    });
}

function addTag (tag) {
    selectedTags.push(tag);
    createTag();
    //console.log(selectedTags)
}

function createTag(){
    tagsContainer.innerHTML = "";
    selectedTags.forEach((tag) => {
        const tagElem = tag.displayTag(tagsTypes[tag.type]);
        tagElem.querySelector('button').addEventListener('click', () => {
            closeTag(tag);
        })
        tagsContainer.append(tagElem);
    })
}

function closeTag(tag){
    const id = selectedTags.findIndex((item) => item.name == tag.name && item.type == tag.type);
    //console.log(id);
    //selectedTags.pop(tag);
    selectedTags.splice(id, 1);
    //console.log(tag.name, tag.type)
    createTag();
    //console.log(selectedTags);
}

function searchKeyword (filter) {
    let value = filter.input.value;
    let listItem = filter.list.querySelectorAll('li');
   
    for (let i = 0; i < listItem.length; i++) {
        if (!listItem[i].innerText.toLowerCase().includes(value)) {
            listItem[i].style.display = "none";
        } else {
            listItem[i].style.display = "";
        }
        console.log(value);
    }
}

/* let tagsArray = ustensilsArray.concat(applianceArray, ingredientsArray);
console.log(tagsArray); */

//display recettes
async function displayData() {
    const container = document.querySelector('.recipes');

    recipes.forEach((recipe) => {
        const recipeCard = new Recipe(recipe).displayRecipe();
        container.appendChild(recipeCard);
    })
}



async function init () {
    await displayData();
    createLists();

    for(const [, filter] of Object.entries(filters)) {
        filter.control.addEventListener('click', () => {
            expandList(filter);
        })
        filter.input.addEventListener('click', () => {
            showList(filter);
        })
        filter.input.addEventListener('keyup', () => {
            searchKeyword(filter);
        })
    }
}

init();
