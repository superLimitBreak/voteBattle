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
            port: 9873,
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
                in_time: 600,
                out_time: 200,
            }
        },
    },
    enviroment: {
        floor: {
            texture: 'rock_stones_0079_01_preview.jpg',
            size: 2000,
        },
    },
    characters: {
        'player1': {
            name: 'Axe Specalist',
            health: 100,
            min_damage: 14,
            max_damage: 35,
            heal: 10,
            defence_effectiveness: 6,
            specials: [],
            base_actions: base_actions,
            images: {
                'stand': 'char1.png',
                'attack': '',
                'defend': '',
                'charge': '',
                'hit': '',
                'hurt': '',
                'win': '',
                'dead': '',
                'at_ease': '',
            },
        },
        'player2': {
            name: 'Techno Mage',
            health: 80,
            min_damage: 6,
            max_damage: 30,
            heal: 20,
            defence_effectiveness: 4,
            base_actions: base_actions,
            images: {
                'stand': 'char3.png',
            },
        },
        'player3': {
            name: 'Bard Ninja',
            health: 120,
            min_damage: 12,
            max_damage: 24,
            heal: 40,
            defence_effectiveness: 5,
            specials: [],
            base_actions: base_actions,
            images: {
                'stand': 'char2.png',
            },
        },
        'player4': {
            name: 'Batton Gorilla',
            health: 140,
            min_damage: 18,
            max_damage: 18,
            heal: 10,
            defence_effectiveness: 8,
            specials: [],
            base_actions: base_actions,
            images: {
                'stand': 'char4.png',
            },
        },
        'boss': {
            name: 'Nyan Cat',
            health: 320,
            max_damage: 50,
            min_damage: 30,
            specials: ['all'],
            ai_actions: ['attack','attack','attack','charge','charge','all',
                         'attack','attack','attack','charge','charge','all',
                         'super', 'all', 'all', 'all', 'all', 'all'],
            base_actions: ['attack', 'charge'],
            images: {
                'stand': 'nyan_cat.gif',
                'charge': 'nyan_cat.charge.gif',
            },
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