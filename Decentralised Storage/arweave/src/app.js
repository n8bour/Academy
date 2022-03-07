const express = require('express');
const path = require('path');

const arweaveApi = require('../public/javascript/arweaveApi.js');

const app = express();
const PORT = 3001;

const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath, { extensions: ['html'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.get('', (req, res) => {
  res.sendFile(publicDirPath + "/arweave.html");
});

app.listen(PORT, () => {
  console.log('Server is up and running on http://127.0.0.1:' + PORT);
});

app.post('/getBalance', (req, res) => {
  arweaveApi
    .getBalance(req.body.data)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post('/addData', (req, res) => {
  arweaveApi
    .addData(req.body.data)
    .then((response) => {
      console.log(response);
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post('/getTxStatus', (req, res) => {
  arweaveApi
    .getTxStatus(req.body.data)
    .then((response) => {
      console.log(response);
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post('/getData', (req, res) => {
  arweaveApi
    .ipfsGet(req.body.data)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post('/getImage', (req, res) => {
  arweaveApi
    .ipfsGetImage(req.body.data)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post('/addFile', (req, res) => {
  arweaveApi
    .addFile(req.body.data)
    .then((response) => {

      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});