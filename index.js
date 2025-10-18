const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser"); 
const port = 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.post("/mail", async (req, res) => {
  try {

    const { alert } = req.body;

    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "durgacharancse.gist@gmail.com",
        pass: "pbqd cvkq nekt mobr", 
      },
    });

    await transport.sendMail({
      from: "durgacharancse.gist@gmail.com",
      to: "durgacharan@gmail.com",
      subject: "🚨 ESP32 ALERT!",
      text: alert || "Alert from ESP32", 
    });

    console.log("Mail sent with cause:", alert);
    res.status(200).json({ message: "Mail sent", cause: alert });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ message: "Error sending mail", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`The server is running at port ${port}`);
});
