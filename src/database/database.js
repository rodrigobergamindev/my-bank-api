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

async function getAccounts() {
  const accounts = await Account.findAll({
    raw: true
  });
  return accounts
}

async function getAccount(acc) {
  const account = await Account.findAll({
    raw: true,
    where: {
      agency: acc.agency,
      number: acc.number
    }
  });
  return account
}

async function deleteAccount(acc) {
  await Account.destroy({
    where: {
      agency: acc.agency,
      number: acc.number
    }
  })
  return 'Account deleted'
}

async function updateAccount(account) {
  const id = parseInt(account.id)
  await Account.update({
    holder,
    agency,
    number
  } = account, {
    where: {
      id: id
    }
  });

  const newAccount = await Account.findAll({
    raw: true,
    where: {
      id: id
    }
  });
  return newAccount
}


/*METHODS EXTRACTS*/

async function getBalance(acc) {
  const account = await Account.findAll({
    raw: true,
    limit: 1,
    where: {
      agency: acc.agency,
      number: acc.number
    }
  })

  if (account[0].balance !== null && account[0].balance > 0) {
    return `Balance: $ ${account[0].balance}`
  } else {
    return 'Balance: $ 0'
  }
}

async function viewExtracts(acc) {
  const account = await Account.findAll({
    limit: 1,
    raw: true,
    where: {
      agency: acc.agency,
      number: acc.number
    },
    include: [{model: Extract, as:'extracts'}],
    defaultScope: {
      exclude: ['balance']
    }
  })
  return account
}

async function deposit(operation) {
  const account = await Account.findAll({
    limit: 1,
    raw: true,
    where: {
      agency: operation.agency,
      number: operation.number
    }
  })

  const newBalance = account[0].balance + operation.value
  if (account[0]) {

    await Account.update({
      balance: newBalance
    }, {
      where: {
        agency: operation.agency,
        number: operation.number
      }
    })

    /*CREATE EXTRACT TO OPERATION*/

    await Extract.create({
      typeOperation: operation.typeOperation,
      value: operation.value,
      date: new Date(),
      accountID: account[0].id
    })

    return `Deposit released!`
  }


}

async function transfer(operation) {
  const account = await Account.findAll({
    limit: 1,
    raw: true,
    where: {
      agency: operation.agency,
      number: operation.number
    }
  })

  const accountOrigin = await Account.findAll({
    limit: 1,
    raw: true,
    where: {
      agency: operation.agencyOrigin,
      number: operation.numberOrigin
    }
  })
  const newBalance = accountOrigin[0].balance - operation.value
  const newBalanceDestiny = account[0].balance + operation.value

  if (accountOrigin[0].balance > operation.value && accountOrigin[0].balance !== null) {
    const setNewBalance = await Account.update({
      balance: newBalance
    }, {
      where: {
        agency: operation.agencyOrigin,
        number: operation.numberOrigin
      }
    })

    const setNewBalanceDestiny = await Account.update({
      balance: newBalanceDestiny
    }, {
      where: {
        agency: operation.agency,
        number: operation.number
      }
    })

    /*CREATE EXTRACT HERE*/

    await Extract.create({
      typeOperation: operation.typeOperation,
      value: operation.value,
      date: new Date(),
      accountID: accountOrigin[0].id
    })

    await Extract.create({
      typeOperation: operation.typeOperation,
      value: operation.value,
      date: new Date(),
      accountID: account[0].id
    })

    return `Transfer released!`
  } else {
    return `Insuficient founds`
  }
}

async function draw(operation) {
  const account = await Account.findAll({
    limit: 1,
    raw: true,
    where: {
      agency: operation.agency,
      number: operation.number
    }
  })
  const newBalance = account[0].balance - operation.value

  if (account[0].balance > operation.value && account[0].balance !== null) {
    const setNewBalance = await Account.update({
      balance: newBalance
    }, {
      where: {
        agency: operation.agency,
        number: operation.number
      }
    })

    /*CREATE EXTRACT HERE*/

    await Extract.create({
      typeOperation: operation.typeOperation,
      value: operation.value,
      date: new Date(),
      accountID: account[0].id
    })

    return `Draw released!`
  } else {
    return `Insuficient founds`
  }
}



module.exports = {
  createAccount,
  getAccounts,
  deleteAccount,
  getAccount,
  updateAccount,
  draw,
  deposit,
  transfer,
  getBalance,
  viewExtracts
}