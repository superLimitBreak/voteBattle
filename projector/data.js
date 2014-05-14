var global = {};
var state = {
    characters: {
        'player1': {
            health:50,
        },
        'player2': {
            health:10,
        },
        'player3': {
            health:0,
        },
        'player4': {
            health:50,
        },
    }
};
var data = {
    characters: {
        'player1': {
            name: 'Axe Specalist',
            health: 100,
            min_damage: 15,
            max_damage: 35,
            heal: 10,
            specials: [],
            images: {
                'stand': 'char1',
                'attack': '',
                'defend': '',
                'charge': '',
                'hit': '',
                'hurt': '',
                'win': '',
            },
        },
        'player2': {
            name: 'Techno Mage',
            health: 80,
            min_damage: 6,
            max_damage: 30,
            heal: 30,
            images: {
                'stand': 'char3',
            },
        },
        'player3': {
            name: 'Monk',
            health: 120,
            min_damage: 8,
            max_damage: 22,
            heal: 50,
            specials: [],
            images: {
                'stand': 'char2',
            },
        },
        'player4': {
            name: 'Batton Gorilla',
            health: 140,
            min_damage: 20,
            max_damage: 20,
            heal: 40,
            specials: [],
            images: {
                'stand': 'char4',
            },
        },
        'boss': {
            name: 'Nyan Cat',
            health: 500,
            max_damamage: 50,
            min_damage: 30,
            specials: ['all'],
        }
    },
    players: ['player1', 'player2', 'player3', 'player4'],
    enemys: ['boss'],
    turn_order: ['player1', 'player2', 'boss' ,'player3', 'player4', 'boss'],
}