import express from "express";
import * as dotenv from "dotenv";
const app = express();
import dou from "./dou.js";
import path from "path";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import schedule from "node-schedule";

dotenv.config();

//CRIANDO REGRA PARA AGENDAR SCRAPING
const regra = new schedule.RecurrenceRule();
regra.dayOfWeek = [new schedule.Range(1, 5)];
regra.hour = 2;
regra.second = 30;
//AGENDANDO SCRAPING PARA 2:00
const scraping_dou = schedule.scheduleJob(regra, async function () {
  console.log("Realizando Scrapimg DOU diário.");
  await dou();
  console.log("Scraping DOU realizado..");
});

//CHAMANDO CLUSTER PARA REALIZAR O PRIMEIRO SCRAPING
try {
  (async function () {
    await dou();
    console.log("Continua executando Server na porta 8081.");
  })();
} catch (error) {
  console.log("Scraping falhou");
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.static("public"));

app.get("/", (req, res, next) => {
  res.send("Scraping Funcionando!");
});

app.post("/sei", (req, res, next) => {
  res.send("Scraping Funcionando!");
});

const port = process.env.PORT;

app.listen(8081, () => {
  console.log(`App up and running on http://localhost:8081`);
});
