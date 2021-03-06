var express = require('express');
var core = require('../controller/core.server.controller');
var manage = require('../controller/manage');
var r = express.Router();

r.get('/', core.home);
r.get('/upper/', core.home);
r.get('/middle/', core.middle);

r.get('/manage/', manage.home);
r.post('/manage/upload', manage.upload);
r.post('/manage/remove', manage.remove);

r.get('/api/', core.exposeAPI);
r.get('/api/timeUntil/', core.timeUntil);
r.get('/api/currentBlock/', core.currentBlock);
r.get('/api/currentDay/', core.currentDay);
r.get('/api/getFutureDate/:month/:date/:year', core.getFutureWeek);

r.get('/api/getAnnouncement/', core.getAnnouncement);

r.get('/api/getLunchMenu', core.getLunch);

module.exports = r;
