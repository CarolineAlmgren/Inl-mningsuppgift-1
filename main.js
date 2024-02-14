/*const express = require("express");
const cors = require("cors");
const app = express();
const port = 3100;*/
//const rockbands = require("./rockbands");
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const rl = readline.createInterface({ input, output });
const { sequelize, RockBand } = require("./models");
const migrationhelper = require("./migrationhelper");
//const Rockband = require('./models/rockband');

async function listAll() {
  const rockbands = await RockBand.findAll();
  for (const bnd of rockbands) {
    console.log("************************");
    console.log("ID:", bnd.id);
    console.log("Name:", bnd.name);
    console.log("From:", bnd.from);
  }
}

async function createNew() {
  console.log("** NEW ** ");
  const name = await rl.question("Name:");
  const from = await rl.question("From:");
  const founded = await rl.question("Founded:");
  const albums = await rl.question("Albums:");

  await RockBand.create({
    name: name,
    from: from,
    founded: parseInt(founded),
    albums: albums,
  });

  console.log("Bandet har lagts till!");
}

async function main() {
  await migrationhelper.migrate();

  /*const theName = await Rockband.findOne({
    where: {id:1}
  })
  const bandFrom = await Rockband.findOne({
    where: {id:1}
  })

  const bandFounded = await Rockband.findOne({
    where: {id:1}
  })

  const bandAlbum = await Rockband.findOne({
    where: {id:1}
  })

  theName.name = 'Broder Daniel'
  await theName.save();

  bandFrom.from = 'Sweden'
  await bandFrom.save();

  bandFounded.founded = 1997
  await bandFounded.save();

  bandAlbum.albums = 3
  await bandAlbum.save();*/

  while (true) {
    console.log("1. Lista alla band");
    console.log("2. Skapa ett band");
    console.log("3. Uppdatera");
    console.log("4. Ta bort ett band");
    console.log("9. Avsluta");

    const sel = await rl.question("Val:");
    if (sel == "1") {
      await listAll();
    }
    if (sel == "2") {
      await createNew();
    }
    if (sel == "3") {
      updateOne();
    }
    if (sel == "4") {
      deleteOne();
    }
    if (sel == "9") {
      break;
    }
  }
}
(async () => {
  main();
})();

/*app.use(cors());

app.get("/api/rockbands", async (req, res) => { // Ändra här för att använda rockband istället för rockbands
  const rockbandsList = await rockband.findAll();
  res.json(rockbandsList);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});*/
