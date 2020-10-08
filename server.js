require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const PORT = 8000;
const PORT = process.env.PORT || 8000;
const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`,
];
const POKEDEX = require("./pokedex.json");

// process.env.NODE_ENV
const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "dev";

app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());
app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized Request" });
  }

  next();
});

app.get("/types", handleGetTypes);
app.get("/pokemon", handleGetPokemon);

function handleGetTypes(req, res) {
  res.json(validTypes);
}

function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;

  if (req.query.name) {
    response = response.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(req.query.name.toLowerCase());
    });
  }

  if (req.query.type) {
    response = response.filter((pokemon) =>
      pokemon.type.includes(req.query.type)
    );
  }

  res.json(response);
}

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
