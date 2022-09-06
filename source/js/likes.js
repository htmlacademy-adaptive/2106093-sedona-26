let heart = document.querySelector('.card__like-icon');
let likesNumber = document.querySelector('.card__like-quantity');
let counter = likesNumber.textContent;

heart.onclick = function () {
  if (heart.classList.contains('added')) {
    counter--;
  } else {
    counter++;
  }
  likesNumber.textContent = counter;
  heart.classList.toggle('card__like-icon--added');
};
