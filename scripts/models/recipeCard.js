class Ingredient {
    constructor(data){
        this.name = data.ingredient;
        if (data.quantity) {
            this.quantity = data.quantity;
        }
        if (data.unit) {
            this.unit = data.unit;
            if (this.unit == "grammes") {
                let g = this.unit.slice(0,1);
                this.unit = g;
            }
        }
    }
}

class Recipe {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.servings = data.servings;
        this.time = data.time;
        this.description = data.description;
        this.appliance = data.appliance;

        this.ustensils = [];
        data.ustensils.forEach(element => {
            this.ustensils.push(element);
        });

        this.ingredients = [];
        data.ingredients.forEach(element => {
            this.ingredients.push(new Ingredient(element));
        })

        //console.log(this.ingredients)
    }

    get minDescription () {
        const maxLength = 200;
        if (this.description.length <= maxLength) {
            return this.description;
        }
        let descriptionShorten = this.description.slice(0, maxLength);
        return descriptionShorten + `...`;
    }

    displayRecipe() {
        const recipeCard = document.createElement('article');
        recipeCard.className = "card";

        recipeCard.innerHTML = `
        <div class="card__img"></div>
        <div class="card__content">
            <div class="card__content__top">
                <h4 class="card__content__top__title">${this.name}</h4>
                <span class="card__content__top__time"><img src="/assets/timer.png" alt="">${this.time} min</span>
            </div>

            <div class="card__content__bot">
                <ul class="card__content__bot__list"></ul>
                <div class="card__content__bot__description">${this.minDescription}</div>
            </div>
        </div>
        `;
        let ingredientsList = recipeCard.querySelector('.card__content__bot__list');

        this.ingredients.forEach((ingredient) => {
            if (ingredient.quantity) {
                ingredientsList.innerHTML += `<li>${ingredient.name}: <span>${ingredient.quantity} ${(ingredient.unit) ? ingredient.unit : ''}</span></li>`
            } else {
                ingredientsList.innerHTML += `<li>${ingredient.name}</li>`
            }
        });
        return recipeCard;
    }
}