(function(external, graphics){

// Variables -------------------------------------------------------------------

var scene = graphics.scene;

function create_actor(id, actor_data) {
    var actor = state.actors[id] || {id:id};
    state.actors[actor.id] = actor;
    actor.data = actor_data;
    
    // Create 3D dom object for this player
    actor.dom = document.createElement('img');
    //player.dom.style.width = '200px';
    //player.dom.style.height = '300px';
    actor.CSS3DObject = new THREE.CSS3DObject( actor.dom );
    
    // Methods
    
    actor.is_hurt = function() {return (actor.health/actor.data.health) <= data.settings.ui.health_low_threshold;}
    actor.is_dead = function() {return actor.health <= 0;}    
    actor.set_pose = function(pose) {
        actor.dom.src = data.settings.path.images.characters + actor.data.images[pose] + '.png';
    };
    actor.get_actions = function() {
        if (actor.is_dead()) {return [];}
        return ['attack', 'defend', 'heal'];  // Hard coded list for now, in future this could be dynamic
    };
    
    // Set Variables
    actor.health = actor.data.health;
    actor.set_pose('stand');
    
    // TEMP HACK!!!
    if (id == 'player2') {state.active_actor = actor;}
    
    return actor;
};


// Setup Players ---------------------------------------------------------------

function setup_actors() {
    $.each(data.players ,function(i, player_id){
        state.actors[player_id] = create_actor(player_id, data.characters[player_id]);
    });
}


// Build 3D Scene --------------------------------------------------------------

function build_scene() {
    console.log("build_scene");
    
    $.each(data.players ,function(i, player_id){
        var actor = state.actors[player_id];
        actor.CSS3DObject.position.x = 200 - (200*i);
        actor.CSS3DObject.position.y = 0;
        actor.CSS3DObject.position.z = 1000 - (200*i);
        scene.add(actor.CSS3DObject);
    });
}
// Init ------------------------------------------------------------------------
setup_actors()
build_scene();

// Export ----------------------------------------------------------------------


}(null, graphics));