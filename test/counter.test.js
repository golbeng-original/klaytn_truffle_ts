const Counter = artifacts.require('Counter')

contract('Counter', ([_, creator, ...accounts]) => {

    console.log(`creator = ${creator}`)

    console.log('----------------------')
    for(let account of accounts) {
        console.log(`account = ${account}`)
    }

    beforeEach(async function() {
        this.counter = await Counter.new({
            from: creator
        })

        console.log(this.counter)

        await this.counter.plus()
    })

    it('plus', async function() {
        (await this.counter.getValue()).should.be.bignumber.equal(1);
    })

    //it("shuld put 10000 MetaCoin in the first account", () => 
    //Counter.deployed()
    //);
})