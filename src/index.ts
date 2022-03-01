import fs from "fs";
import { testMakePerson } from "./utils/makePerson";

import {CounterDeploy} from "./counter/deploy";

import Caver, {DeprecatedTransactionObject, TransactionReceipt} from "caver-js";
import { exit } from "process";

import * as counter from "./counter";
import * as testValue from "./testValue";


//testMakePerson()

const BAOBAB_URL = 'https://kaikas.baobab.klaytn.net:8651/';

const test1_addr = '0xB38D9A4a8d9a39Dc3432d7248c9DD4BF419Ce296';
const test1_privatekey = '0x3711298e771f21587e961165e9401a03d4a3fef312a323b1f2c723ebb50bfda4';

const test2_addr = '0xf753379A4cca29b6b4f6B5c615a2fa1E2481daF9';
const test2_privatekey = '0x3cf89940fc6008e97dfec277bb764cea86a8c6c158998ee61b302b009e4cd182';

const deployed_address = '0xc091354706d14C58b66fd35A05aB594188Fa828F'

async function makeTx() {
    let caver = new Caver(BAOBAB_URL)

    let feePlayer = caver.klay.accounts.wallet.add(test1_privatekey)

    const plusMethod = caver.klay.abi.encodeFunctionSignature('plus()')

    /*
    let result = await caver.klay.sendTransaction({
        type: 'SMART_CONTRACT_EXECUTION',
        from: addr,
        to: deployed_address,
        data: plusMethod,
        gas: 300000,
    })
    */

    /*
    let result = await caver.klay.signTransaction({
        type: 'SMART_CONTRACT_EXECUTION',
        from: addr,
        to: deployed_address,
        data: plusMethod,
        gas: 300000,
    },
    )
    */
    
    let nonce = await caver.rpc.klay.getTransactionCount(test1_addr, 'pending')
    nonce = caver.utils.hexToNumber(nonce)
    console.log(`nonce = ${nonce}`)

    let signedTx:any = await caver.klay.accounts.signTransaction({
        type: 'SMART_CONTRACT_EXECUTION',
        from: test1_addr,
        to: deployed_address,
        data: plusMethod,
        gas: 300000,
        //nonce: nonce
    },
    test1_privatekey)

    console.log(signedTx)

    
    const {rawTransaction: rawTx} = signedTx

    console.log(rawTx)

    const receipt = await caver.rpc.klay.sendRawTransaction(rawTx)

    //const reciept = await caver.klay.sendRawTransaction(rawTx)

    console.log(receipt)
    
}

async function sendRawTx() {

    let caver = new Caver(BAOBAB_URL)

    let feePlayer = caver.klay.accounts.wallet.add(test1_privatekey)

    const rawTx = '0x31f88a278505d21dba00837a120094c091354706d14c58b66fd35a05ab594188fa828f8094b38d9a4a8d9a39dc3432d7248c9dd4bf419ce2968418b0c3fdf847f8458207f6a004012710f33dda157ceba69b159d0403c8f2d5222a36894e529fea72055ee3f9a0325d08f714ec7bc4c0f0c142f79bb40ba89abd65f6a77a20650a98048b15082780c4c3018080'

    let receiveTx = false
    let receiveReceipt = false

    let tx = await caver.klay.sendTransaction({
        senderRawTransaction: rawTx,
        feePayer: feePlayer.address
    })
    /*
    .on('transactionHash', (hash) => {
        console.log(`tx hash = ${hash}`)
        receiveTx = true
    })
    .on('error', (e) => {
        console.log(`error = ${e}`)
    })
    */

    console.log(`receipt = ${tx.gasUsed}`)

    console.log('done!!')

    /*
    caver.klay.sendTransaction({
        type: 'SMART_CONTRACT_EXECUTION',
        from:addr,
        to:deployed_address,
        gas: 2000000,
        data: 

    })
    */
}

async function getNonece() {

    let caver = new Caver(BAOBAB_URL)
    let feePlayer = caver.klay.accounts.wallet.add(test1_privatekey)

    let count = await caver.klay.getTransactionCount('0xB38D9A4a8d9a39Dc3432d7248c9DD4BF419Ce296')
    console.log(count)

    //caver.utils.numberToHex()

    let count2 = await caver.rpc.klay.getTransactionCount('0xB38D9A4a8d9a39Dc3432d7248c9DD4BF419Ce296', 'pending')
    console.log(count2)
    count2 = caver.utils.hexToNumber(count2)
    console.log(count2)
}

async function main() {

    // counter test
    //await counter.deploy(test1_addr, test1_privatekey);
    //await counter.sendPluse(test1_addr, test1_privatekey)

    //await testValue.deploy(test1_addr, test1_privatekey);

    //await testValue.sendTest(test2_addr, test2_privatekey);
    await testValue.withDraw(test1_addr, test1_privatekey);


    //await makeTx()

    //await sendRawTx()
    //await getNonece()
}

main()
.then(() => {
    exit(0)
})
.catch((e) => {
    console.log(e)
    exit(1)
})