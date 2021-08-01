const schedule = require('node-schedule');
const Game = require('../models/GameModel.js')
const Player = require('../models/PlayerModel.js')
const actionFunctions = require('../controllers/ActionController.js')

let cronString = '0 * * * *';

if (process.env.INTERVAL_MODE) {
    if (process.env.INTERVAL_MODE === 'minute') {
        cronString = '0 * * * * *';
    }
}

schedule.scheduleJob(cronString, async function() {
    // Get all started games
    const allGames = await Game.find({ hasStarted: true });

    // Distribute actions
    console.log("Actions distributed! - " + new Date());
    allGames.forEach(await distributeActions);

    // Get all games on an action queue
    const queuedGames = allGames.filter(game => game.doActionQueue);
    queuedGames.forEach(await doActionQueue);
});

async function distributeActions(game) {
    if (game.turnTimePassed >= game.turnTime) {
        game.turnTimePassed = 1;

        const allPlayers = await Player.find({ game_id: game._id });

        allPlayers.map(async player => {
            player.actions += game.actionsPerInterval;
            await player.save()
        })
    } else {
        game.turnTimePassed++;
    }

    await game.save();
}

async function doActionQueue(game) {
    const actions = game.actions;
    const players = await Player.find({ game_id: game._id });

    const ACTIONS_ORDER = ['give', 'attack', 'move', 'upgrade']

    const sortedActions = []

    ACTIONS_ORDER.forEach(actionName => {
        sortedActions.push(...actions.filter(action => action.action === actionName))
    })

    for (const action in sortedActions) {
        const player = findPlayer(players, action.player_id);

        await actionFunctions[action.action](game, player, action)
    }
}

function findPlayer(playerList, id) {
    return playerList.find(player => player.id === id)[0];
}