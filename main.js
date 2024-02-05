const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const rockbands = require("./rockbands");

app.use(cors());

app.get("/api/rockbands", (req, res) => {
  res.json(rockbands);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*app.post('/api/rockbands', (req, res) => {
  const emp = {
    name: req.body.name,
  }
})*/
