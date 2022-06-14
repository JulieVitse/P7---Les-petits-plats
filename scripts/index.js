let ustensilsArray = [];
let applianceArray = [];
let ingredientsArray = [];

const tags = ["ingredients", "appareils", "ustensiles"];

const filters = {
    ingredients: new Filter(document.querySelector('[data-filter="ingredients"]')),
    appareils: new Filter(document.querySelector('[data-filter="appareils"]')),
    ustensiles: new Filter(document.querySelector('[data-filter="ustensiles"]'))
};

for(const [, filter] of Object.entries(filters)) {
    console.log(filter.name)
}
// créé arrays pour listes de filtre
recipes.map((recipe) => {
    recipe.ustensils.map((ustensil) => {
        ustensilsArray.push(ustensil.toLowerCase());
        ustensilsArray = [...new Set(ustensilsArray)].sort();
    });
    let ingredientList = recipe.ingredients.map(a => a.ingredient.toLowerCase());
    ingredientsArray.push(...ingredientList);
    ingredientsArray = [...new Set(ingredientsArray)].sort();
 
    applianceArray.push(recipe.appliance.toLowerCase());
    applianceArray = [...new Set(applianceArray)].sort();
})

function createLists () {
    ingredientsArray.map((ingredient) => {
        const li = new ListElements(ingredient).displayItem();
        filters.ingredients.list.append(li);
    });
    applianceArray.map((appliance) => {
        const li = new ListElements(appliance).displayItem();
        filters.appareils.list.append(li);
    });
    ustensilsArray.map((ustensil) => {
        const li = new ListElements(ustensil).displayItem();
        filters.ustensiles.list.append(li);
    });
}

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
}

init();
