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
    for(const [, filter] of Object.entries(filters)){
        filter.container.classList.add('hidden-m');
        if(filter.container.classList.contains('expandedfirst')){
            filter.container.classList.remove('hidden-m');
        }
    }
}

//affichage des listes en grand
function expandList(filter){
    if (currentFilter != filter) showList(filter) ; //vérifie le filtre actuel, affiche la liste normalement si inégal
    //ajoute en enlève les classes correspondantes
    filter.control.classList.toggle('rotate');
    filter.label.classList.remove('hidden');
    filter.input.classList.remove("clicked");
    filter.container.classList.toggle('expanded');
    filter.container.classList.remove('expandedfirst');
    filter.list.classList.remove('openfirst');
    filter.list.classList.toggle('open');
    for(const [, filter] of Object.entries(filters)){
        filter.container.classList.add('hidden-m');
        if(filter.container.classList.contains('expanded')){
            filter.container.classList.remove('hidden-m');
        }
    }
}

//fermeture des listes
function closeList(){
    //enlève le listener de clique en dehors
    document.removeEventListener('click', clickOut);
    //raccourci current filter
    let filter = currentFilter;
    //ajoute ou enlève les classes correspondantes
    filter.control.classList.remove('rotate');
    filter.label.classList.remove('hidden');
    filter.input.classList.remove("clicked");
    filter.container.classList.remove('expandedfirst');
    filter.container.classList.remove('expanded');
    filter.list.classList.remove('open');
    filter.list.classList.remove('openfirst');
    //cache le label si l'input n'est pas vide
    if (filter.input.value != ""){
        filter.label.classList.add('hidden');
    }
    for(const [, filter] of Object.entries(filters)){
        filter.container.classList.remove('hidden-m');
    }
    //passe current filter à null
    currentFilter = null;
}

//fermeture des listes au click en dehors
function clickOut(e){
    let clickTarget = e.target;
    if (!currentFilter.container.contains(clickTarget)) {
        closeList();
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
    //map l'array des ingrédients
    ingredientsArray.map((ingredient) => {
        //créé un tag ingrédient
        const tag = new Tag(ingredient, filters.ingredients.name);
        if (tagIsActive(tag)) return; //retire le tag de la liste si il est cliqué
        //créé élément de liste
        const li = new ListElements(ingredient).displayItem();
        //listener au click sur un item de liste
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

//ajout des tags
function addTag (tag) {
    //récupère l'index d'un tag
    const id = selectedTags.findIndex((item) => item.name == tag.name);
    if(id < 0){
        //ajout du tag à l'array des tags sélectionnés
        selectedTags.push(tag);
        //créé le tag
        createTag();
        //filtre les recettes
        filterRecipes();
    }
}

//création des tags
function createTag(){
    //vide le container
    tagsContainer.innerHTML = "";
    //map le tableau des tags sélectionnés
    selectedTags.forEach((tag) => {
        //créé les tags (classe dans filter.js)
        const tagElem = tag.displayTag(tagsTypes[tag.type]);
        //listener sur le bouton close, retire le tag
        tagElem.querySelector('button').addEventListener('click', () => {
            closeTag(tag);
        })
        tagsContainer.append(tagElem);
    })
}

//fermeture des tags
function closeTag(tag){
    //récupère l'index des items dans l'array des tags sélectionnés
    const id = selectedTags.findIndex((item) => item.name == tag.name && item.type == tag.type);
    //retire le tag de l'array
    selectedTags.splice(id, 1);
    createTag();
    //filtre les recettes
    filterRecipes();
}

//vérifie si un tag est déjà cliqué
function tagIsActive(tag) {
    const id = selectedTags.findIndex((item) => item.name == tag.name && item.type == tag.type);
    if (id >= 0) {
        return true;
    } else {
        return false;
    }
}

//fonction de recherche d'éléments dans les listes
function searchKeyword (filter) {
    //récupère le texte entré dans un input
    let value = filter.input.value;
    //récupère tous les éléments de listes
    let listItem = filter.list.querySelectorAll('li');
    //loop dans les items de listes
    for (let i = 0; i < listItem.length; i++) {
        //si l'élément ne commence pas par le texte entré
        if (!listItem[i].innerText.toLowerCase().startsWith(value.toLowerCase())) {
            listItem[i].style.display = "none"; //cache l'élément
        } else {
            listItem[i].style.display = ""; //sinon laisse l'élément dans la liste
        }
    }
} 

//fonction de recherche principale, appellée dans le html
function search(){
    filterRecipes();
}

//fonction de filtrage des recettes
function filterRecipes(){ //call dans search, addtag & closetag functions
    const search = document.getElementById('search'); //search bar
    let searchValue = search.value.toLowerCase(); //récupère le texte entré dans la search bar
    //créé array recettes filtrées
    let filteredRecipes = [];
    //filtre le tableau des recettes
    recipes.filter(recipe => {
        let hasSearch = true;
        //check que 3 caractères ou + sont entrés
        if(searchValue.length >= 3){
            //vérifie si le nom, la description ou les ingrédients de la recette contiennent le texte entré dans l'input
            if(
                !recipe.name.toLowerCase().includes(searchValue) && 
                !recipe.description.toLowerCase().includes(searchValue) &&
                !recipe.ingredients.find( ({ingredient}) => ingredient.toLowerCase().includes(searchValue))) {
                //return false si le texte entré ne correspond à rien
                hasSearch = false;
            }
        }
        //vérifie les tags
        let hasTagAppliances = true;
        let hasTagUstensils = true;
        let hasTagIngredients = true;
        //filter tags par type
        const tagsIngredients = selectedTags.filter(({type}) => type == 'ingredients');
        const tagsAppliances = selectedTags.filter(({type}) => type == 'appliances');
        const tagsUstensils = selectedTags.filter(({type}) => type == 'ustensils');
        //si tous les noms des tags ne sont pas dans la recette, passe à false
        if(!tagsIngredients.every(({name}) => recipe.ingredients.find( ({ingredient}) => ingredient.toLowerCase().includes(name)))) {
            hasTagIngredients = false;
        }
        if(!tagsUstensils.every(({name}) => recipe.ustensils.find( (ustensil) => ustensil.toLowerCase().includes(name)))) {
            hasTagUstensils = false;
        }
        if(!tagsAppliances.every(({name}) => recipe.appliance.toLowerCase().includes(name))) {
            hasTagAppliances = false;
        }
        //ajoute la recette à l'array si elle passe les checks
        if(hasSearch && hasTagAppliances && hasTagIngredients && hasTagUstensils) {
            filteredRecipes.push(recipe);
        }         
    });
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
        container.innerHTML = `<p>Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>`;
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
    container.innerHTML = ""; //vide le container

    //créé une card pour chaque recette
    recettes.forEach((recipe) => {
        const recipeCard = new Recipe(recipe).displayRecipe();
        container.appendChild(recipeCard);
    })

}

//init principal
function init () {
    displayData(recipes); //affiche les recettes
    createArrays(recipes); //créé les arrays d'éléments des recettes
    createLists(); //créé les listes de filtres

    //loop les objets des filtres et ajoute les listeners
    for(const [, filter] of Object.entries(filters)) {
        //listener au click sur le bouton d'input
        filter.control.addEventListener('click', () => {
            expandList(filter);
            
        })
        //listener au click dans l'input
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
        //listener à la frappe au clavier dans l'input
        filter.input.addEventListener('keyup', () => {
            searchKeyword(filter); //filtre les listes
        })
    }
}
//init
init();
