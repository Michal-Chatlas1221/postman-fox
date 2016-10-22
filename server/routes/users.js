var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.post('/', (req, res) => {
    let user = new User();
    user.name = req.body.name;
    user.save(err => {
        res.send(user);
    });
});

router.get('/', (req, res) => {
    User.find({}, (err, list) => {
        if (err) {
            res.send(err);
        } else {
            res.send(list);
        }
    });
});

module.exports = router;
