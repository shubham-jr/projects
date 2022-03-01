const mongoose = require("mongoose");
const cors = require("cors");
const app = require("./app.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
const port = process.env.PORT;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("database connected....");
  })
  .catch((err) => {
    console.log(err);
  });

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.listen(port, "127.0.0.1", () => {
  console.log(`listening on port ${port}`);
});
