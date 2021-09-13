const express = require('express');
const User = require('../core/user');
const router = express.Router();
const moment = require('moment');
const Formation = require('../core/formation');
const Support = require('../core/support');
const support = new Support()
var formation = new Formation()

// create an object from the class User in the file core/user.js
const user = new User();





//GET
// Get the index page
router.get('/', (req, res, next) => {
    res.render('index.ejs');
})

router.get('/login', (req, res, next) => {
    if (req.session.user) {
        res.redirect('/panel');
        return;
    }
    res.render('login.ejs')
});

router.get('/register', (req, res, next) => {

    if (req.session.user) {
        res.redirect('/panel');
        return;
    }
    res.render('register.ejs')
});

// Get loggout page
router.get('/loggout', (req, res, next) => {
    // Check if the session is exist
    if (req.session.user) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});


router.get('/panel/*', (req, res, next) => {
    if (req.session.user) {
        //update user data
        user.find(req.session.user.id, function(user) {
            req.session.user = user
            next()
        })
    } else {
        res.redirect('/login?target=' + req.path)
    }
})



router.get('/panel', (req, res, next) => {
    let user = req.session.user;

    if (user) {
        res.redirect('/panel/home')
        return;
    }
    res.redirect('/');
});

// Get home page
router.get('/panel/home', (req, res, next) => {
    let user = req.session.user;
    res.render('home', { opp: req.session.opp, user: user });

});

// Get compte info
router.get('/panel/compte', (req, res, next) => {
    let user = req.session.user;
    if (user.DiscordID) {
        bot.users.fetch(user.DiscordID).then(duser => {
            res.render('compte', { opp: req.session.opp, user: user, discordusername: duser.tag });
        })
    } else {
        res.render('compte', { opp: req.session.opp, user: user });
    }
});


router.get('/panel/admin/*', (req, res, next) => {
    let user = req.session.user;
    if (user.Admin == 1) {
        next()
    } else {
        res.redirect('/panel')
    }
});

router.get('/panel/admin/comptes', async(req, res, next) => {
    let suser = req.session.user;

    user.getAll(function(result) {

        res.render('admincomptes.ejs', { opp: req.session.opp, user: suser, users: result })

    })

});
router.get('/panel/admin/support', async(req, res, next) => {
    let suser = req.session.user;

    var AllTicketList = await support.getAllTicketName()
    res.render('adminsupports.ejs', { opp: req.session.opp, user: suser, AllTicketList: AllTicketList })



});
router.get('/panel/admin/support/:id', async(req, res, next) => {
    let suser = req.session.user;
    var tickets = []
    var ticketget = await support.getAllTicketsByUserID(req.params.id)
    ticketof = (await bot.users.fetch(req.params.id)).tag
    await ticketget.tickets.forEach(async ticket => {

        ticket.index = ticketget.tickets.indexOf(ticket) + 1
        await ticket.messages.forEach(async msg => {
            var authoruser = (await bot.users.fetch(msg.authorid))
            ticket.messages[ticket.messages.indexOf(msg)].author = authoruser.username
            ticket.messages[ticket.messages.indexOf(msg)].authorimg = authoruser.avatarURL()
            if (ticket.messages[ticket.messages.indexOf(msg)].authorimg == undefined) {
                ticket.messages[ticket.messages.indexOf(msg)].authorimg = "red"
            }
        })
        tickets.unshift(ticket)
    });

    res.render('ticket.ejs', { opp: req.session.opp, user: suser, tickets: tickets, ticketof: ticketof })



});

router.get('/panel/formateur/*', (req, res, next) => {
    let user = req.session.user;
    if (user.Admin == 1 || user.Formateur == 1) {
        next()
    } else {
        res.redirect('/panel')
    }
});

router.get('/panel/formateur/list', (req, res, next) => {
    let suser = req.session.user;
    formation.getAll(suser.DiscordID, function(result) {
        res.render('formationlist.ejs', { user: suser, formations: result })
    })
});

router.get('/panel/formateur/create', (req, res, next) => {
    let suser = req.session.user;

    res.render('formationcreate.ejs', { user: suser })



});



























//POST

// Post login data
router.post('/login', (req, res, next) => {
    var data = JSON.parse(req.body)
        // The data sent from the user are stored in the req.body object.
        // call our login function and it will return the result(the user data).
    if (data.username == undefined || data.password == undefined) {
        res.send("Erreur, pas de pseudo ou/et de mot de passe !")
        console.log(req.body)
        return
    }
    user.login(data.username, data.password, function(result) {
        if (result) {
            // Store the user data in a session.
            req.session.user = result;
            req.session.opp = 1;

            res.send("Valid");
        } else {
            // if the login function returns null send this error message back to the user.
            res.send('Pseudo/Mot de passe incorrect!');
        }
    })

});


// Post register data
router.post('/register', (req, res, next) => {
    // prepare an object containing all user inputs.
    let userInput = {
        username: req.body.username,
        mail: req.body.mail,
        password: req.body.password
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    user.create(userInput, function(lastId) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if (lastId) {
            // Get the user data by it's id. and store it in a session.
            user.find(lastId, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/panel');
            });

        } else {
            console.log('Error creating a new user ...');
        }
    });

});


router.post('/account/BattleNetLink', (req, res, next) => {
    let requser = req.session.user;
    user.setBattleTag(requser.id, req.body.btg)

    res.send("Liaison avec Battle Net effectué.")

});

router.post('/account/Discord', (req, res, next) => {
    let requser = req.session.user;
    user.setDiscordID(requser.id, req.body.uuid, function(result) {
        res.send(result)
    })

});
router.post('/formation/create', (req, res, next) => {
    let requser = req.session.user;
    var data = JSON.parse(req.body)
    data.ADiscordID = requser.DiscordID
    formation.create(data)
});

router.post('/formation/send', async(req, res, next) => {
    let requser = req.session.user;
    var data = JSON.parse(req.body)
    formation.sendInscription(data)
    res.send('Ok')

});

router.post('/formation/delete', async(req, res, next) => {
    let requser = req.session.user;
    var data = JSON.parse(req.body)
    formation.delete(data)
    res.send('Ok')

});






module.exports = router;