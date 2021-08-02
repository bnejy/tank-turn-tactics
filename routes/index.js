const router = require('express').Router()
const { isLoggedIn, isAdmin } = require('../middlewares/auth_middleware.js')
const Game = require('../models/GameModel.js')
const Player = require('../models/PlayerModel.js')

// Pages
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('pages/index', { user: req.user.email })
    } else {
        res.redirect('/login')
    }
})

router.get('/register', (req, res) => {
    res.render('pages/register')
})

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    res.render('pages/login', { message: req.message ? res.message : '' })
})

// Join/create
router.get('/create-game', isLoggedIn, (req, res) => {
    res.render('pages/game/create', { name: req.user.email } )
})

router.get('/join/:gameId?', isLoggedIn, (req, res, next) => {
    const { gameId } = req.params;

    res.render('pages/game/join', {
        gameName: "",
        name: req.user.email,
        usePassphrase: "",
        game_id: gameId ?? ''
    })
})

// Play
router.get('/play', isLoggedIn, async (req, res) => {
    const gameId = req.query.game

    const game = await Game.findById(gameId).lean();
    game.players = await Player.find({ game_id: game._id });
    game.user_id = req.user.id;

    if (game.hasStarted) {
        res.render('pages/game/game', { game: game })
    } else {
        res.render('pages/game/lobby', { isCreator: game.creator_id.equals(req.user.id), gameName: game.name })
    }
})

// Admin
router.get('/admin', isAdmin, async (req, res) => {
    res.render("pages/admin")
})

module.exports = (app) => {
    app.use('/', router)
    app.use('/auth', require('./auth_router.js'))
    app.use('/user', require('./user_router.js'))
    app.use('/game', require('./game_router.js'))
    app.use('/action', require('./action_router.js'))
}