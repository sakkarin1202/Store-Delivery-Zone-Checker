const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const frotend_url = process.env.FRONTEND_URL;
const corsOption = {
  origin: frotend_url,
};
const app = express();
app.use(cors(corsOption));
//List Of stores
const stores = require("./store");
console.log(stores);

app.get("/api/stores",(req,res)=>{
  res.json(stores)
})



app.get("/", (req, res) => {
  res.send("<h1>Welcom to API For Store Delivery Zone Checker</h1>");
});

app.listen(PORT, () => {
  console.log("Listening to http://localhost:" + PORT);
});
