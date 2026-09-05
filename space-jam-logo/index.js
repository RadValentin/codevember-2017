const jam = document.querySelector('.space-jam');
const video = document.querySelector('#video');

jam.addEventListener('click', () => {
  const url = new URL(video.src);
  url.searchParams.set('autoplay', '1');
  video.src = url;
});

