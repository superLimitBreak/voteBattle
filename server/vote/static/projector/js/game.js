battlescape = window.battlescape || {};

(function(external, battlescape){
// -----------------------------------------------------------------------------

DEFAULT_POSE = 'stand';

function message_generator(message_type, actor) {
    var message = '';
    if (actor && _.has(actor.get_data(), 'messages')) {
        message = actor.get_data().messages[message_type];
    }
    if (!message) {
        message = battlescape.data.default_messages[message_type];
    }
    if (!message) {
        console.warn('unable to generate base message for '+message_type)
    }
    message = message
        .replace('MY_NAME', actor.get_data().name);
    return message;
}
function ui_message(message_type, actor) {
    battlescape.ui.set_message(message_generator(message_type, actor));
}

function create_actor(id, team_name, actor_data) {
    var actor = {
        id: id,
        team_name: team_name,
    };
    var data = actor_data;
    var health = data.health;
    var charge = 0;
    var defending = false;
    var current_pose = '';
    
    // Create 3D dom object for this player
    var css_class = '';
    var dom = document.createElement('img');
    dom.style['z-index'] = 1;
    if (data.height) {
        dom.style.height = ''+data.height+'px';
    }
    actor.CSS3DObject = new THREE.CSS3DObject( dom );
    //player.dom.style.width = '200px';
    //player.dom.style.height = '300px';
    
    
    // Methods
    actor.is_player = function() {return battlescape.data.players.indexOf(id) >= 0;}
    actor.is_hurt = function() {return (health/data.health) <= battlescape.data.settings.ui.health_low_threshold;}
    actor.is_dead = function() {return health <= 0;}    

    actor.get_actions = function() {
        if (actor.is_dead()) {return [];}
        var actions = _.clone(data.base_actions);
        if (charge >= 1 && _.contains(data.specials, 'all')) {
            actions.push('all');
        }
        return actions;
    };
    actor.get_charge    = function() {return charge;}
    actor.get_defending = function() {return defending;}
    actor.get_health    = function() {return health;}
    actor.get_data      = function() {return data;}  // Dont like this ... want to remove it inpreference to accessors
    
    actor.get_health_percent = function() {return health / data.health;}
    
    actor.action = function(action) {
        console.log("action", action);
        if (!(actor.get_actions().indexOf(action)>=0)) {console.warn(""+action+" is not a valid action at this time");}
        cancel_existing_action();
        if (action == "attack") {
            var enemy = battlescape.ai.get_random_enemy(actor);
            var damage = get_attack_damage();
            damage = enemy.take_damage(damage);
            animate_move(enemy, 'attack');
            battlescape.ui.set_message(""+data.name+" does "+damage+" damage to "+enemy.get_data().name);
            return;
        }
        if (action == "heal") {
            var hurt_friend = battlescape.ai.get_most_hurt(battlescape.ai.get_friends(actor));
            var value = hurt_friend.heal(data.heal);
            battlescape.ui.set_message(""+data.name+" healed "+hurt_friend.get_data().name+" "+value);
            animate_move(hurt_friend, 'win');
            return;
        }
        if (action == "defend") {
            defending = true;
            set_pose_to_current_state();
            ui_message('defend', actor);
            return;
        }
        if (action == "charge") {
            charge++;
            ui_message('charge', actor);
            set_pose_to_current_state();
            return;
        }
        if (action == "all") {
            charge = 0;
            var total = 0;
            _.each(battlescape.ai.get_enemys(actor), function(enemy, index, enemys) {
                total += enemy.take_damage(actor.get_data().max_damage);
            });
            battlescape.effects.raninbow_beam();
            battlescape.ui.set_message("" + data.name+" used RAINBOW BEAM! collectivly doing "+total+" damage");
            set_pose_to_current_state();
            return;
        }
        if (action == "super") {
            battlescape.ui.set_message("" + data.name + " is not in the mood to play anymore");
            return;
        }
        if (action == "confused") {
            battlescape.ui.set_message("" + data.name + " is confused");
            set_pose_to_current_state();
            return;
        }
        
        console.warn("unknown action "+action);
    }

    
    function cancel_existing_action() {
        defending = false;
    }
    
    function get_attack_damage() {
        var damage = _.random(data.min_damage, data.max_damage);
        if (charge) {
            damage = damage * charge * 2.7;
        }
        return damage;
    }
    
    function modify_health(damage) {
        var initial_heath = health;
        health = health - damage;  // Update health
        if (health < 0) {health = 0;}  // Limit health
        if (health > data.health) {health = data.health;}
        if (damage > 0 && health > 0 && !charge) {
            set_pose('hit');
            setTimeout(set_pose_to_current_state, battlescape.data.settings.animation.hit.delay);
        }
        else {
            set_pose_to_current_state(); // Update pose and health feedback
        }
        battlescape.ui.update();  // Update ui
        return initial_heath - health;
    }
    
    actor.take_damage = function(value) {
        if (defending && value > 0) {
            value = Math.round(value / data.defence_effectiveness);
        }
        return modify_health(value);
    }
    actor.heal = function(value) {
        var health_before = health
        modify_health(-value);
        return health - health_before;
    }
    
    function set_pose_to_current_state() {
        // Set default state
        var target_pose = DEFAULT_POSE;
        var target_class = '';
        
        // Set apply state pose's and effects
        if (actor.is_hurt()) {
            target_pose = 'hurt';
            target_class = 'hurt';
        }
        if (defending) {
            target_pose = 'defend';
        }
        if (charge > 0) {
            target_pose = 'charge';
        }
        if (actor.is_dead()) {
            target_pose = 'dead';
            target_class = 'dead';
        }
        set_pose(target_pose);
        if (target_class) {set_class(target_class);}
        else              {dom.className = '';} // if there is no target class it can be applyed immediately
    }

    function set_class(new_css_class) {
        if (new_css_class) {
            css_class = new_css_class;
        }
        setTimeout(function() {dom.className = css_class;}, 15);
    }
    actor.set_class = set_class;
    
    function _set_pose(pose) {
        current_pose = DEFAULT_POSE;
        var pose_image = data.images[DEFAULT_POSE];
        if (data.images[pose]) {
            pose_image = data.images[pose];
            current_pose = pose;
        }
        if (pose == 'dead' && !data.images['dead']) {
            current_pose = 'dead'
            dom.src = '';
            return
        }
        dom.src = battlescape.data.settings.path.images.characters + pose_image;
    }
    function set_pose(pose) {
        if (pose == current_pose) {return;}
        _set_pose(pose);
        //var class_name = dom.className
        dom.className = '';  // Always clear the css class on pose change as it takes time for the filters to stop
        set_class(); // Set the class back to the current value set for this actor
    };
    actor.set_pose = set_pose;
    
    actor.set_direction = function(direction) {
        if (direction != 0) {direction = Math.PI;}
        actor.CSS3DObject.rotation.y = direction;
    }
    
    
    function animate_move(target_actor, pose) {
        // http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        set_pose(pose);
        var original_position = _.clone(actor.CSS3DObject.position);
        
        // HACK!
        // Manually tamper with nyan cats target location
        // This needs to be replaced with a more generic method for targeting animations
        // Setting the y is a good idea and setting the
        var target_position = _.clone(target_actor.CSS3DObject.position);
        if (target_actor.get_data().HACK_hit_offset) {
            target_position.x += target_actor.get_data().HACK_hit_offset;
        }
        target_position.y = original_position.y; // Ensure attacker keeps feet on floor while attacking
        target_position.z += 20;  // Ensure the attacker is placed infront of target

        var tween = new TWEEN.Tween(actor.CSS3DObject.position)
                    .to(target_position, battlescape.data.settings.animation.attack.in_time)
                    .chain(
                        new TWEEN.Tween(actor.CSS3DObject.position)
                        .to(original_position, battlescape.data.settings.animation.attack.out_time)
                    )
                    .onComplete(
                        set_pose_to_current_state
                    );
        tween.easing(
            TWEEN.Easing.Elastic.InOut
            //TWEEN.Easing.Linear.None
        ).start()
    }
    
    // Set Variables
    set_pose_to_current_state()

    return actor;
};

function create_game(players, enemys, turn_order) {
    var game = {};
    
    var current_turn_index = -1;
    var actors = {};

    var running = false;
    
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
        if (!running) {return;}
        
        // Check end states
        if (game.players_all_dead()) {
            game.stop();
            battlescape.ui.set_message('Game Over: Nyan Cat had '+battlescape.get_game().get_actors().boss.get_health()+' health left');
            return;
        }
        if (game.enemy_all_dead()) {
            game.stop();
            battlescape.ui.set_message('Win: took '+current_turn_index+' turns');
            _.each(game.get_team('player'), function(actor, index, list) {
                if (!actor.is_dead()) {
                    actor.set_pose('win');
                }
            });
            return;
        }
        
        current_turn_index = (current_turn_index + 1) % turn_order.length;
        battlescape.ui.update();
        
        var actor = game.get_current_turn_actor();
        if (actor.is_dead()) {
            game.next_turn();
            return;
        }
        if (!actor.is_player()) {
            _.delay(function(){battlescape.ai.take_action(actor)}, battlescape.data.settings.game.turn.enemy_think_duration * 1000);
            _.delay(game.next_turn, battlescape.data.settings.game.turn.enemy_duration * 1000);
            return;
        }
        battlescape.vote.new_frame(actor.get_actions(), battlescape.data.settings.game.turn.player_duration);
    }

    game.stop = function() {
        running = false;
    }
    game.start = function() {
        running = true;
        game.next_turn();
    }
    
    game.players_all_dead = function() {
        return _.filter(game.get_team('player'), function(actor){return !actor.is_dead()}).length <= 0;
    }
    game.enemy_all_dead = function() {
        return _.filter(game.get_team('enemy'), function(actor){return !actor.is_dead()}).length <= 0;
    }
    
    return game;
}

var game;
function new_game() {
    if (game) {
        game.stop();
    }
    game = create_game(
        battlescape.data.players,
        battlescape.data.enemys,
        battlescape.data.turn_order
    );
    battlescape.build_scene();
    battlescape.cameras.new_camera('_into_pan_players');
    var player_ready_time = 2000;
    _.each(game.get_team('player'), function(actor, index, list) {
        actor.set_pose('at_ease');
        setTimeout(function(){actor.set_pose('win')}, player_ready_time);
        player_ready_time += 1000;
    });
    setTimeout(game.start, 6000);  // Allow 6 seconds for the intro pan before starting the combat
}

// Init ------------------------------------------------------------------------

//new_game();

// External --------------------------------------------------------------------

external.get_game = function(){return game || {}};
external.new_game = new_game;

}(battlescape, battlescape));