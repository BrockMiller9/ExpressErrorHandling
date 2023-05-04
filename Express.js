const express = require("express");
const app = express();
const ExpressError = require("./ExpressError");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/mean", (req, res) => {
  if (!req.query.nums) {
    throw new ExpressError(
      "You must pass a query key of nums with a comma-separated list of numbers.",
      400
    );
  }
  const nums = req.query.nums.split(",");
  const mean = nums.reduce((acc, cur) => acc + Number(cur), 0) / nums.length;
  res.send(`The mean is ${mean}`);
});

app.get("/median", (req, res) => {
  if (!req.query.nums) {
    throw new ExpressError(
      "You must pass a query key of nums with a comma-separated list of numbers.",
      400
    );
  }
  const nums = req.query.nums.split(",");
  const median = nums.sort((a, b) => a - b)[Math.floor(nums.length / 2)];
  res.send(`The median is ${median}`);
});

app.get("/mode", (req, res) => {
  if (!req.query.nums) {
    throw new ExpressError(
      "You must pass a query key of nums with a comma-separated list of numbers.",
      400
    );
  }
  const nums = req.query.nums.split(",");
  const mode = nums.reduce((acc, cur) => {
    if (acc[cur]) {
      acc[cur] += 1;
    } else {
      acc[cur] = 1;
    }
    return acc;
  }, {});
  const modeNum = Object.keys(mode).reduce((acc, cur) =>
    mode[acc] > mode[cur] ? acc : cur
  );
  res.send(`The mode is ${modeNum}`);
});

app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

app.use((error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message;
  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
