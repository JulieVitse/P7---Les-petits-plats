/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let ustensilsArray = [];
let applianceArray = [];
let ingredientsArray = [];

const container = document.querySelector('.recipes');
const tagsContainer = document.querySelector('.search__tags');

const filters = {
    // eslint-disable-next-line no-undef
    ingredients: new Filter(document.querySelector('[data-filter="ingredients"]')),
    // eslint-disable-next-line no-undef
    appliances: new Filter(document.querySelector('[data-filter="appliances"]')),
    // eslint-disable-next-line no-undef
    ustensils: new Filter(document.querySelector('[data-filter="ustensils"]'))
};

// eslint-disable-next-line no-unused-vars
const filterTypes = ["ingredients", "appliances", "ustensils"];

let currentFilter = null;

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
    filter.list.classList.remove('openfirst');
    if (filter.input.value != ""){
        filter.label.classList.add('hidden');
    }
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
// eslint-disable-next-line no-undef
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
        // eslint-disable-next-line no-undef
        const tag = new Tag(ingredient, filters.ingredients.name);
        // eslint-disable-next-line no-undef
        const li = new ListElements(ingredient).displayItem();
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            addTag(tag);
        })
        filters.ingredients.list.append(li);
    });

    applianceArray.map((appliance) => {
        // eslint-disable-next-line no-undef
        const tag = new Tag(appliance, filters.appliances.name);
        // eslint-disable-next-line no-undef
        const li = new ListElements(appliance).displayItem();
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            addTag(tag);
        })
        filters.appliances.list.append(li);
    });

    ustensilsArray.map((ustensil) => {
        // eslint-disable-next-line no-undef
        const tag = new Tag(ustensil, filters.ustensils.name);
        // eslint-disable-next-line no-undef
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
    searchByTag();
    console.log(selectedTags)
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
    if(selectedTags.length == 0){
        displayData(recipes);
    }
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
    }
}


function search(){
    const search = document.getElementById('search');
    let searchValue = search.value.toLowerCase();
    if (searchValue.length >= 3) {
    container.innerHTML = "";
    algo1();
    } else { displayData(recipes) }
}

function algo1(){
    const search = document.getElementById('search');
    let searchValue = search.value.toLowerCase();

    //créé array recettes filtrées
    let filteredRecipes = [];

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

        if(filteredRecipes.length > 0){
            container.innerHTML = "";
            displayData(filteredRecipes);
        } else {
            container.innerHTML = `<p>Aucune recette trouvée</p>`
        }     
    }
}

function searchByTag(){
    //créé array recettes filtrées
    let filteredRecipes = [];

    //map le tableau des recettes
    for (let i = 0; i < recipes.length; i++) {       
        //map tableau tag
        for(let x = 0; x < selectedTags.length; x++) {
            //check nom du tag correspond à un item de la recette
            if(recipes[i].appliance.toLowerCase() == selectedTags[x].name.toLowerCase()) {
                //ajoute recette au tableau filtré
                filteredRecipes.push(recipes[i]);

            } else if (recipes[i].ingredients.find(({ingredient}) => ingredient.toLowerCase() == selectedTags[x].name.toLowerCase())) {
                //ajoute recette au tableau filtré
                filteredRecipes.push(recipes[i]);

            } else if (recipes[i].ustensils.find((ustensil) => ustensil.toLowerCase() == selectedTags[x].name.toLowerCase())) {
                //ajoute recette au tableau filtré
                filteredRecipes.push(recipes[i]);
            }

            if(filteredRecipes.length > 0){
                container.innerHTML = "";
                displayData(filteredRecipes);
            } else {
                container.innerHTML = `<p>Aucune recette trouvée</p>`
            }  
        }  
    }
}
    //displayData(filteredRecipes);  


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
function displayData(recettes) {
    const container = document.querySelector('.recipes');
    container.innerHTML = "";

    recettes.forEach((recipe) => {
        // eslint-disable-next-line no-undef
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
            if(filter.container.classList.contains('expanded')){
                filter.label.classList.add('hidden');
                filter.input.classList.add("clicked");
                filter.container.classList.add('expanded');
                filter.container.classList.remove('expandedfirst');
                filter.list.classList.remove('openfirst');
                filter.list.classList.add('open');
            } else {
                showList(filter);
            }
        })
        filter.input.addEventListener('keyup', () => {
            searchKeyword(filter);
        })
    }
}

init();
