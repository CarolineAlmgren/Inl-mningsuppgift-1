const express = require("express");
const cors = require("cors");
const app = express();
const port = 3100;
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const rl = readline.createInterface({ input, output });
const { sequelize, RockBand } = require("./models");
const migrationhelper = require("./migrationhelper");
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');
//const Rockband = require('./models/rockband');

app.use(express.json());
app.use(cors({
  origin:"http://localhost:5500",
  credentials:true 
}))


app.get('/api/rockbands', check('q').escape() , async(req,res)=>{
  const sortCol =  req.query.sortCol || 'name';
  const sortOrder =  req.query.sortOrder || 'asc';
  const q = req.query.q ||'';
  const offset =  Number(req.query.offset || 0);
  const limit =  Number(req.query.limit || 10);

  // if(req.query.sortCol === undefined){
  //     sortCol = 'id'
  // }else{
  //     sortCol = req.query.sortCol
  // }

  const allBands = await RockBand.findAll({
      where:{
          name:{
             [Op.like]: '%' + q + '%'
          }
      },
      order: [ 
          [sortCol, sortOrder]
       ],
       offset: offset,
       limit: limit
  })
  const result = allBands.map(p=>{
      return {
         id: p.id,
         name: p.name,
         from: p.from,
         founded: p.founded,
         albums: p.albums
     }
  })
  return res.json(result)
})


//I terminalen
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

// POST-rutt för att skapa ett nytt band
app.post("/api/rockbands", async (req, res) => {
    const { name, from, founded, albums } = req.body;

    // Här skapas det nya bandet i databasen
    const newBand = await RockBand.create({
      name: name,
      from: from,
      founded: founded,
      albums: albums,
    
    });
    // Returnera det nya bandet som JSON-svar
    res.status(201).json(newBand);
  })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
