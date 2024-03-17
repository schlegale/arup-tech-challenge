const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "upload");
fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect("mongodb://localhost/inspectabledb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(
  fileUpload({
    limits: { fileSize: 10000000 }, // 10 MB
    abortOnLimit: true,
  })
);

const IssueSchema = new mongoose.Schema({
  id: String,
  title: String,
  floor: String,
  area: String,
  discipline: String,
  type: String,
  files: [
    {
      name: String,
      type: String,
      uri: String,
    },
  ],
});

const Issue = mongoose.model("Issue", IssueSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/issues", async (req, res) => {
  try {
    const issues = await Issue.find({});
    res.json(issues);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/issues", async (req, res) => {
  const { id, title, floor, area, discipline, type } = req.body;
  let attachments = [];

  console.log("/issues: ", req.files);

  if (req.files) {
    const filePromises = Object.keys(req.files).map((key) => {
      const file = req.files[key];
      const filePath = path.join(uploadDir, file.name);

      return file.mv(filePath).then(() => {
        attachments.push({
          filename: file.name,
          path: filePath.replace(__dirname, ""),
        });
      });
    });

    // Wait for all file upload promises to resolve
    try {
      await Promise.all(filePromises);
    } catch (err) {
      console.error("Error saving files:", err);
      return res.status(500).send("Error saving files.");
    }
  }

  try {
    const newIssue = new Issue({
      id,
      title,
      floor,
      area,
      discipline,
      type,
      attachments,
    });

    await newIssue.save();
    res.status(201).send("Issue created successfully.");
  } catch (err) {
    console.error("Error saving the issue:", err);
    res.status(500).send("Error saving the issue.");
  }
});

app.get("/next-issue-id", async (req, res) => {
  try {
    const lastIssue = await Issue.findOne().sort({ id: -1 });
    const nextIssueId = lastIssue ? parseInt(lastIssue.id) + 1 : 1;
    res.json({ nextIssueId: nextIssueId.toString().padStart(3, "0") });
  } catch (error) {
    console.error("Error fetching the next issue ID:", error);
    res.status(500).send("Error fetching the next issue ID");
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
