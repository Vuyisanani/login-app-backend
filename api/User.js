const express = require('express')
const router = express.Router();

//MongoDB user Model
const User = require('./../models/User');

const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
//   res.send('You have succesfully signed in: ')
  
    let {name, email, password, dateOfBirth } = req.body;
    
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if(name == '' || email == '' || password == '' || dateOfBirth == '') {
        res.json({
            status: 'FAILED',
            message: 'Empty input field/(s)'
        });

    } else if(!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid name entered'
        });

    } else if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            res.json({
                status: 'FAILED',
                message: 'Email does not match email regex expression'
            });

    } else if(new Date(dateOfBirth).getTime()) {
        res.json({
            status: 'FAILED',
            message: 'Invalid date of birth entered'
        });

    } else if(password.length < 8) {
        res.json({
            status: 'FAILED',
            message: 'Password is too short'
        });

    } else if(password.length > 30) {
        res.json({
            status: 'FAILED',
            message: 'Password is too long'
        });

    } else {
        //Check if the user exists
        User.find(email).then((result) => {
            if(result.length) {
                res.json({
                    status: 'FAILED',
                    message: 'A user with the provided email address already exists'
                });

            } else {
                 // using bcrypt to hash the password got it here: https://www.npmjs.com/package/bcrypt
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then((hashedpassword) => {
                    // Store hash in your password DB.
                    const newUser = new User({
                        name, 
                        email,
                        password: hashedpassword,
                        dateOfBirth
                    });

                    newUser.save().then( (result) => {
                        res.json({
                            status: 'SUCCESS',
                            message: 'A new user has been created succesfully',
                            data: result
                        });
                    }).catch( (error) => {
                        res.json({
                            status: 'FAILED',
                            message: 'An error occured when trying to save a new user to the DB'
                        });
                    })

                }).catch( (error)=> {
                    res.json({
                        status: 'FAILED',
                        message: 'An error occured when hashing the password'
                    });
                    });
                    
                }
        }).catch( (error) => {
            res.json({
                status: 'FAILED',
                message: 'An error occured when checking for an existing user'
            });
        })
    }

});

router.post('/signin', (req, res) => {
    // res.send('Succesfully logged in: ');
        let {email, password } = req.body;
        email = email.trim();
        password = password.trim(); 

        if(email == '' || password == ''){
            res.json({
                status: 'FAILED',
                message: 'Empty credentials supplied !'
            });
        } else {
            User.find({email}).then( (data) => {
                if(data.length) {

                    const hashedPassword = data[0].password;
                    bcrypt.compare(pasword, hashedPassword).then( (result) => {
                        if(result) {
                            res.json({
                                status: 'SUCCESS',
                                message: "You have successfully logged in!",
                                data: data
                            });
                        } else {
                            res.json({
                                status: 'FAILED',
                                message: 'Invalid Password entered'
                            });
                        }
                    }).catch((error) => {
                        res.json({
                            status: "FAILED",
                            message:"An error occured while trying to compare the password"
                        })
                    })
                } else {
                    res.json({
                        status: 'FAILED',
                        message: 'Invalid credentials entered'
                    });
                }
            }).catch( (error) => {
                res.json({
                    status: 'FAILED',
                    message: 'An error occured while checking for an existing user'
                })
            })
        }

  });

  module.exports = router;
  