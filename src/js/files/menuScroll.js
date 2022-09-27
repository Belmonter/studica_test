let menu = document.querySelector('.menu__list');
let arrow = document.querySelector('.menu__arrow');

arrow.addEventListener("click", function (e) {
  let difference =  menu.scrollWidth - menu.clientWidth;
  if (arrow.classList.contains('arrow-back')) {
    arrow.style.right = `0px`
    arrow.style.left = `unset`
    arrow.classList.remove('arrow-back')
    menu.scrollLeft -= difference + 15;
  } else {
    arrow.style.left = `${difference}px`
    menu.scrollLeft += difference + 15;
    arrow.classList.add('arrow-back')
  }
});