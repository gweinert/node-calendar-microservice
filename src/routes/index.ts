import * as express from 'express';
const calendar = require('../calendar');

const router = express.Router();

router.get('/calendar', calendar.all);

module.exports = router;