import axios from 'axios';


export default class Recipe {
   constructor(id){
      this.id = id;
   }

   async getRecipe(){
      try {
         const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
         this.title = res.data.recipe.title;
         this.author = res.data.recipe.publisher;
         this.img = res.data.recipe.image_url;
         this.url = res.data.recipe.source_url;
         this.ingredients = res.data.recipe.ingredients;      
         // console.log(res)
      }catch(error) {
         alert('Not Found')
      }   
   }

   calcTime() {
      //asumming we need 15 min for 3 ingredients
      const numIng = this.ingredients.length;
      const period = Math.ceil(numIng / 3);
      this.time = period * 15;
   }

   calcServings() {
      this.servings = 4;
   }

   parseIngredients() {
      const units = new Map();
         units.set('tablespoons', 'tbsp');
         units.set('tablespoon', 'tbsp');
         units.set('ounces', 'oz');
         units.set('ounce', 'oz');
         units.set('teaspoons', 'tspn');
         units.set('teaspoon', 'tspn');
         units.set('cups', 'cup');
         units.set('pounds', 'pound');

      const newIngredients = this.ingredients.map(el => {
         // 1. Uniform units
         let ingredient = el.toLowerCase();
         units.forEach((value, key) => {
            ingredient = ingredient.replace(key , value);
         });

         // 2. Remove parenthesis
         ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

         // 3. Parse ingredients into count and ingredients
         const arrIng = ingredient.split(' ');
         // unit = cup, tbsp , etc.
         const unitIndex = arrIng.findIndex(el2  => Array.from(units.values()).includes(el2));
         
         let objIng;
         if(unitIndex > -1){
            // There is a unit
            // 4 1/2 arrCount is [4, 1/2]
            // 4 arrCount is [4]
            const arrCount = arrIng.slice(0 , unitIndex);
            
            let count;
            if(arrCount.length === 1) {
               count = eval(arrIng[0].replace('-', '+'));
            }else {
               count = eval(arrCount.join('+'));
            }

            objIng = {
               count,
               unit: arrIng[unitIndex],
               ingredient: arrIng.slice(unitIndex + 1).join(' ')
            }
            
         }else if(parseInt(arrIng[0], 10)) {
         // There is no unit, but 1st element is number
            objIng = {
               count: parseInt(arrIng[0], 10),
               unit: '',
               ingredient: arrIng.slice(1).join(' ')
            }
         }else if(unitIndex === -1) {
         // There is no unit and no number in 1st position
            objIng = {
               count: 1,
               unit: '',
               ingredient
            }
         }

         return objIng;
      });
      this.ingredients = newIngredients;
   }

   updateServings(type) {
      // servings
      const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1; 
      // ingredients
      this.ingredients.forEach(ing => {
         ing.count = ing.count * (newServings / this.servings); 
      })
      this.servings = newServings;
   }
};
