const express = require("express");
const app = express();
require("dotenv").config();
const StoreRouter = require("./routers/store.router");
const PORT = process.env.PORT || 5000;
const authController = require("./routers/auth.router");
const db = require("./models/");
const role = db.Role;
const cors = require("cors");
const stores = require("./store");

const corsOption = {
    origin: "http://localhost:5173",
};

//dev mode
// db.sequelize.sync({ force: true }).then(() => {
//     initRole();
//     console.log("Drob and sync DB");
// });

const initRole = () => {
    role.create({ id: 1, name: "user" });
    role.create({ id: 2, name: "moderator" });
    role.create({ id: 3, name: "admin" });
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

// console.log(stores);
app.get("/api/stores",(req,res)=>{
    res.json(stores)
  })
app.use("/api/v1/store", StoreRouter); 
app.use("/api/v1/auth", authController);
app.get("/", (req, res) => {
    res.send("<h1>Hello Store Api</h1>");
});
app.listen(PORT, () => {
    console.log("Listenig to http://localhost:" + PORT);
});