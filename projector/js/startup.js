(function(external, graphics){

// Variables -------------------------------------------------------------------

var scene = graphics.scene;


// Setup Players ---------------------------------------------------------------

function setup_players() {
    $.each(data.players ,function(i, player){
        player = state.characters[player] || {id:player};
        state.characters[player.id] = player;
        player.data = data.characters[player.id];
        
        // Create 3D dom object for this player
        player.dom = document.createElement('img');
        //player.dom.style.width = '200px';
        //player.dom.style.height = '300px';
        player.CSS3DObject = new THREE.CSS3DObject( player.dom );
        
        // Methods
        player.set_pose = function(pose) {
            player.dom.src = data.settings.path.images.characters + player.data.images[pose] + '.png';
        };
        
        // Set Variables
        player.health = player.data.health;
        player.set_pose('stand');
    });
}


// Build 3D Scene --------------------------------------------------------------

function build_scene() {
    console.log("build_scene");
    
    $.each(data.players ,function(i, player){
        player = state.characters[player];
        player.CSS3DObject.position.x = 200 - (200*i);
        player.CSS3DObject.position.y = 0;
        player.CSS3DObject.position.z = 1000 - (200*i);
        scene.add(player.CSS3DObject);
    });
}
// Init ------------------------------------------------------------------------
setup_players()
build_scene();

// Export ----------------------------------------------------------------------


}(null, graphics));