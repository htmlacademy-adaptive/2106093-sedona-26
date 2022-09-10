const mediaContainer = document.querySelector('.media');

if(mediaContainer) {
  mediaContainer.addEventListener('click', function(evt) {
    const button = evt.target.closest('.card__like-icon');
    if(button) {
      const likeNumber = button.nextElementSibling;
      let counter = likeNumber.textContent;
      if (button.classList.contains('card__like-icon--added')) {
        counter--;
      } else {
        counter++;
      }
      likeNumber.textContent = counter;
      button.classList.toggle('card__like-icon--added');
    }
  })
}
