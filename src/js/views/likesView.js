import {elements} from './base';
import {limitRecipeTitle} from './searchView'

export const toggleLikeBtn = isliked => {
   const iconString = isliked ? 'icon-heart' : 'icon-heart-outlined';
   document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`)
};
export const toggleLikeMenu = numLikes => {
   elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden'
};
export const renderLikes = (item) => {
   const markup = `
   <li>
      <a class="likes__link" href="#${item.id}">
         <figure class="likes__fig">
            <img src="${item.img}" alt="${item.title}">
         </figure>
         <div class="likes__data">
            <h4 class="likes__name">${limitRecipeTitle(item.title)}</h4>
            <p class="likes__author">${item.author}</p>
         </div>
      </a>
   </li>
   `
   elements.likesList.insertAdjacentHTML("afterbegin", markup);
};

export const deleteItem = (id) => {
   const element = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
   element.parentElement.removeChild(element);
};