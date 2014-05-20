battlescape.game = {};

(function(external, battlescape){
// -----------------------------------------------------------------------------


function create_actor(id, actor_data) {
    var actor = battlescape.state.actors[id] || {id:id};
    battlescape.state.actors[actor.id] = actor;
    actor.data = actor_data;
    
    // Create 3D dom object for this player
    actor.dom = document.createElement('img');
    //player.dom.style.width = '200px';
    //player.dom.style.height = '300px';
    actor.CSS3DObject = new THREE.CSS3DObject( actor.dom );
    
    // Methods
    
    actor.is_hurt = function() {return (actor.health/actor.data.health) <= battlescape.data.settings.ui.health_low_threshold;}
    actor.is_dead = function() {return actor.health <= 0;}    
    actor.set_pose = function(pose) {
        actor.dom.src = battlescape.data.settings.path.images.characters + actor.data.images[pose] + '.png';
    };
    actor.get_actions = function() {
        if (actor.is_dead()) {return [];}
        return ['attack', 'defend', 'heal'];  // Hard coded list for now, in future this could be dynamic
    };
    
    // Set Variables
    actor.health = actor.data.health;
    actor.set_pose('stand');
    
    // TEMP HACK!!!
    if (id == 'player2') {battlescape.state.active_actor = actor;}
    
    return actor;
};



function perform_action(actor, action) {
    
}

function next() {
    
}

// Init ------------------------------------------------------------------------


// External --------------------------------------------------------------------
external.create_actor = create_actor;

}(battlescape.game, battlescape));