var express = require('express');
var router = express.Router();

var verify = require('../functions/verifyFunc');
var validate = require('../functions/validateFunc');

var assignments = require('../controllers/assignmentsCtrl')

router.get('/get', verify.user, assignments.getAssignments);

module.exports = router