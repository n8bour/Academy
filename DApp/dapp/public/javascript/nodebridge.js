$(document).ready(() => {
  // DOM components
  const inputBox = document.getElementById('input-text')
  const cidBox = document.getElementById('ipfs-request')
  const ownerInput = document.getElementById('owner-input')
  const uriInput = document.getElementById('uri-input')
  const txFrom = document.getElementById('tx-from')
  const txTo = document.getElementById('tx-to')
  const tokenId = document.getElementById('token-id')
  // Browser confirmation message
  console.log('web3Bridge.js loaded')
  // Function calls
  $('#mint-nft').click(() => {
    mintNft({
      receiver: ownerInput.value,
      uri: uriInput.value,
    })
  })
  $('#get-nfts').click(() => {
    if (ownerInput.value != '') {
      getNfts(ownerInput.value)
    } else {
      alert('Please fill in public key')
    }
  })
  $('#tx-nft').click(() => {
    if (txFrom.value != '' && txTo.value != '' && tokenId.value != '') {
      txNft({
        from: txFrom.value,
        to: txTo.value,
        tokenId: tokenId.value,
      })
    } else {
      alert('Please fill in all fields')
    }
  })
  $('#add-data').click(() => {
    addData(inputBox.value)
  })
  $('#add-file').click(() => {
    addFile()
  })
  $('#get-data').click(() => {
    if (cidBox.value != '') {
      getData(cidBox.value)
    } else {
      alert('Please fill in CID')
    }
  })
  $('#get-image').click(() => {
    if (cidBox.value != '') {
      getImage(cidBox.value)
    } else {
      alert('Please fill in CID')
    }
  })
})

async function mintNft(params) {
  axios
    .post('/mintNft', {
      params: params,
    })
    .then((response) => {
      $('#output-text').val(response[0])
    })
}

async function getNfts(params) {
  axios
    .post('/getNfts', {
      params: params,
    })
    .then((response) => {
      $('#output-text').val(JSON.stringify(response.data[0]))
    })
}

async function txNft(params) {
  axios
    .post('/txNft', {
      params: params,
    })
    .then((response) => {
      $('#output-text').val(response[0])
    })
}

async function addFile() {
  const reader = new FileReader()
  reader.onloadend = function () {
    const buf = buffer.Buffer.from(reader.result)
    axios
      .post('/addFile', {
        data: buf,
      })
      .then((response) => {
        $('#output-text').val(response.data.path)
      })
  }
  const file = document.getElementById('file')
  reader.readAsArrayBuffer(file.files[0])
}

async function addData(newData) {
  axios
    .post('/addData', {
      data: newData,
    })
    .then((response) => {
      $('#output-text').val(response.data.path)
    })
}

async function getData(cid) {
  axios
    .post('/getData', {
      data: cid,
    })
    .then((response) => {
      $('#output-text').val(response.data[0])
    })
}

async function getImage(cid) {
  axios
    .post('/getImage', {
      data: cid,
    })
    .then((response) => {
      $('#ipfs-image').attr(
        'src',
        `data:image/png;base64,${toBase64(response.data[0].data)}`,
      )
    })
}

function toBase64(arr) {
  arr = new Uint8Array(arr)
  return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ''))
}
