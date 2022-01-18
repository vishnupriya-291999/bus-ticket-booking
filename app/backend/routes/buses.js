const express = require('express');
const Bus = require('../models/bus');
const router = express.Router();

router.get('/fetch', (req, res, next)=> {
    console.log(req.query);
    Bus.find({from: req.query.from, to: req.query.to})
    .then(result=> {
        res.status(200).json({
            message: 'Buses Fetched Successfully',
            buses: result
        });
    })
    .catch(err=> {
        res.status(500).json({
            message: 'Fetching Buses Failed'
        });
    });
});

router.post('/book', (req, res, next)=> {
    console.log(req.body.seatArr);
    Bus.findByIdAndUpdate({_id: req.body.id}, {$push: {bookedSeats: {$each: req.body.seatArr}}})
    .then(result=> {
        res.status(201).json({
            message: 'Seats Booked'
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            message: 'Error in  Booking'
        });
    });
});

module.exports = router;