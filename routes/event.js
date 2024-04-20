const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const isAuthenticated = require('../middlewares/isAuthenticated')

const { events, showEvent, newEvent, updateEvent, deleteEvent, eventRegistration } = require('../controllers/event');

router.get('/events/:eventId',isAuthenticated, showEvent);
router.get('/events', isAuthenticated, events);
router.post('/events/new', isAuthenticated, newEvent);
router.put('/events/:eventId', isAuthenticated, updateEvent);
router.delete('/events/:eventId/delete', deleteEvent);
router.post('/events/:eventId/register',isAuthenticated, eventRegistration);

module.exports = router;
