const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 2000;
require("dotenv").config();




mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.iggwk.mongodb.net/task1`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const userRouter = require("./routes/userRoute");
  const eventRouter = require("./routes/eventRouter");
  app.use("/api/user", userRouter);
  app.use("/api/event", eventRouter);

  
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
