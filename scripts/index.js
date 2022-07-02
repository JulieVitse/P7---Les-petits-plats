/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/* -------------------------------- ELEMENTS -------------------------------- */
//arrays des items des recettes
let ustensilsArray = [];
let applianceArray = [];
let ingredientsArray = [];

//dom elements
const container = document.querySelector('.recipes');
const tagsContainer = document.querySelector('.search__tags');

//créé les filtres - classe dans filters.js
const filters = {
    ingredients: new Filter(document.querySelector('[data-filter="ingredients"]')),
    appliances: new Filter(document.querySelector('[data-filter="appliances"]')),
    ustensils: new Filter(document.querySelector('[data-filter="ustensils"]'))
};

//init le filtre actuel - utilisé dans les fonctions de listes
let currentFilter = null;
//défini les classes des tags selon leur type
const tagsTypes = {
    ingredients: 'primary',
    appliances: 'secondary',
    ustensils: 'tersiary',
}
//créé array des tags sélectionnés
const selectedTags = [];

/* -------------------------------- FONCTIONS ------------------------------- */

//affichage des listes
function showList (filter){
    if (currentFilter) { // currentfilter est null de base
        closeList(); // ferme la liste
    }
    currentFilter = filter; // passe currentfilter au filtre actif
    document.addEventListener('click', clickOut); // listener du click en dehors
    //ajoute ou enlève les classes correspondantes
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
function createArrays(recipeArray){
    recipeArray.map((recipe) => {
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
}


//création des listes d'éléments (ingrédients, ustensils, appareils)
function createLists () {
    ingredientsArray.map((ingredient) => {
        const tag = new Tag(ingredient, filters.ingredients.name);
        if (tagIsActive(tag)) return;
        const li = new ListElements(ingredient).displayItem();
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            addTag(tag);
        })
        filters.ingredients.list.append(li);
    });

    applianceArray.map((appliance) => {
        const tag = new Tag(appliance, filters.appliances.name);
        if (tagIsActive(tag)) return;
        const li = new ListElements(appliance).displayItem();
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            addTag(tag);
        })
        filters.appliances.list.append(li);
    });

    ustensilsArray.map((ustensil) => {
        const tag = new Tag(ustensil, filters.ustensils.name);
        if (tagIsActive(tag)) return;
        const li = new ListElements(ustensil).displayItem();
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            addTag(tag);
        })
        filters.ustensils.list.append(li);
    });
}

function addTag (tag) {
    const id = selectedTags.findIndex((item) => item.name == tag.name);
    if(id < 0){
        selectedTags.push(tag);
        createTag();
        filterRecipes();
    }
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
    filterRecipes();
}

function tagIsActive(tag) {
    const id = selectedTags.findIndex((item) => item.name == tag.name && item.type == tag.type);
    if (id >= 0) {
        return true;
    } else {
        return false;
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

//fonction de recherche principale, appellée dans le html
function search(){
    filterRecipes();
}

function filterRecipes(){
    const search = document.getElementById('search');
    let searchValue = search.value.toLowerCase();

    //créé array recettes filtrées
    let filteredRecipes = [];

    //map le tableau des recettes
    for (let i = 0; i < recipes.length; i++) {
        
        let hasSearch = true;

        //check que 3 caractères ou + sont entrés
        if(searchValue.length >= 3){
            //vérifie si le nom, la description ou les ingrédients de la recette contiennent le texte entré dans l'input
            if(
                !recipes[i].name.toLowerCase().includes(searchValue) && 
                !recipes[i].description.toLowerCase().includes(searchValue) &&
                !recipes[i].ingredients.find( ({ingredient}) => ingredient.toLowerCase().includes(searchValue))) {
                //return false si le texte entré ne correspond à rien
                hasSearch = false;
            }
        }

        //vérifie les tags
        let hasTagAppliances = true;
        let hasTagUstensils = true;
        let hasTagIngredients = true;
        let countTagIngredients = 0;
        let countTagUstensils = 0;
        let countIngredientsInRecipe = 0;
        let countUstensilsInRecipe = 0;

        //map tableau des tags sélectionnés
        for(let x = 0; x < selectedTags.length; x++) {

            //check les tags appliances
            if(selectedTags[x].type == 'appliances') {
                //check si l'item dans la recette correspond au nom du tag
                if(recipes[i].appliance.toLowerCase() != selectedTags[x].name.toLowerCase()) {
                    //passe à false si le tag n'est pas présent dans la recette
                    hasTagAppliances = false;
                }
            }

            //check les tags ingrédients
            if(selectedTags[x].type == 'ingredients') {
                //increase count des tags ingredients
                countTagIngredients++;
                //map les ingrédients de la recette
                for(let y = 0; y < recipes[i].ingredients.length; y++) {
                    //check si un ingrédient de la recette correspond au nom du tag
                    if(recipes[i].ingredients[y].ingredient.toLowerCase() == selectedTags[x].name.toLowerCase()) {
                        //increase count des ingrédients présents dans la recette
                        countIngredientsInRecipe++;
                    }
                }
            }

            //check les tags ustensils
            if(selectedTags[x].type == 'ustensils') {
                //increase count des tags ustensils
                countTagUstensils++;
                //map les ustensiles de la recette
                for(let z = 0; z < recipes[i].ustensils.length; z++) {
                    //check si un ustensile de la recette correspond au nom du tag
                    if(recipes[i].ustensils[z].toLowerCase() == selectedTags[x].name.toLowerCase()) {
                        //increase count des ustensiles présents dans la recette
                        countUstensilsInRecipe++;
                    }
                }
            }
        }

        //compare count total des ingrédients au count des ingrédients présents dans la recette
        if (countTagIngredients != countIngredientsInRecipe) {
            //passe à false si ils ne sont pas égaux
            hasTagIngredients = false;
        }

        //compare count total des ustensils au count des ustensiles présents dans la recette
        if (countTagUstensils != countUstensilsInRecipe) {
            //passe à false si ils ne sont pas égaux
            hasTagUstensils = false;
        }

        //ajoute la recette à l'array si elle passe les checks
        if(hasSearch && hasTagAppliances && hasTagIngredients && hasTagUstensils) {
            filteredRecipes.push(recipes[i]);
        }    
    }

    //mets à jour les tags
    populateTags(filteredRecipes);

    //check si l'array de recettes filtrées contient au moins une recette
    if(filteredRecipes.length > 0){
        //reset l'affichage
        container.innerHTML = "";
        //display les recettes
        displayData(filteredRecipes);
        //sinon affiche le message d'erreur
    } else {
        container.innerHTML = `<p>Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>`
    } 
}

//fonction de re-render des listes de tags
function populateTags(filteredRecipes) {
    //vide les listes
    filters.ingredients.list.innerHTML = "";
    filters.appliances.list.innerHTML = "";
    filters.ustensils.list.innerHTML = "";
    //vide les arrays
    ingredientsArray = [];
    ustensilsArray = [];
    applianceArray = [];
    //re-créé les arrays avec les recettes filtrées
    createArrays(filteredRecipes);
    //re-créé les listes d'options
    createLists();
}

//display recettes
function displayData(recettes) {
    const container = document.querySelector('.recipes');
    container.innerHTML = "";

    recettes.forEach((recipe) => {
        const recipeCard = new Recipe(recipe).displayRecipe();
        container.appendChild(recipeCard);
    })

}

//init principal
function init () {
    displayData(recipes);
    createArrays(recipes);
    createLists();

    //loop les objets des filtres et ajoute les listeners
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
