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
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            addTag(tag);
        })
        filters.appliances.list.append(li);
    });

    ustensilsArray.map((ustensil) => {
        const tag = new Tag(ustensil, filters.ustensils.name);
        const li = new ListElements(ustensil).displayItem();
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            addTag(tag);
        })
        filters.ustensils.list.append(li);
    });
}

function addTag (tag) {
    selectedTags.push(tag);
    createTag();
    algo1();
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
    selectedTags.splice(id, 1);
    createTag();
    displayData(recipes);
}

function searchKeyword (filter) {
    let value = filter.input.value;
    let listItem = filter.list.querySelectorAll('li');
   
    for (let i = 0; i < listItem.length; i++) {
        if (!listItem[i].innerText.toLowerCase().startsWith(value.toLowerCase())) {
            listItem[i].style.display = "none";
        } else {
            listItem[i].style.display = "";
        }
        console.log(value);
    }
}


function search(){
    const search = document.getElementById('search');
    let searchValue = search.value.toLowerCase();
    if (searchValue.length >= 3) {
    algo1();
    } else {
        displayData(recipes);
    }
}

function algo1(){
    const search = document.getElementById('search');
    let searchValue = search.value.toLowerCase();

    //créé array recettes filtrées
    let filteredRecipes = [];

    let hasTagAppliances = true;
    let hasTagIngredients = true;
    let hasTagUstensils = true;

        //map le tableau des recettes
        for (let i = 0; i < recipes.length; i++) {
            
            //vérifie si le nom, la description ou les ingrédients de la recette contiennent le texte entré dans l'input
            if(
                recipes[i].name.toLowerCase().includes(searchValue) || 
                recipes[i].description.toLowerCase().includes(searchValue) ||
                recipes[i].ingredients.find( ({ingredient}) => ingredient.toLowerCase().includes(searchValue))) {
                //ajoute la recette à l'array des recettes filtrées
                filteredRecipes.push(recipes[i]);
            }
            //map le tableau des tags sélectionnés
            for(let x = 0; x < selectedTags.length; x++) {
                //check le type de tag, passe false si le type ne correspond pas
                if(selectedTags[x].type != 'appliances') {
                    hasTagAppliances = false;
                }
                if(selectedTags[x].type != 'ingredients') {
                    hasTagIngredients = false;
                }
                if(selectedTags[x].type != 'ustenstils') {
                    hasTagUstensils = false;
                }
                //si le type de tag est présent
                if(hasTagAppliances || hasTagIngredients || hasTagUstensils) {
                    //vérifie que le nom du tag est présent dans les recettes
                    if (recipes[i].appliance.toLowerCase() == selectedTags[x].name.toLowerCase() ||
                    recipes[i].ingredients.find( ({ingredient}) => ingredient.toLowerCase() == selectedTags[x].name.toLowerCase()) ||
                    recipes[i].ustensils.find(ustensil => ustensil.toLowerCase() == selectedTags[x].name.toLowerCase())) {
                        //ajoute la recette au tableau filtré
                        console.log(selectedTags[x])
                        filteredRecipes = [];
                        filteredRecipes.push(recipes[i]);
                    }
                }
            }
         
        }
    displayData(filteredRecipes);
}


    /* for (let i = 0; i < recipes.length; i++) {
        for(let x = 0; x < selectedTags.length; x++) {
            console.log(selectedTags[x])
            if(selectedTags[x].type != 'appliances') {
                hasTagAppliances = false;
            }
            if(selectedTags[x].type != 'ingredients') {
                hasTagIngredients = false;
            }
            if(selectedTags[x].type != 'ustenstils') {
                hasTagUstensils = false;
            }
            if(!hasTagAppliances || !hasTagUstensils || !hasTagIngredients) {
                if (
                    recipes[i].ingredients.toLowerCase().includes(selectedTags[x].name.toLowerCase()) || recipes[i].ustensils.toLowerCase().includes(selectedTags[x].name.toLowerCase()) || 
                    recipes[i].appliance.toLowerCase().includes(selectedTags[x].name.toLowerCase())
                ) {
                    filteredRecipes.push(recipes[i]);
                }
            }
        }
        displayData(filteredRecipes);
    } */

//display recettes
function displayData(recipes) {
    const container = document.querySelector('.recipes');
    container.innerHTML = "";

    recipes.forEach((recipe) => {
        const recipeCard = new Recipe(recipe).displayRecipe();
        container.appendChild(recipeCard);
    })
}

function init () {
    displayData(recipes);
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
