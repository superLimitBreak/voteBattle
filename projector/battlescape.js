// Constats
var DRAW_DISTANCE = 5000;

// Variables
var camera, scene, renderer, controls;

var characters = [];
var enemys = [];



// Startup
init();
animate();


function render() {renderer.render( scene, camera );}

function init() {
    // Camera
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, DRAW_DISTANCE);
    camera.position.z = 2000;
    camera.position.y = 0;

    // Scene
    scene = new THREE.Scene();
    
    // Renderer
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    // DOM Addition
    document.body.appendChild( renderer.domElement );    
    // Events
    window.addEventListener('resize', onWindowResize, false);

    //controls = new THREE.OrbitControls( camera );
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 0.3;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener( 'change', function(){} );
    
    init_scene();
}



function animate() {
    requestAnimationFrame(animate);
    
    TWEEN.update();
    render();
    
    controls.update();
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
    render()
}

// -----------------------------------------------------------------------------

function init_scene() {
    var build_character = function(data) {
        var dom = document.createElement( 'div' );
        var dom_image = document.createElement('img');
        dom_image.style.width = '200px';
        dom_image.style.height = '300px';
        dom_image.src = data.image;
        dom.appendChild(dom_image);
        return dom;
    }

    var character_filenames = ['char1.png', 'char2.png', 'char3.png', 'char4.png'];
    for (var i in character_filenames) {
        var filename = "images/characters/"+character_filenames[i];
        var object = new THREE.CSS3DObject( build_character({image:filename}) );
        object.position.x = 200 - (200*i);
        object.position.y = 0;
        object.position.z = 1000 - (200*i);
        scene.add(object);
    }
}

