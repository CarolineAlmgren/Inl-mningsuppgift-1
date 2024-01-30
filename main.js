const express = require("express");
const cors = require("cors");
const app = express();
const port = 4500;
const rockbands = require('./rockbands');

app.use(cors());

app.get('/api/rockbands/:name', (req, res) => {
  console.log(req.params.name);
  let result = rockbands.find(band => band.name == req.params.name); 
  console.log('Result:', result)
  if (result === undefined) { 
    console.log('Band not found')
    res.status(404).send("Finns inte");
  } else {
    res.json(result);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


/*app.post('/api/rockbands', (req, res) => {
  const emp = {
    name: req.body.name,
  }
})*/