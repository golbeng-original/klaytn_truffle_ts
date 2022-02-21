import Caver from 'caver-js';

const BAOBAB_URL = 'https://kaikas.baobab.klaytn.net:8651/';

export class CounterDeploy {

    private _compiledContractPath:string = ''
    private _deployerAddr:string = ''
    private _deployerPrivateKey:string = ''

    constructor(compiledContractPath:string, deployerAddr:string, privateKey:string) {
        this._compiledContractPath = compiledContractPath
        this._deployerAddr = deployerAddr
        this._deployerPrivateKey = privateKey
    }

    connectCaver() : Caver {
        let caver = new Caver(BAOBAB_URL)
        return caver
    }

    async deploy() : Promise<void> {
        let caver = this.connectCaver()

        let deployerKeyring = caver.wallet.newKeyring(this._deployerAddr, this._deployerPrivateKey)
        //caver.wallet.add(deployerKeyring)


        let rawContract = require(this._compiledContractPath)
        let contract = caver.contract.create(rawContract.abi)

        let receipt = await contract.deploy({
            from: deployerKeyring.address,
            gas: 250000,
        },
        rawContract.bytecode
        )

        console.log(`receipr = ${receipt}`)
        receipt.options.address
    }
}