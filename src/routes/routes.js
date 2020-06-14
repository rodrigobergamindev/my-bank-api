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

router.route('/account')
    .get((req,res) => {
        const {agency,number} = req.body
        const account = {agency, number}
        db.getAccount(account)
            .then(account => res.send(account))
    })
    .delete((req,res) => {
        const {agency,number} = req.body
        const account = {agency, number}
        db.deleteAccounts()
            .then(msg => res.send(msg))
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
        .then(balance => res.send(balance))
})

router.put('/transfer', (req, res) => {
    const operation = {
        typeOperation: req.body.typeOperation,
        value: parseFloat(req.body.value),
        date: new Date(),
        agency: req.body.agency,
        number: req.body.number,
        agencyOrigin: req.body.agencyOrigin,
        numberOrigin: req.body.numberOrigin
    }

    db.transfer(operation)
        .then(result => res.send(result))
})

router.get('/balance', (req, res) => {
    const {agency,number} = req.body
    const account = {agency, number}
    db.getBalance(account)
        .then(result => res.send(result))
})

router.get('/extract', (req,res) => {
    const {agency,number} = req.body
    const account = {agency, number}
   db.viewExtracts(account)
    .then(result => res.send(result))
})

module.exports = router