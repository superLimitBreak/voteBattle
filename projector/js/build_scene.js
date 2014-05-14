(function(external, graphics){

var scene = graphics.scene;

function build_scene() {
    
    console.log("build_scene");
    
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
        console.log(filename);
        var object = new THREE.CSS3DObject( build_character({image:filename}) );
        object.position.x = 200 - (200*i);
        object.position.y = 0;
        object.position.z = 1000 - (200*i);
        scene.add(object);
    }
}

// Init ------------------------------------------------------------------------
build_scene();

// Export ----------------------------------------------------------------------


}(null, graphics));