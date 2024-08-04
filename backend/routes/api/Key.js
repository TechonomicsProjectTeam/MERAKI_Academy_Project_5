const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/get-api-key", (req, res) => {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  if (apiKey) {
    res.json({ apiKey });
  } else {
    res.status(500).json({ error: "API key not found" });
  }
});

module.exports = apiRouter;
