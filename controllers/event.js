const Event = require('../models/Event')
const User = require('../models/User');
const mongoose=require('mongoose');

exports.events = async (req, res) => {
    try {
        const allEvents = await Event.find({});
        console.log(allEvents);
        res.send(allEvents);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

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


exports.newEvent = async (req, res) => {
    try {
        const eventData = req.body;
        
        console.log(req.files);
        let uploadedImages=[];
        if(req.files!=undefined)
        uploadedImages=req.files.map(f=>({url:f.path,filename:f.filename}));
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
            images:uploadedImages,
            price: eventData.price,
            status: eventData.status
        });
        
        await newEvent.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event: newEvent
        });
    } catch (error) {
        console.error(error);
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
            redirectURL:'/events'
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
        const  userId  = req.user._id;

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
