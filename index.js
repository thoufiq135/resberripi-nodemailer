const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const sid = "ACd79faba01aec4fcbadc182a63f1eaf14";
const token = "2c600c6d0618f3990022037f1d7caa6a";
const client = twilio(sid, token);

const port = 3001;

let lat = 0;
let log = 0;
let sat = 0;
let speed = 0;
let alerts = 0;
let led = [false, false, false, false];
let heartrate = 0;
let spo2s = 0;
let alertEmails = [
  "shaikno150@gmail.com",
  "cyrildavid1234@gmail.com",
  "arunajetti.aj@gmail.com",
  "n23092399@gmail.com",
  "mundlapudiniharreddy@gmail.com",
  
];

let alertPhones = [
  "+919346292757"
];
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.post("/mail", async (req, res) => {
  try {
    const { alert} = req.body;


    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "neeljetti.nj@gmail.com",
        pass: "tjqt ljda ktyq upta",
      },
    });

    const message = `${alert || "Alert from ESP32"}\nHeart Rate: ${
      heartrate || "N/A"
    }\nSpO2: ${spo2s || "N/A"}\nlatitude:${lat || "no fix"}\nlongitude:${
      log || "no fix"
    }\ngps:${
      lat && log
        ? `https://maps.google.com/maps?q=${lat},${log}&z=15`
        : "no fix"
    }`;

  
    for (const mail of alertEmails) {
      await transport.sendMail({
        from: "alimilidurgacharan@gmail.com",
        to: mail,
        subject: "🚨 Raspberry Pi ALERT!",
        text: message,
      });
      console.log("Mail sent to:", mail);
    }

    for (const num of alertPhones) {
      try {
        await client.messages.create({
          body: message,
          from: "+15073354424",
          to: num,
        });
        console.log("SMS sent to:", num);
      } catch (e) {
        console.log(`SMS not sent to ${num}`, e);
      }
    }

    res.status(200).json({ message: "Alerts sent", cause: alert });

  } catch (err) {
    console.error("Error sending alerts:", err);
    res.status(500).json({ message: "Error sending alerts", error: err.message });
  }
});


app.post("/gps", async (req, res) => {
  const { latitude, logngitude, sati, speeds,heart_rate,spo2 } = req.body;
  console.log("lat=", latitude);
  console.log("log=", logngitude);
  console.log("sat=", sati);
  console.log("speed=", speeds);
console.log(heartrate)
console.log(spo2)
  if (latitude && logngitude && sati && speeds) {
    lat = latitude;
    log = logngitude;
    sat = sati;
    speed = speeds;
    spo2s=spo2
    heartrate=heart_rate
  }

  res.status(200).json({ message: "GPS data updated" });
});

app.post("/data", (req, res) => {
  const { alert, heart_rate, spo2, led1, led2, led3, led4 } = req.body;

  alerts = alert;
  spo2s = spo2;
  heartrate = heart_rate;
  led = [led1, led2, led3, led4];

  console.log({ lat, log, alerts, heartrate, spo2s, led });

  res.status(200).json({ message: "Data received" });
});

app.get("/get_data", (req, res) => {
  console.log("sending data");
 
  console.log(lat)
  console.log(log)
  console.log(alerts)
  console.log(led)
  console.log(heartrate)
  console.log(spo2s)

  res.status(200).json({ lat, log, heartrate, spo2: spo2s, alerts, led });
});

app.listen(port, () => {
  console.log(`The server is running at port ${port}`);
});
