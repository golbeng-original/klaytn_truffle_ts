import Caver, { AbstractCaver, TransactionReceipt } from 'caver-js'

const BAOBAB_URL = 'https://kaikas.baobab.klaytn.net:8651/'

const compiledContractPath = '/Users/jobyungjun/Desktop/workspace/klaytn_truffle_ts/build/contracts/WhiteMint.json'
const contractAddress = '0xbDCF854706D9f3Ba84c97BD920dDdC9407814129'

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
    rawContract.bytecode,
    1, 1000, '0xF671558DD1BaCdE14ee36c0B86a33ED8DEAb77f8')

    console.log(`deploy address = ${contractInstance.options.address}`)
}

export async function addWhiteList(...addressArgs:string[]) {
    const caver = new Caver(BAOBAB_URL)
    caver.wallet.newKeyring(owner, ownerPrivateKey)

    const rawContract = require(compiledContractPath)
    const contract = caver.contract.create(rawContract.abi, contractAddress)

    for(let address of addressArgs)
    {
        const reciept:TransactionReceipt = await contract.methods.addWhitelisted(address, 5).send({
            from: owner,
            gas: 5000000
        })

        console.log(`use gas = ${reciept.gasUsed}`)
    }
}

export function functionSelector() {

    const caver = new Caver(BAOBAB_URL)

    const isWhitelistSignature = caver.klay.abi.encodeFunctionSignature('isWhitelisted(address)')

    console.log(`isWhitelist = ${isWhitelistSignature}`)
}

export async function executeNormal(address:string) {

    const caver = new Caver(BAOBAB_URL)
    caver.wallet.newKeyring(owner, ownerPrivateKey)


    const rawContract = require(compiledContractPath)
    const contract = caver.contract.create(rawContract.abi, contractAddress)

    const result = await contract.methods.isWhitelisted(address).call({
        from: owner
    })

    console.log(result)
}

export async function smartContractExecution(address:string) {

    const caver = new Caver(BAOBAB_URL)
    caver.wallet.newKeyring(owner, ownerPrivateKey)

    const rawContract = require(compiledContractPath)
    const contract = caver.contract.create(rawContract.abi)

    const orignCall = contract.methods.isWhitelisted(address).encodeABI()
    console.log(orignCall)

    const functionCall = caver.abi.encodeFunctionCall({
        constant: true,
        type: "function",
        name: "isWhitelisted",
        payable: false,
        stateMutability: "view",
        inputs: [
            {
                name: "account",
                type: "address"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool"
            }
        ],

    }, [address, ])

    console.log(functionCall)

    const execution = caver.transaction.smartContractExecution.create({
        from: owner,
        to: contractAddress,
        input: functionCall,
        gas: 500000,
    })

    await execution.fillTransaction()

    //console.log(`txHahs = ${execution.getRawTransaction()}`)

    //let receipt:TransactionReceipt = await caver.rpc.klay.sendTransaction(execution)
    let r = await caver.klay.call({
        to: contractAddress,
        data: functionCall
    })

    r = caver.utils.hexToNumber(r)

    //let receipt:TransactionReceipt = await caver.klay.sendTransaction(execution)

    /*
    let receipt:TransactionReceipt = await caver.klay.sendTransaction({
        type: 'SMART_CONTRACT_EXECUTION',
        from: owner,
        to: contractAddress,
        gas: 500000,
        data: functionCall
    }, (err, receipt) => {
        console.log(`error = ${err}`)
        console.log(`receipt = ${receipt}`)
    })
    */

    console.log(r)
}