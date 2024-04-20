const Event = require('../models/Event')
const User = require('../models/User');
const UserDetail = require('../models/UserDetail');
const mongoose = require('mongoose');

exports.events = async (req, res) => {
    try {
        // Get the section from the query parameters
        const section = req.query.section;
        
        let events = [];

        // Fetch the UserDetails document corresponding to the user making the request
        const userId = req.user ? req.user._id : '661b8c627c36de8c1bbe7413'; // Use default user ID if req.user is not defined
        const user = await User.findById(userId);

        const userDetails = await UserDetail.findById(user.userDetails);

        // Get the college and pin code from the UserDetails document
        const college = userDetails && userDetails.education.length > 0 ? userDetails.education[0].college : null;
        const pinCode = userDetails.pinCode;

        // Check if there is a search query in the request
        const searchQuery = req.query.search;
        

        // If there's a search query, filter events based on it
        if (searchQuery) {
            // Filter events by title, description, or any other relevant fields
            events = await Event.find({
                $or: [
                    { title: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search for title
                    { description: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search for description
                    // Add more fields if needed
                ]
            });
        } else {
           
            switch (section) {
                case 'near-you':
                    // Fetch events based on user's pinCode
                    // You need to implement logic to match events with the user's pinCode
                    events = await Event.find({ pinCode: pinCode });
                    break;
                case 'your-campus':
                    // Fetch events based on user's college
                    events = await Event.find({ campus: college });
                    break;
                case 'recommended':
                    // Fetch all events
                    events = await Event.find({});
                    break;
                default:
                    events = await Event.find({});
                    break;
            }
        }
        res.status(200).json({ success: true, events: events });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.showEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const event = await Event.findById(eventId);
       

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event found',
            event: event,
            userId:req.user._id
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


exports.newEvent = async (req, res) => {
    try {
        const eventData = req.body;
        console.log('----------')
        console.log(req.body);
        let uploadedImages = [];
        if (req.files != undefined)
            uploadedImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
        const newEvent = new Event({
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            dateTime: eventData.dateTime,
            organizer: eventData.organizer,
            category: eventData.category,
            creator: req.user._id,
            capacity: eventData.capacity,
            registrationDeadline: eventData.registrationDeadline,
            images: uploadedImages,
            price: eventData.price,
            status: eventData.status,
            pinCode: eventData.pinCode,
            campus:eventData.campus
        });

        await newEvent.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event: newEvent
        });
    } catch (error) {
        console.error("Error while creating event .....................\n",error);
        res.status(500).json({
            success: false,
            message: 'Error creating event'
        });
    }
};


exports.updateEvent = async (req, res) => {
    try {
        
        const eventId = req.params.eventId;
        const eventData = req.body;
        console.log(req.body);
        const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating event'
        });
    }
};


exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const deletedEvent = await Event.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
            redirectURL: '/events'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.eventRegistration = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.attendees.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: 'User is already registered for the event'
            });
        }

        event.attendees.push(userId);
        await event.save();

        res.status(200).json({
            success: true,
            message: 'User registered successfully for the event',
            event: event
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
