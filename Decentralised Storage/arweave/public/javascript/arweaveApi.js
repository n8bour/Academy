const Arweave = require('arweave');
const fs = require('fs');

let myKey;
let arweave;
let myWallet;
async function init() {
    arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
    });
    fs.readFile('./key.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
            myKey = JSON.parse(data);
            arweave.wallets.jwkToAddress(myKey).then((address) => {
                myWallet = address;
            });
        }
    });
}

// const wallet = 'Q9UZc15TJheNV5doYquziQqjjsXlKZJK6pWZIHVr0XU';

async function getWalletBalance() {

    arweave.wallets.getBalance(wallet).then((balance) => {
        let winston = balance;
        let ar = arweave.ar.winstonToAr(balance);

        console.log(winston);

        console.log(ar);
    });

    arweave.wallets.getLastTransactionID(wallet).then((transactionId) => {
        console.log(transactionId);
        //3pXpj43Tk8QzDAoERjHE3ED7oEKLKephjnVakvkiHF8
    });
}

const arweaveApi = {
    async getMyWallet() {
        return await myWallet;
    },
    async getBalance(_wallet) {
        return await arweave.ar.winstonToAr(
            await arweave.wallets.getBalance(_wallet)
        );
    },
    async addData(_data) {
        let transaction = await arweave.createTransaction({
            data: Buffer.from(_data, 'utf8')
        }, myKey);
        await arweave.transactions.sign(transaction, myKey);
        let uploader = await arweave.transactions.getUploader(transaction);
        console.log("Uploading...")
        while (!uploader.isComplete) {
            await uploader.uploadChunk();
            console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
            return transaction;
        }
    },
    async getTxStatus(_txId) {
        arweave.transactions.getStatus(_txId).then(res => {
            console.log("_txId");
            console.log(_txId);
            console.log(res);
        });
    },
    async getLastTx(_wallet) {
        return await arweave.wallets.getLastTransactionID(_wallet);
        // arweave.wallets.getLastTransactionID(_wallet).then((transactionId) => {
        //     console.log(transactionId);
        //     return transactionId;
        // });
    }
}

init();

module.exports = arweaveApi;