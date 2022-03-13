import Caver, { TransactionReceipt } from 'caver-js'

const BAOBAB_URL = 'https://kaikas.baobab.klaytn.net:8651/'

const compiledContractPath = '/Users/jobyungjun/Desktop/workspace/klaytn_truffle_ts/build/contracts/TestKIP17.json'
const contractAddress = '0xF671558DD1BaCdE14ee36c0B86a33ED8DEAb77f8'

const owner = '0xB38D9A4a8d9a39Dc3432d7248c9DD4BF419Ce296'
const ownerPrivateKey = '0x3711298e771f21587e961165e9401a03d4a3fef312a323b1f2c723ebb50bfda4'

export async function deploy() {

    const caver = new Caver(BAOBAB_URL)
    caver.wallet.newKeyring(owner, ownerPrivateKey)

    const rawContract = require(compiledContractPath)

    const contract = caver.contract.create(rawContract.abi)
    
    const contractInstance = await contract.deploy({
        from: owner,
        gas: 5000000,
    },
    rawContract.bytecode)

    console.log(`deploy address = ${contractInstance.options.address}`)
}