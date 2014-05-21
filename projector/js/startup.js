(function(external, graphics, battlescape){

// Variables -------------------------------------------------------------------

var scene = graphics.scene;



// Setup Players ---------------------------------------------------------------



// Build 3D Scene --------------------------------------------------------------

function build_scene() {
    console.log("build_scene");
    
    $.each(battlescape.data.players ,function(i, player_id){
        var actor = battlescape.game.game.get_actors()[player_id];
        actor.CSS3DObject.position.x = 200 - (200*i);
        actor.CSS3DObject.position.y = 0;
        actor.CSS3DObject.position.z = 1000 - (200*i);
        scene.add(actor.CSS3DObject);
    });
}
// Init ------------------------------------------------------------------------
//setup_actors();
build_scene();

// Export ----------------------------------------------------------------------


}(null, graphics, battlescape));