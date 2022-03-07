$(document).ready(() => {
  // DOM components
  const wallet = document.getElementById('wallet');

  const inputBox = document.getElementById('input-text');
  const requestBox = document.getElementById('tx-status');

  // Confirmation message
  console.log('web3Bridge.js loaded');

  // Function calls  
  $('#get-balance').click(() => { getBalance(wallet.value); });
  $('#add-data').click(() => { addData(inputBox.value); });
  $('#get-tx-status').click(() => { getTxStatus(requestBox.value); });

  $('#get-data').click(() => { getData(requestBox.value); });
  $('#add-file').click(() => { addFile(); });
  $('#get-image').click(() => { getImage(requestBox.value); });
});

async function getBalance(wallet) {
  axios.post('/getBalance', {
    data: wallet
  })
    .then((response) => {
      $('#output-text').val(response.data);
    })
}

async function addData(newData) {
  axios.post('/addData', {
    data: newData
  })
    .then((response) => {
      $('#output-text').val(response.data.path);
    });
}

async function getTxStatus(_txId) {
  console.log(_txId);
  axios.post('/getTxStatus', {
    data: _txId
  })
    .then((response) => {
      $('#output-text').val(response.data.path);
    });
}

async function addFile() {
  const reader = new FileReader();
  reader.onloadend = function () {
    const buf = buffer.Buffer.from(reader.result);
    axios.post('/addFile', {
      data: buf
    })
      .then((response) => {
        $('#output-text').val(response.data.path);
      });
  }
  const file = document.getElementById("file");
  reader.readAsArrayBuffer(file.files[0]);
}

async function getData(cid) {
  axios.post('/getData', {
    data: cid
  })
    .then((response) => {
      $('#output-text').val(response.data[0]);
    });
}

async function getImage(cid) {
  axios.post('/getImage', {
    data: cid
  })
    .then((response) => {
      $('#ipfs-image').attr('src', `data:image/png;base64,${toBase64(response.data[0].data)}`);
    });
}

function toBase64(arr) {
  arr = new Uint8Array(arr)
  return btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}