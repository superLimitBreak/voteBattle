battlescape = window.battlescape || {};

(function(external, battlescape){
// -----------------------------------------------------------------------------


function create_actor(id, team_name, actor_data) {
    var actor = {
        id: id,
        team_name: team_name,
    };
    var data = actor_data;
    var health = data.health;
    var charge = 0;
    var defending = false;
    
    // Create 3D dom object for this player
    actor.dom = document.createElement('img');
    //player.dom.style.width = '200px';
    //player.dom.style.height = '300px';
    actor.CSS3DObject = new THREE.CSS3DObject( actor.dom );
    
    // Methods
    actor.is_player = function() {return battlescape.data.players.indexOf(id) >= 0;}
    actor.is_hurt = function() {return (health/data.health) <= battlescape.data.settings.ui.health_low_threshold;}
    actor.is_dead = function() {return health <= 0;}    
    actor.set_pose = function(pose) {
        actor.dom.src = battlescape.data.settings.path.images.characters + data.images[pose];
    };
    actor.set_direction = function(direction) {
        if (direction != 0) {direction = Math.PI;}
        actor.CSS3DObject.rotation.y = direction;
    }
    actor.get_actions = function() {
        if (actor.is_dead()) {return [];}
        return ['attack', 'defend', 'heal'];  // Hard coded list for now, in future this could be dynamic
    };
    actor.get_charge    = function() {return charge;}
    actor.get_defending = function() {return defending;}
    actor.get_health    = function() {return health;}
    actor.get_data      = function() {return data;}  // Dont like this ... want to remove it inpreference to accessors
    
    actor.get_health_percent = function() {return health / data.health;}
    
    actor.action = function(action) {
        if (!(actor.get_actions().indexOf(action)>=0)) {console.warn(""+action+" is not a valid action at this time");}
        if (action == "attack") {
            defending = false;
            var damage = data.min_damage + parseInt(Math.random() * (data.max_damage - data.min_damage), 10);
            battlescape.ai.get_random_enemy(actor).take_damage(damage);
            return;
        }
        if (action == "heal") {
            defending = false;
            battlescape.ai.get_most_hurt(battlescape.ai.get_friends(actor)).heal(data.heal);
            return;
        }
        if (action == "defend") {
            defending = true;
            return;
        }
        if (action == "charge") {
            charge++;
            return;
        }
        console.warn("unknown action "+action);
    }
    
    function modify_health(damage) {
        health = health - damage;  // Update health
        if (health < 0) {health = 0;}  // Limit health
        if (health > data.health) {health = data.health;}
        if (actor.is_dead()) {  // Update pose
            actor.set_pose('dead');
        }
        battlescape.ui.update();  // Update ui
    }
    
    actor.take_damage = function(value) {
        if (defending && value > 0) {
            value = Math.round(value / data.defence_effectiveness);
        }
        modify_health(value);
        battlescape.ui.set_message(""+data.name+" takes "+value+" damage");
    }
    actor.heal = function(value) {
        modify_health(-value);
        battlescape.ui.set_message(""+data.name+" healed "+value);
    }
    
    // Set Variables
    actor.set_pose('stand');

    return actor;
};

function create_game(players, enemys, turn_order) {
    var game = {};
    
    var current_turn_index = 0;
    var actors = {};

    function init_team(id_list, team_name) {
        $.each(id_list ,function(i, id){
            actors[id] = create_actor(id, team_name, battlescape.data.characters[id]);
        });
    }
    init_team(players, 'player');
    init_team(enemys, 'enemy');

    game.get_actors = function() {return actors;};
    game.get_team = function(team_name, inverse) {
        console.log("get_team", team_name, inverse);
        if (!team_name) {return [];}
        return $.grep(battlescape.utils.values(actors), function(actor){return actor.team_name == team_name;}, inverse);
    }
    game.get_current_turn_actor =  function() {
        return actors[turn_order[current_turn_index]];
    }

    game.next_turn = function() {
        current_turn_index = (current_turn_index + 1) % turn_order.length;
        battlescape.ui.update();
        
        var actor = game.get_current_turn_actor();
        if (actor.is_dead()) {
            game.next_turn();
        }
        if (!actor.is_player()) {
            battlescape.ai.take_action(actor);
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