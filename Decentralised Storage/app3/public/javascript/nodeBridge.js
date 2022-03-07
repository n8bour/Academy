$(document).ready(() => {
  // DOM components
  const inputBox = document.getElementById('input-text');
  const cidBox = document.getElementById('ipfs-request');

  // Confirmation message
  console.log('web3Bridge.js loaded');

  // Function calls
  $('#add-data').click(() => { addData(inputBox.value); });
  $('#get-data').click(() => { getData(cidBox.value); });
  $('#add-file').click(() => { addFile(); });
  $('#get-image').click(() => { getImage(cidBox.value); });
});

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

async function addData(newData) {
  axios.post('/addData', {
    data: newData
  })
    .then((response) => {
      $('#output-text').val(response.data.path);
    });
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