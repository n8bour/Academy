const Arweave = require('arweave');
const fs = require('fs');

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});

let myKey;
async function importKey() {
    fs.readFile('./key.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
            myKey = JSON.parse(data);
        }
    });
}

const wallet = 'Q9UZc15TJheNV5doYquziQqjjsXlKZJK6pWZIHVr0XU';

async function getWalletBalance() {

    arweave.wallets.getBalance(wallet).then((balance) => {
        let winston = balance;
        let ar = arweave.ar.winstonToAr(balance);

        console.log(winston);
        //125213858712

        console.log(ar);
        //0.125213858712
    });

    // let key = await arweave.wallets.generate();
    // console.log(key);
    // let transactionB = await arweave.createTransaction({
    //     data: Buffer.from('Some data', 'utf8')
    // }, key);
    // console.log(transactionB);

}

importKey();
getWalletBalance();