const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const requestLogger = require("./middlewares/requestLogger");

const app = express();
app.use(express.json());
const port = 5000;

const cors = require("cors");
app.use(cors({ origin: "*" }));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://userdatabase:userdatabase@cluster0.7a1bo2g.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// Apply middleware globally
app.use(requestLogger);

// Apply middleware to specific routes
// app.use('/api/users', requestLogger); // Apply to all user routes

// Routes
app.use("/api", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
