let jam = document.querySelector('.space-jam');
let video = document.querySelector('#video');

jam.addEventListener('click', e => {
  video.src += "&autoplay=1"
});
