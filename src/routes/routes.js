const express = require('express')
const router = express.Router()
const db = require('../database/database')


router.use(express.json())
router.get('/', (req, res) => res.send('GET RUNNING'))


router.route('/accounts')
    .post((req, res) => {
        const {holder, agency, number} = req.body
        const account = {holder, agency, number}
        db.createAccount(account)
        res.send('Account created!')
    })
    .get((req, res) => {
        db.getAccounts()
        .then(account => res.send(account))
    })
    .put((req, res) => {
        const {holder, agency, number, id} = req.body
        const account = {holder, agency, number, id}
        db.updateAccount(account)
        .then(acc => res.send(acc))
    })

router.route('/accounts/:id')
    .get((req,res) => {
        const id = parseInt(req.params.id)
        db.getAccount(id)
            .then(account => res.send(account))
    })
    .delete((req,res) => {
        const id = parseInt(req.params.id)
        db.deleteAccounts(id)
    })


router.put('/draw', (req, res) => {
    const operation = {
        typeOperation: req.body.typeOperation,
        value: parseFloat(req.body.value),
        date: new Date(),
        agency: req.body.agency,
        number: req.body.number
    }
    db.draw(operation)
        .then(balance => res.send(balance))
})

router.put('/deposit', (req, res) => {
    const operation = {
        typeOperation: req.body.typeOperation,
        value: parseFloat(req.body.value),
        date: new Date(),
        agency: req.body.agency,
        number: req.body.number
    }
    db.deposit(operation)
})

router.put('/transfer', (req, res) => {
    const operation = {
        typeOperation: req.body.typeOperation,
        value: parseFloat(req.body.value),
        date: new Date(),
        agency: req.body.number,
        number: req.body.number
    }
})


module.exports = router