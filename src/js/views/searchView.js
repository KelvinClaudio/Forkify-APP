import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
   elements.searchInput.value = '';
}; 
export const clearResult = () => {
   elements.searchResList.innerHTML = '';
   elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
   const removeClass = Array.from(document.querySelectorAll('.results__link'));
   removeClass.forEach(el => {
      el.classList.remove('results__link--active')
   });
   document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};
/* 
   'pasta with tomato sauce'
   acc = 0;
   acc / 0: pasta + current.length = 5 /newTitle = ['pasta']
   acc / 5: with + current.length = 9 /newTitle = ['pasta', 'with']
   acc / 9: tomato + current.length = 15 /newTitle = ['pasta', 'with', 'tomato']
   acc / 15: sauce + current.length = 20 /newTitle = ['pasta', 'with', 'tomato']
*/

export const limitRecipeTitle = (title, limit = 17)=> {
   const newTitle = [];
   if(title.length >= limit){
      title.split(' ').reduce((acc,cur) => {
         if(acc + cur.length <= limit) {
            newTitle.push(cur);
         };
         return acc + cur.length;
      }, 0);
      return `${newTitle.join(' ')} ...`;
   };
   return title;
};

const renderRecipe = recipe => {
   const results = `
   <li>
      <a class="results__link" href="#${recipe.recipe_id}">
         <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
         </figure>
         <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
         </div>
      </a>
   </li>
   `;
   elements.searchResList.insertAdjacentHTML('beforeend', results);
};
const createButton = (page, type) => `
   <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1 }>
      <span>Page ${type === 'prev' ? page - 1 : page + 1 }</span>
      <svg class="search__icon">
         <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
      </svg>
   </button>   
`

const renderBtn = (page, numResult, resPerPage) => {
   const pages = Math.ceil(numResult / resPerPage);
   let button;
   if(page === 1 && pages > 1) {
      // next btn
      button = createButton(page, 'next');
   }else if(pages > page) {
      //next + prev btn
      button = `
         ${createButton(page, 'prev')}
         ${createButton(page, 'next')}
      `
   }else if(pages === page && pages > 1) {
      //prev btn
      button = createButton(page, 'prev');
   }
   elements.searchResPages.insertAdjacentHTML('afterbegin', button)
};
export const renderResult = (recipes, page = 1, resPerPage = 10) => {
   // Render result of current Page
   const start = (page - 1)  * resPerPage;
   const end = page * resPerPage;
   recipes.slice(start, end).forEach(renderRecipe);

   // Render Pagination
   renderBtn(page, recipes.length, resPerPage)
};