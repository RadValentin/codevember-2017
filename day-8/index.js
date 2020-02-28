let scene, camera, renderer, controls;

function getAspectRatio() {
  const {innerWidth, innerHeight} = window;
  return innerWidth / innerHeight;
}

function onResize() {
  camera.aspect = getAspectRatio();
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, getAspectRatio(), 0.1, 1000);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x222222);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.autoRotate = true;

  const ambientLight = new THREE.AmbientLight( 0xffffff, .5 );
  scene.add(ambientLight);
  
  const lights = [
    new THREE.SpotLight(0x2363D0, 2, 0),
    new THREE.SpotLight(0xCC3F4A, .6, 0),
    new THREE.SpotLight(0x5342A0, 1, 0),
  ];
  
  lights[0].position.set(2, 1, 1);
  lights[1].position.set(-2, -1, -1);
  lights[2].position.set(-1, 1, 3);
  
  lights.forEach(light => {
    scene.add(light)
    //scene.add(new THREE.SpotLightHelper(light))
  });
  
  return new Promise((resolve, reject) => {
    const loader = new THREE.GLTFLoader();
    loader.crossOrigin = '';
    
    loader.load('./assets/scene.gltf', gltf => {
      scene.add(gltf.scene);
      window.addEventListener('resize', onResize);
      resolve();
    }, undefined, reject);
  });
}

function render() {
  controls.update();
  
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

init().then(render);