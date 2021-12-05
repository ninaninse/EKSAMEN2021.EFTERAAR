// Her angives, hvilken path dataen skal følge i forhold til json filen
const express = require("express");
const router = express.Router();
const DATA_PATH = __dirname + "/../../data/users.json";
const fs = require("fs");

const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(DATA_PATH, stringifyData)
}

const getUsersData = () => {
    const jsonData = fs.readFileSync(DATA_PATH)
    return JSON.parse(jsonData)
}

// Her tilføjes en bruger efter de har indtastet deres informationer vha. math.random
router.post('/user', (req, res) => {

    var existUsers = getUsersData()
    const newUserId = Math.floor(100000 + Math.random() * 900000)

    existUsers[newUserId] = req.body

    console.log(existUsers);

    saveUserData(existUsers);
    res.send({success: true, msg: 'user data added successfully'})
})

// Læs - brug metoden get til at få alle brugerenes data til json filen
router.get('/users', (req, res) => {
    const users = getUsersData()
    res.send(users)
})

router.post("/login", (req, res) => {

    const existUsers = getUsersData();
    const email = req.body.email;
    const password = req.body.password;

    let entries = Object.entries(existUsers);
    entries.forEach(user => {
        if (user[1].email === email && user[1].password === password) {
            const userId = user[0];
            res.status(200).send(userId);
        }
    }, true)
});

// Update - ved brug af put metoden
router.put('/user/:id', (req, res) => {
    var existUsers = getUsersData()
    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
        const userId = req.params['id'];
        existUsers[userId] = req.body;

        saveUserData(existUsers);
        res.status(200).send(true);
    }, true);
});

// Delete - ved brug af delete metoden
router.delete('/user/:id', (req, res) => {
    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
        let existUsers = getUsersData()

        const userId = req.params['id'];

        delete existUsers[userId];
        saveUserData(existUsers);
        res.send({response: `accounts with id ${userId} has been deleted`});
    }, true);
})

module.exports = router;
