async function displayData() {
    const container = document.querySelector('.recipes');

    recipes.forEach((recipe) => {
        container.appendChild(new Recipe(recipe).displayRecipe());
    })
}

async function init (){
    await displayData();
}

init();
