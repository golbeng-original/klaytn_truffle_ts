import Caver, {TransactionReceipt} from 'caver-js';

const BAOBAB_URL = 'https://kaikas.baobab.klaytn.net:8651/';

const rawContractPath = "/Users/jobyungjun/Desktop/workspace/typeScript/klaytn_truffle_ts/build/contracts/Counter.json"

const deplyoedAddress = "0xf076920f258d9A548223BBA85B1C6D8616428cB5";

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
        gas: 250000,
    },
    rawContract.bytecode)

    console.log(`deploy address = ${contractInstance.options.address}`)
}

export async function sendPluse(address:string, privateKey:string) {

    const caver = new Caver(BAOBAB_URL)

    //
    caver.wallet.newKeyring(address, privateKey)

    const rawContract = require(rawContractPath)
    let contract = caver.contract.create(rawContract.abi, deplyoedAddress)

    let receipt:TransactionReceipt = await contract.methods.plus().send({
        from: address,
        gas: 250000
    })

    console.log(`use gas = ${receipt.gasUsed}`)

}