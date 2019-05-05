const scene = document.querySelector('a-scene');
const diamonds = [];

for (let i = 0; i < 30; i++) {
  const diamondSize = Math.random() * .02 + .01;
  const xRotation = Math.random() * 45;
  const zRotation = Math.random() * 45;
  const diamond = document.createElement('a-entity');
  diamond.setAttribute('obj-model', 'obj:#diamond-obj');
  diamond.setAttribute('scale', {x: diamondSize, y: diamondSize, z: diamondSize});
  diamond.setAttribute('shadow', '')
  diamond.setAttribute('material', {
    sphericalEnvMap: '#underwater-texture',
    roughness: 0,
    metalness: .8
  });

  const animation = document.createElement('a-animation');
  animation.setAttribute('attribute', 'rotation');
  animation.setAttribute('from', `${xRotation} 0 ${zRotation}`);
  animation.setAttribute('to', `${xRotation} 360 ${zRotation}`);
  animation.setAttribute('dur', Math.random() * 5000 + 5000);
  animation.setAttribute('easing', 'linear');
  animation.setAttribute('repeat', 'indefinite');

  diamond.appendChild(animation);
  scene.appendChild(diamond);

  diamonds.push(diamond);
}

function getRandomPositon() {
  return {
    x: Math.random() * 4 - 2, 
    y: Math.random() * 2 + 4,
    z: Math.random() * -2 - 1
  }
}

function render() {
  diamonds.forEach(diamond => {
    if (!diamond.getAttribute('position')) {
      diamond.setAttribute('data-velocity', Math.random() * .05);
      diamond.setAttribute('position', getRandomPositon());
    } else {
      const {x, y, z} = diamond.getAttribute('position');
      const velocity = parseFloat(diamond.getAttribute('data-velocity'));
      
      if (y < -3) {
        diamond.setAttribute('position', getRandomPositon());
      } else {
        diamond.setAttribute('position', {x, y: y - velocity, z})
      }
    }
  });
  
  requestAnimationFrame(render);
}

render();