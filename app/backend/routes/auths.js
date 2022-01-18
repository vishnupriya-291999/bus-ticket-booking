const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/auth');
const checkAuth = require('../middlewares/check-auth');
const router = express.Router();

router.post('/signup', (req, res, next) => {
    console.log(req.body)
    bcrypt.hash(req.body.pass, 10)
        .then(hashPass => {
            const user = new User({
                fname: req.body.fname,
                lname: req.body.lname,
                phone: req.body.phone,
                gender: req.body.gender,
                age: req.body.age,
                email: req.body.email,
                pass: hashPass
            });
            user.save()
                .then(result => {
                    console.log(result)
                    res.status(201).json({
                        message: 'User Created',
                    })
                })
                .catch(err => {
                    let errorMsg = err.message.split(':')
                    console.log(errorMsg[2])
                    res.status(500).json({
                        message: errorMsg[2]
                    })
                })
        })
        .catch(hashErr => {
            console.log("Error in hashing ", hashErr)
        })
})

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "User Not Found"
                })
            }
            bcrypt.compare(req.body.pass, user.pass)
                .then(compareRes => {
                    if (!compareRes) {
                        return res.status(401).json({
                            message: "Login Failed"
                        })
                    }
                    var token = jwt.sign(
                        {
                            email: user.email,
                            id: user._id
                        },
                        'this-is-my-secret-passcode',
                        {
                            expiresIn: '1h'
                        });
                    res.status(200).json({
                        message: 'Login Successfull',
                        token: token,
                        expiresIn: 3600,
                        name: user.fname+' '+user.lname,
                        age: user.age,
                        gender: user.gender
                    })
                })
                .catch(err => {
                    res.status(401).json({
                        message: "Login Failed"
                    })
                })
        })
        .catch(err => {
            res.status(401).json({
                message: "Login Failed"
            })
        })
})

router.post('/ticket', checkAuth, (req, res, next)=> {
    const userId = req.userData.id;
    console.log("Post ",userId);
    User.findByIdAndUpdate({_id: userId}, {$push: {tickets: req.body}})
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Ticket Booked Successfully'
        })
    })
    .catch(err => {
        res.status(500).json({
            message: 'Ticket Booking Failed'
        })
    })
})

router.get('/ticket', checkAuth, (req, res, next) => {
    const userId = req.userData.id;
    console.log("Get ",userId);
    User.find({_id: userId})
    .then(result => {
        res.status(200).json({
            message: "Tickets Fetched Successfully",
            result: result
        })
    })
    .catch(err => {
        res.status(500).json({
            message: "Failed to fetch Tickets"
        })
    })
})

module.exports = router;