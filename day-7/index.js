const scene = document.querySelector('a-scene');
const pillows = [];
const pillowColors = ['#fff5c2', '#7ea1d9', '#5277bb', '#ffcefb', '#d7f8ff', '#fcf8ec', '#ead2f4'];

function addPillow() {
  let pillow = document.createElement('a-obj-model');
  
  pillow.setAttribute('stay-in-bounds', '');
  pillow.setAttribute('dynamic-body', {
    angularDamping: 0.005,
    linearDamping: 0.005,
    mass: .1
  });
  pillow.setAttribute('src', '#pillow-obj');
  pillow.setAttribute('scale', '.5 .5 .5');
  pillow.setAttribute('material', {
    color: pillowColors[Math.floor(Math.random() * pillowColors.length)]
  });
  pillow.setAttribute('position', `${Math.random() * 40 - 20} ${Math.random() * 30 + 1} ${Math.random() * 40 - 20}`);
  
  scene.appendChild(pillow);
  pillows.push(pillow);
}

for (let i = 0; i < 30; i++) {
  addPillow();
}