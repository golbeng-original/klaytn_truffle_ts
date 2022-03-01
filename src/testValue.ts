import Caver, {TransactionReceipt} from 'caver-js';

const BAOBAB_URL = 'https://kaikas.baobab.klaytn.net:8651/';

const rawContractPath = "/Users/jobyungjun/Desktop/workspace/typeScript/klaytn_truffle_ts/build/contracts/TestValueContract.json"

const deplyoedAddress = "0x77Ba82D41C3945687a2f70E663dFaAC5f9F5aC61";

export async function deploy(address:string, privateKey:string) {

    if(deplyoedAddress.length > 0) {
        console.log('already deployed')
        return;
    }

    const caver = new Caver(BAOBAB_URL)

    caver.wallet.newKeyring(address, privateKey)

    const rawContract = require(rawContractPath)
    let contract = caver.contract.create(rawContract.abi)

    let contractInstance = await contract.deploy({
        from: address,
        gas: 50000000,
    },
    rawContract.bytecode)

    console.log(`deploy address = ${contractInstance.options.address}`)
}

export async function sendTest(address:string, privateKey:string) {

    const caver = new Caver(BAOBAB_URL)

    caver.wallet.newKeyring(address, privateKey)

    const rawContract = require(rawContractPath)
    let contract = caver.contract.create(rawContract.abi, deplyoedAddress)

    let receipt = await contract.methods.testSendValue().send({
        from: address,
        gas: 50000000,
        value: caver.utils.convertToPeb(1, 'KLAY')
    })
    // gasUsed : 22942
    // gasPirce = 25000000000 -> 0.000000025 KLAY (25 ston)
    // total = 0.00057355 KLAY

    console.log(receipt)
}

export async function withDraw(address:string, privateKey:string) {
    const caver = new Caver(BAOBAB_URL)

    caver.wallet.newKeyring(address, privateKey)

    const rawContract = require(rawContractPath)
    let contract = caver.contract.create(rawContract.abi, deplyoedAddress)

    let receipt = await contract.methods.withdraw().send({
        from: address,
        gas: 50000000,
    })
    // gasUsed : 30683
    // gasPirce = 25000000000 -> 0.000000025 KLAY (25 ston)
    // total = 0.00057355 KLAY

    console.log(receipt)
}