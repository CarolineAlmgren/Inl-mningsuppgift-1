const express = require("express");
const cors = require("cors");
const app = express();
const port = 3100;
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const rl = readline.createInterface({ input, output });
const { sequelize, RockBand } = require("./models");
const migrationhelper = require("./migrationhelper");
const { check } = require("express-validator");
const { Op } = require("sequelize");
const { validateCreateBand } = require("./validators/bandvalidator.js");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  })
);

async function main() {
  await migrationhelper.migrate();

  app.get("/api/rockbands", check("q").escape(), async (req, res) => {
    const sortCol = req.query.sortCol || "name";
    const sortOrder = req.query.sortOrder || "asc";
    const q = req.query.q || "";
    const offset = Number(req.query.offset || 0);
    const limit = Number(req.query.limit || 10);

    const allBands = await RockBand.findAll({
      where: {
        name: {
          [Op.like]: "%" + q + "%",
        },
      },
      order: [[sortCol, sortOrder]],
      offset: offset,
      limit: limit,
    });
    const result = allBands.map((p) => {
      return {
        id: p.id,
        name: p.name,
        from: p.from,
        founded: p.founded,
        albums: p.albums,
      };
    });
    return res.json(result);
  });

  //uppdatera ett band
  app.put("/api/rockbands/:id", validateCreateBand, async (req, res) => {
    const bandId = req.params.id; // Hämta bandets ID från URL:en
    try {
      // Hitta bandet med det angivna id:t i databasen
      let b = await RockBand.findOne({ where: { id: bandId } });
      console.log("Bandet hittades");

      // Uppdatera bandinformationen med den nya informationen från förfrågan
      b.name = req.body.name;
      b.from = req.body.from;
      b.founded = req.body.founded;
      b.albums = req.body.albums;

      // Spara de uppdaterade uppgifterna till databasen
      await b.save();

      // Returnera en bekräftelse
      res.status(204).send("Bandet uppdaterades");
    } catch (error) {
      console.error("Error updating band:", error);
      res.status(500).send("Något gick fel vid uppdatering");
    }
  });
}

// POST-rutt för att skapa ett nytt band
app.post("/api/rockbands", validateCreateBand, async (req, res) => {
  const { name, from, founded, albums } = req.body;
  console.log("Incoming request body:", req.body);

  // Här skapas det nya bandet i databasen
  const newBand = await RockBand.create({
    name: name,
    from: from,
    founded: founded,
    albums: albums,
  });
  // Returnera det nya bandet som JSON
  res.status(201).json(newBand);
});

// ge ett band med id
app.get("/api/rockbands/:id", async (req, res) => {
  const rockBand = await RockBand.findOne({ where: { id: req.params.id } });
  res.send(rockBand);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

(async () => {
  main();
})();
