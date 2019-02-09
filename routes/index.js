var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

exports.index = function(req, res) {
    console.log("AAAAAAAA");
};

module.exports = router;
