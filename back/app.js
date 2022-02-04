const { json } = require("express");
const express = require("express");
const app = express();

const mintalytics_script = require("./scripts/mintalytics_script");

app.use(express.json());

const threads = [];

app.post("/start", (req, res) => {
  console.log(req.body);
  req.body.interval = setInterval(() => {
    mintalytics_script.script();
  }, 2000);
  //   threads.push([
  //     setInterval(() => {
  //       console.log(`thread number ${req.query.number}`);
  //     }, 2000),
  //     req.query.number,
  //   ]);
  return res.send("added");
});

app.delete("/stop", (req, res) => {
  const interval = threads.find((thread) => thread[1] === req.query.number);
  threads.splice(threads.indexOf(interval), 1);
  clearInterval(interval[0]);
  console.log(threads.length);
  res.send("cleared");
});

app.listen(3005, () => {
  console.log("listening on 3005");
});
