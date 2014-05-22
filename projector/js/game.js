battlescape = window.battlescape || {};

(function(external, battlescape){
// -----------------------------------------------------------------------------


function create_actor(id, actor_data) {
    var actor = {id:id};
    actor.data = actor_data;
    
    // Create 3D dom object for this player
    actor.dom = document.createElement('img');
    //player.dom.style.width = '200px';
    //player.dom.style.height = '300px';
    actor.CSS3DObject = new THREE.CSS3DObject( actor.dom );
    
    // Methods
    actor.is_player = function() {return battlescape.data.players.indexOf(id) >= 0;}
    actor.is_hurt = function() {return (actor.health/actor.data.health) <= battlescape.data.settings.ui.health_low_threshold;}
    actor.is_dead = function() {return actor.health <= 0;}    
    actor.set_pose = function(pose) {
        actor.dom.src = battlescape.data.settings.path.images.characters + actor.data.images[pose];
    };
    actor.set_direction = function(direction) {
        if (direction != 0) {direction = Math.PI;}
        actor.CSS3DObject.rotation.y = direction;
    }
    actor.get_actions = function() {
        if (actor.is_dead()) {return [];}
        return ['attack', 'defend', 'heal'];  // Hard coded list for now, in future this could be dynamic
    };
    
    actor.action = function(action) {
        if (!(actor.get_actions().indexOf(action)>=0)) {console.warn(""+action+" is not a valid action at this time");}
        if (action == "attack") {
            actor.defending = false;
            var damage = actor.data.min_damage + parseInt(Math.random() * (actor.data.max_damage - actor.data.min_damage), 10);
            battlescape.ai.get_enemy(actor).take_damage(damage);
            return;
        }
        if (action == "heal") {
            actor.defending = false;
            battlescape.ai.get_friend(actor).take_damage(actor.data.heal);
            return;
        }
        if (action == "defend") {
            actor.defending = true;
            return;
        }
        console.warn("unknown action "+action);
    }
    actor.take_damage = function(damage) {
        if (actor.defending && damage > 0) {
            damage = Math.round(damage / 10);
        }
        actor.health = actor.health - damage;
        if (actor.is_dead()) {
            actor.set_pose('dead');
        }
    }
    
    // Set Variables
    actor.health = actor.data.health;
    actor.set_pose('stand');

    return actor;
};

function create_game(players, enemys, turn_order) {
    var game = {};
    
    var current_turn_index = 0;
    var actors = {};


    $.each(players.concat(enemys) ,function(i, id){
        actors[id] = create_actor(id, battlescape.data.characters[id]);
    });

    game.get_actors = function() {
        return actors;
    }
    game.get_current_turn_actor =  function() {
        return actors[turn_order[current_turn_index]];
    }

    game.next_turn = function() {
        current_turn_index = (current_turn_index + 1) % turn_order.length;
        battlescape.ui.update();
        
        if (!game.get_current_turn_actor().is_player()) {
            battlescape.ai.take_action();
        }
    }

    
    return game;
}

// Init ------------------------------------------------------------------------
// External --------------------------------------------------------------------

external.game = create_game(
    battlescape.data.players,
    battlescape.data.enemys,
    battlescape.data.turn_order
);





}(battlescape, battlescape));