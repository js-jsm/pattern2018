var express = require('express');
var router = express.Router();

// model
var users = [
    { "firstName": "지나", "lastName": "이" },
    { "firstName": "도형", "lastName": "안" },
    { "firstName": "성훈", "lastName": "백" },
    { "firstName": "재남", "lastName": "정" },
    { "firstName": "진호", "lastName": "현" },
    { "firstName": "병화", "lastName": "김" },
    { "firstName": "지은", "lastName": "이" },
    { "firstName": "정현", "lastName": "이" },
    { "firstName": "창규", "lastName": "이" },
    { "firstName": "원준", "lastName": "황" }
]

// controllers
router.get('/', function(req, res, next) {
   var UsersModel = users.map(function(user) { return Object.assign({}, user)})
   // view
   res.render('mvc', { title: 'MVC - Study Members', users: UsersModel });
});

router.post('/user', function(req, res, next) {
    users.push({ firstName: req.body.firstName, lastName: req.body.lastName })
    // view
   res.redirect(301, '/')
})

module.exports = router;
