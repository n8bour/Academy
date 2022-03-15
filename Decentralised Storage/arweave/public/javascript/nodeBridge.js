$(document).ready(() => {
  // DOM components
  const wallet = document.getElementById('wallet');

  const inputBox = document.getElementById('input-text');
  const requestBox = document.getElementById('tx-status');

  // Confirmation message
  console.log('nodeBridge.js loaded');

  // Function calls
  $('#get-wallet').click(() => {
    getMyWallet();
  });
  $('#get-balance').click(() => {
    getBalance(wallet.value);
  });
  $('#get-last-tx').click(() => {
    getLastTx(wallet.value);
  });
  $('#add-data').click(() => {
    addData(inputBox.value);
  });
  $('#get-tx-status').click(() => {
    getTxStatus(requestBox.value);
  });

  $('#get-data').click(() => {
    getData(requestBox.value);
  });
  $('#add-file').click(() => {
    addFile();
  });
  $('#get-image').click(() => {
    getImage(requestBox.value);
  });
});

async function getMyWallet() {
  axios.post('/getMyWallet', {}).then((response) => {
    $('#output-text').val(response.data);
  });
}

async function getLastTx(wallet) {
  axios
    .post('/getLastTx', {
      data: wallet,
    })
    .then((response) => {
      $('#output-text').val(response.data);
    });
}

async function getBalance(wallet) {
  axios
    .post('/getBalance', {
      data: wallet,
    })
    .then((response) => {
      $('#output-text').val(response.data);
    });
}

async function addData(newData) {
  axios
    .post('/addData', {
      data: newData,
    })
    .then((response) => {
      $('#output-text').val(response.data.path);
    });
}

async function getTxStatus(_txId) {
  axios
    .post('/getTxStatus', {
      data: _txId,
    })
    .then((response) => {
      console.log(response.data.confirmed);
      $('#output-text').val(JSON.stringify(response.data.confirmed));
    });
}

async function getData(cid) {
  axios
    .post('/getData', {
      data: cid,
    })
    .then((response) => {
      $('#output-text').val(response.data);
    });
}
