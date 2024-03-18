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

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  uri: { type: String, required: true },
});

const IssueSchema = new mongoose.Schema({
  id: String,
  title: String,
  floor: String,
  area: String,
  discipline: String,
  type: String,
  files: { type: [fileSchema], default: [] },
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
  let files = [];

  if (req.files) {
    let uploadedFiles = req.files.files;
    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }

    const filePromises = uploadedFiles.map((file, index) => {
      const newFileName = `${id}.${index}.jpg`;
      const filePath = path.join(uploadDir, newFileName);

      return file.mv(filePath).then(() => {
        files.push({
          name: file.name,
          type: file.mimetype,
          uri: `/uploads/${newFileName}`,
        });
      });
    });

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
      files,
    });

    await newIssue.save();
    res.status(201).send("Issue created successfully.");
  } catch (err) {
    console.error("Error saving the issue:", err);
    res.status(500).send("Error saving the issue.");
  }
});

app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
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
