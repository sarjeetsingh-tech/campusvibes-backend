const express = require('express');
const router = express.Router();
const cloudinary=require('cloudinary');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});

const { events, showEvent, newEvent, updateEvent, deleteEvent, eventRegistration } = require('../controllers/event');

router.get('/events', events);
router.get('/events/:eventId', showEvent);
router.post('/events/new',upload.array('eventImages'), newEvent);
router.put('/events/:eventId', updateEvent);
router.delete('/events/:eventId/delete', deleteEvent);
router.post('/events/:eventId/register', eventRegistration);

module.exports = router;
