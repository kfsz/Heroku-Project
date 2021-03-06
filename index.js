const express = require('express');
const PORT = process.env.PORT || 5000;
// well, not mine - but whatever
const myDatabase = process.env.MONGO_DATABASE;
const app = express();

const mongoose = require('mongoose');

const databaseURI = myDatabase;

const UserSchema = require('./helpers/user.schema');

mongoose.connect(databaseURI);

const UserModel = mongoose.model('User', UserSchema);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.redirect('/users');
});

app.get('/users', (req, res) => {
    UserModel.find({}, 'firstName lastName', (err, data) => {
        res.send({
            data: data.map((user) => { return { id: user._id, firstName: user.firstName, lastName: user.lastName }}),
        });
    });
});

app.get('/users/:userId', (req, res) => {
    UserModel.find({ _id: req.params.userId}, 'firstName lastName', (err, data) => {
        res.send({
            data: data.map((user) => {return {id: user._id, firstName: user.firstName, lastName: user.lastName}}),
        })
    })
});

app.post('/users', (req, res) => {
    if (!req.body.firstName || !req.body.lastName) {
        return res.sendStatus(400);
    }

    UserModel.create({ firstName: req.body.firstName, lastName: req.body.lastName }, (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        return res.sendStatus(204);
    });
});

app.put('/users/:userId', (req, res) => {
    if (!req.body.firstName || !req.body.lastName) {
        return res.sendStatus(400);
    }

    UserModel.updateOne({ _id: req.params.userId }, { firstName: req.body.firstName, lastName: req.body.lastName }, (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        return res.sendStatus(204);
    });
});

app.delete('/users/:userId', (req, res) => {
    UserModel.deleteOne({ _id: req.params.userId }, (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        return res.sendStatus(204);
    });
});

app.get('/user', (req, res) => {
    res.send({
        data: 'test',
    });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));