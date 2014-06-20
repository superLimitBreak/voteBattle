var battlescape = window.battlescape || {};

(function(external){

var base_actions = ['attack', 'defend', 'heal'];

var data = {
    settings: {
        game: {
            turn: {
                player_duration: 6,
                enemy_duration: 6,
                enemy_think_duration: 3,
            }
        },
        websocket: {
            port: 9883,
            disconnected_retry_interval: 5,
        },
        path: {
            images: {
                characters: 'images/characters/',
            },
        },
        ui: {
            health_low_threshold: 0.25,
        },
        vote: {
            pool: 'battlescape',
        },
        animation: {
            attack: {
                in_time: 900,
                out_time: 400,
            },
            hit: {
                delay: 1800,
            }
        },
    },
    enviroment: {
        floor: {
            texture: 'rock_stones_0079_01_preview.jpg',
            size: 2000,
        },
    },
    default_messages: {
        charge: 'MY_NAME is charging',
        defend: 'MY_NAME is defending himself',
    },
    characters: {
        'player1': {
            name: 'Axe Specalist',
            health: 100,
            min_damage: 14,
            max_damage: 35,
            heal: 20,
            defence_effectiveness: 10,
            specials: [],
            base_actions: base_actions,
            height: 300,
            images: {
                //'stand': 'char1.png',
                'stand': 'lyle_stand.png',
                'attack': 'lyle_attack.png',
                'defend': 'lyle_defend.png',
                'hit': 'lyle_hit.png',
                'hurt': 'lyle_hurt.png',
                'dead': 'lyle_dead.png',
                'win': 'lyle_win.png',
                'at_ease': 'lyle_at_ease.png',
            },
        },
        'player2': {
            name: 'Techno Mage',
            health: 90,
            min_damage: 6,
            max_damage: 30,
            heal: 30,
            defence_effectiveness: 10,
            base_actions: base_actions,
            height: 300,
            images: {
                //'stand': 'char3.png',
                'stand': 'allan_stand.png',
                'attack': 'allan_attack.png',
                'defend': 'allan_defend.png',
                'charge': '',
                'hit': 'allan_hit.png',
                'hurt': 'allan_hurt.png',
                'dead': 'allan_dead.png',
                'win': 'allan_win.png',
                'at_ease': 'allan_at_ease.png',
            },
        },
        'player3': {
            name: 'Bard Ninja',
            health: 120,
            min_damage: 12,
            max_damage: 24,
            heal: 40,
            defence_effectiveness: 10,
            specials: [],
            base_actions: base_actions,
            height: 300,
            images: {
                'stand': 'char2.png',
                /*
                'stand': 'matt_stand.png',
                'attack': 'matt_attack.png',
                'defend': 'matt_defend.png',
                'hit': 'matt_hit.png',
                'hurt': 'matt_hurt.png',
                'dead': 'matt_dead.png',
                'win': 'matt_win.png',
                'at_ease': 'matt_at_ease.png',
                */

            },
        },
        'player4': {
            name: 'Batton Gorilla',
            health: 140,
            min_damage: 18,
            max_damage: 18,
            heal: 20,
            defence_effectiveness: 10,
            specials: [],
            base_actions: base_actions,
            height: 300,
            images: {
                'stand': 'char4.png',
                /*
                'stand': 'joe_stand.png',
                'attack': 'joe_attack.png',
                'defend': 'joe_defend.png',
                'hit': 'joe_hit.png',
                'hurt': 'joe_hurt.png',
                'dead': 'joe_dead.png',
                'win': 'joe_win.png',
                'at_ease': 'joe_at_ease.png',
                */
            },
        },
        'boss': {
            name: 'Nyan Cat',
            health: 350,
            max_damage: 40,
            min_damage: 30,
            all_damage: 65,
            specials: ['all'],
            ai_actions: ['attack','attack','attack','charge','charge','all',
                         'attack','attack','attack','charge','charge','all',
                         'attack','super', 'all', 'all', 'all', 'all', 'all'],
            base_actions: ['attack', 'charge'],
            height: 500,
            images: {
                'stand' : 'nyan_cat.gif',
                'charge': 'nyan_cat.charge.gif',
            },
            messages: {
                'charge': 'MY_NAME looks angry',
            },
            HACK_hit_offset: 600
        }
    },
    players: ['player1', 'player2', 'player3', 'player4'],
    enemys: ['boss'],
    turn_order: ['player1', 'player2', 'boss' ,'player3', 'player4', 'boss'],
}


// Init ------------------------------------------------------------------------


// External --------------------------------------------------------------------
external.data = data;

}(battlescape));