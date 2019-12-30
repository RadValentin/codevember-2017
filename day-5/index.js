const scene = document.querySelector('a-scene');

scene.addEventListener('loaded', function () {
  for (let i = 0; i < 50; i++) {
    let sword = document.createElement('a-collada-model');
    sword.setAttribute('src', '#sword-dae');
    sword.setAttribute('scale', '0.2 0.2 0.2');
    sword.setAttribute('position', `${Math.random() * 40 - 20} 1.481 ${(Math.random() * -20) - 3}`);
    sword.setAttribute('rotation', `${Math.random() * 30 - 90} ${Math.random() * 30} ${Math.random() * 30}`);
    sword.setAttribute('shadow', '');
    scene.appendChild(sword);
  }
});