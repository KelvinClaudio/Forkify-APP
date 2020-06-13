import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {elements , renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
/* Global state pf the app 
* - Search object
* - Current recipe object
* - Shopping list object
* - Linked recipes
*/
let state = {};
/*
** Search Controller
*/
const controlSearch = async () => {
   //get query from view 
   const query = searchView.getInput();
   if(query) {
      try {
      //new search object and add to state
      state.search = new Search(query);
      //prepare UI for result 
      searchView.clearInput();
      searchView.clearResult();
      renderLoader(elements.searchRes);
      //search for recipes
      await state.search.getResult();
      //render result on UI
      clearLoader();
      searchView.renderResult(state.search.result);


      } catch (error) {
         alert('Not found !!')
         clearLoader();
      }
   };
};

elements.searchForm.addEventListener('submit', e => {
   e.preventDefault();
   controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
   const btn = e.target.closest('.btn-inline');

   if(btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);
      searchView.clearResult();
      searchView.renderResult(state.search.result, goToPage);
   }
})

/*
* Recipe Controller
*/
const controlRecipe = async () => {
   //Get id from url
   const id = window.location.hash.replace('#', '');
   if (id) {
      try {
         if(state.search) searchView.highlightSelected(id)
         // Prepare UI for change
         recipeView.clearRecipe()
         renderLoader(elements.recipe)
         // Create new recipe object
         state.Recipe = new Recipe(id);
   
         // Get recipe data and parseIngredients
         await state.Recipe.getRecipe();  
         state.Recipe.parseIngredients();
   
         // Calculate servings and time
         state.Recipe.calcTime();
         state.Recipe.calcServings();
   
         // Render recipe
         clearLoader();
         recipeView.renderRecipe(state.Recipe, state.Likes.isLiked(id));
   
      }catch(error) {
         recipeView.clearRecipe()
         renderLoader(elements.recipe)
         // Create new recipe object
         state.Recipe = new Recipe(id);
   
         // Get recipe data and parseIngredients
         await state.Recipe.getRecipe();  
         state.Recipe.parseIngredients();
   
         // Calculate servings and time
         state.Recipe.calcTime();
         state.Recipe.calcServings();
   
         // Render recipe
         clearLoader();
         recipeView.renderRecipe(state.Recipe, state.Likes.isLiked(id));
      }
   }
}
/*
* List Controller
*/
const controlList = () => {
   // 
   if(!state.List) state.List = new List;
   //
   state.Recipe.ingredients.forEach(el => {
      const item = state.List.addItem(el.count, el.unit, el.ingredient);
      listView.renderItem(item)
   })
   // 
}
elements.shopping.addEventListener('click', e => {
   const id = e.target.closest('.shopping__item').dataset.itemid;

   if(e.target.matches('.shopping__delete, .shopping__delete *')){
      // delete from state
      state.List.deleteItem(id);
      // delet from UI
      listView.deleteItem(id);
   }else if(e.target.matches('.shopping__count--value')){
      const val = parseFloat(e.target.value);

      if(val > 0) state.List.updateCount(id , val)
      
   }
});

/*
* Likes Controller
*/
window.addEventListener('load', () => {
   state.Likes = new Likes();
   // get data from local storage
   state.Likes.readStorage();
   //
   likesView.toggleLikeMenu(state.Likes.getNumLikes());
   // render the existing like
   state.Likes.likes.forEach(e => likesView.renderLikes(e))
})

const controlLike = () => {
   // check state
   if(!state.Likes) state.Likes = new Likes()
   
   // get ID 
   const currentID = state.Recipe.id;
   // check the likes button
   if(!state.Likes.isLiked(currentID)){
      // add to state
      const item = state.Likes.addLike(
         currentID,
         state.Recipe.title,
         state.Recipe.author,
         state.Recipe.img
      )
      // toggle like button
      likesView.toggleLikeBtn(true)
      //update Ui
      likesView.renderLikes(item);
      
   }else {
      // remove from state
      state.Likes.deleteLike(currentID)
      // toggle like button
      likesView.toggleLikeBtn(false)
      //update Ui
      likesView.deleteItem(currentID);
   }
   likesView.toggleLikeMenu(state.Likes.getNumLikes());
}

elements.recipe.addEventListener('click', e => {
   if(e.target.matches('.btn-decrease, .btn-decrease *')){
      if(state.Recipe.servings > 1){
         state.Recipe.updateServings('dec');
         recipeView.updateServingsIngredients(state.Recipe);
      }
   }else if(e.target.matches('.btn-increase, .btn-increase *')){
      state.Recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.Recipe);
   }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
      controlList();
   }else if(e.target.matches('.recipe__love, .recipe__love *')){
      controlLike()
   }
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


