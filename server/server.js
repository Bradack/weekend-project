const express = require('express');
const bodyParser = require('body-parser');
const cntrlr = require('./resources/controller.js')


const app = express();
app.use(bodyParser.json());
// app.use(express.static( __dirname + "/../src/index.js") );

const PORT = 3333;
const DATA_ADDRESS = '/api/cg/';
const ACT_ADDRESS = '/api/act/';


// app.get(`${DATA_ADDRESS}:id`, cntrlr.readProd);

app.post(`${ACT_ADDRESS}:name`, cntrlr.postSave);

app.get(`${ACT_ADDRESS}:name`, cntrlr.getSave);

app.put(`${ACT_ADDRESS}:name`, cntrlr.updateSave);

app.listen(PORT, () => {
    console.log('Something lurks on port', PORT)
});