import { testMakePerson } from "./utils/makePerson";

import {CounterDeploy} from "./counter/deploy";

import Caver from "caver-js";

//testMakePerson()

const BAOBAB_URL = 'https://kaikas.baobab.klaytn.net:8651/';

const addr = '0xB38D9A4a8d9a39Dc3432d7248c9DD4BF419Ce296';
const privateKey = '0x3711298e771f21587e961165e9401a03d4a3fef312a323b1f2c723ebb50bfda4';

(async () => {

    let counter = new CounterDeploy('../../build/contracts/Counter.json', addr, privateKey)

    await counter.deploy()
    
    /*
    var provider = new Caver.providers.HttpProvider(BAOBAB_URL);
    let caver = new Caver(provider);

    let blockNumber = await caver.klay.getBlockNumber();

    console.log(`blockNUmber = ${blockNumber}`)
    */
})()