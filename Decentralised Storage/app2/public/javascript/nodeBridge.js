$(document).ready(() => {
  // DOM components
  const inputBox = document.getElementById('input-text');
  const cidBox = document.getElementById('ipfs-request');

  // Confirmation message
  console.log('web3Bridge.js loaded');

  // Function calls
  $('#add-data').click(() => { addData(inputBox.value); });
  $('#get-data').click(() => { getData(cidBox.value); });
});

async function addData(newData) {
  axios.post('/addData', {
    data: newData
  })
    .then((response) => {
      $('#output-text').val(response.data.path);
    })
}

async function getData(cid) {
  axios.post('/getData', {
    data: cid
  })
    .then((response) => {
      $('#output-text').val(response.data[0]);
    })
}
