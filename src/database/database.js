const models = require('./models');
const Account = models.Account;
const Extract = models.Extract;

function createAccount(account) {
    Account.create(account)
        .then((newAccount) => {
            console.log(newAccount.get())
        })
        .catch((err) => console.log(err))


}

async function getAccounts(){
    const accounts = await Account.findAll();
    const accountsJSON = JSON.stringify(accounts, null, 2)
    return accountsJSON
}

async function getAccount(id){
    const account = await Account.findAll({
        where: {
          id: id
        }
      });
    const accountJSON = JSON.stringify(account, null, 2)
    return accountJSON
}

function deleteAccounts(id) {
    Account.destroy({
        where: {
            id: id
        }
    })
}

async function updateAccount(account) {
    const id = parseInt(account.id)
    await Account.update({holder, agency, number} = account, {
        where: {
          id: id
        }
      });   

    const newAccount = await Account.findAll({
        where: {
          id: id
        }
      });

    const accountJSON = JSON.stringify(newAccount, null, 2)
    console.log(accountJSON)
    return  accountJSON
}


/*METHODS EXTRACTS*/

function deleteExtracts(id) {
    Extract.destroy({
        where: {
            id: ''
        }
    })
}

function viewExtracts() {
    Account.findByPk(1, {
            include: ['extracts']
        })
        .then((account) => {
            // Get the Company with Users (employes) datas included
            console.log(account.get().extracts)
            // Get the Users (employes) records only
            // console.log(company.get().employes)
        })
        .catch((err) => {
            console.log("Error while find account : ", err)
        })
}

function createExtract() {
    Extract.bulkCreate([{
                typeOperation: 'Deposit',
                value: 335.20,
                date: new Date(),
                accountID: 1
            },
            {
                typeOperation: 'Draw',
                value: 229.10,
                date: new Date(),
                accountID: 1
            },
        ])
        .then((newExtract) => {
            console.log(newExtract)
        })
        .catch((err) => console.log(err))
}

async function deposit(operation){
      const value = operation.value
      await Account.update({balance: value}, {
        where: {
          agency: operation.agency,
          number: operation.number
        }
      })

      const newAccount = await Account.findAll({
        where: {
            agency: operation.agency,
            number: operation.number
        }
      })

      const accountJSON = JSON.stringify(newAccount, null, 2)
      const accountOBJ = JSON.parse(accountJSON)
      console.log(accountOBJ)
      return accountOBJ

}

function transfer(operation){
    
}

async function draw(operation){
    const newAccount = await Account.findAll({
        where: {
            agency: operation.agency,
            number: operation.number
        }
      })

      const accountJSON = JSON.stringify(newAccount, null, 2)
      const accountOBJ = JSON.parse(accountJSON)
      const draw = parseFloat(operation.value)
      const newBalance = accountOBJ[0].balance - draw

    if(accountOBJ[0].balance > draw && accountOBJ[0].balance !== null){
        
        const newAccountBalance = await Account.update({balance: newBalance}, {
        where: {
          agency: operation.agency,
          number: operation.number
        }
      })
      
      const newAccount = await Account.findAll({
        where: {
            agency: operation.agency,
            number: operation.number
        }
      })

      const accountJSON = JSON.stringify(newAccount, null, 2)
      const accountOBJ = JSON.parse(accountJSON)
      return `Draw released! new balance is: ${accountOBJ[0].balance}`
    }
    
}


module.exports = {createAccount, getAccounts, deleteAccounts, getAccount, updateAccount, draw, deposit, transfer}