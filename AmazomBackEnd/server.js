require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const router = express.Router();
const { logger, logEvents } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieparser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const Order = require("./model/Order");

const server = http.createServer(app);
const io = socketIo(server, { cors: corsOptions });
const PORT = process.env.PORT || 3600;

const socketService = require("./services/socketService");
socketService.initialize(io);

connectDB();

app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.options("*", cors());

//built-in for handling form data
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
//app.use(express.urlencoded({ extended: false }));

// for json
app.use(express.json());

app.use(cookieparser());

//for static files services
app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/api/register"));
app.use("/auth", require("./routes/api/auth"));
app.use("/refresh", require("./routes/api/refresh"));
app.use("/logout", require("./routes/api/logout"));
//app.use("/logout", require("./routes/api/logout"));

app.use("/product", require("./routes/api/product"));
app.use("/orders", require("./routes/api/orders"));
//app.use("/staff", require("./routes/api/staff"));
//app.use("/product", require ("./routes/api/product"))

app.use(verifyJWT);
app.use("/upload", require("./routes/api/upload"));
app.use("/users", require("./routes/api/users"));

//app.use("/upload", require("./routes/api/upload"))
app.use("/paystack", require("./routes/api/paystack"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.all("/*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found here" });
  } else {
    res.type("txt").send("404 Not Found here");
  }
});

app.use(errorHandler);
// WebSocket connection

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  server.listen(PORT, () => console.log(`server ruig o ${PORT}`));
});
