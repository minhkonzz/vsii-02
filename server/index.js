const { API_URL } = require("./constants");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const axios = require("axios");
const cors = require("cors");

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

const errors = {
  "err_timeout": {
    statusCode: 408,
    message: "(Timeout) Server took a long time to respond. Please try again later"
  },
  "err_service_unavailable": {
    statusCode: 503,
    message: "Service Unavailable"
  },
  "err_internal_server": {
    statusCode: 500,
    message: "Internal Server Error"
  }
}

app.get("/api/v2/breeds", async (req, res) => {
  // Random key of "errors" or will be undefined for success request
  const errorKeys = Object.keys(errors);
  // const randomKey = errorKeys[Math.floor(Math.random() * errorKeys.length + 1)];
  const randomKey = undefined;

  try {
    const { page } = req.query;
    const pageNumber = page ? parseInt(page) : 1;

    // Simulate delay for tracking
    await new Promise((resolve) => setTimeout(resolve, 6000));
    
    if (!randomKey) {
      // Call external API
      console.log("\n" + "Request Dog API")
      const response = await axios.get(`${API_URL}?page[number]=${pageNumber}`);
      res.json(response.data);
      return;
    }

    if (randomKey == "err_timeout") {
      // Simulate delay for timeout error
      console.log("\n" + randomKey);
      await new Promise((resolve) => setTimeout(resolve, 10000)); // request takes more 10 seconds
      return;
    }

    throw new Error(randomKey);

  } catch (error) {
    const errorKey = error.message;
    if (errors[errorKey]) {
      console.log("\n" + errorKey);
      const { statusCode, message } = errors[errorKey];
      return res.status(statusCode).json({ message });
    }
    console.log("ExpressJS disconnected from internet, cannot request to Dog API");
    res.status(500).json({ message: "Failed to fetch breeds. Please try again later" });
  }
});

// Unknown error handling middleware
app.use((err, req, res, next) => {
  console.log("global error")
  console.error(err.stack);
  const { statusCode, message } = errors.err_internal_server;
  res.status(statusCode).json({ message });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
