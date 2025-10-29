const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const sid = "AC3a751924113de4fecdd041303c11bca2";
const token = "43a048aadb422bf8c405f3d7fa74acd";
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

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.post("/mail", async (req, res) => {
  try {
    const { alert, heart_rate, spo2 } = req.body;
    console.log("alert=", alert);
    console.log("heart=", heart_rate);
    console.log("spo2=", spo2);

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "alimilidurgacharan@gmail.com",
        pass: "usxi rswa qmih lalg",
      },
    });

    await transport.sendMail({
      from: "alimilidurgacharan@gmail.com",
      to: "cyrildavid1234@gmail.com",
      subject: "🚨 Raspberry Pi ALERT!",
      text:
        `${alert || "Alert from ESP32"}\nHeart Rate: ${heart_rate || "N/A"}\nSpO2: ${
          spo2 || "N/A"
        }\nlatitude:${lat || "no fix"}\nlongitude:${log || "no fix"}\ncount:${
          sat || "no fix"
        }\nspeed:${speed || "no fix"}\ngps:${
          lat && log
            ? `https://maps.google.com/maps?q=${lat},${log}&z=15`
            : "no fix"
        }`,
    });

    console.log("Mail sent with cause:", alert);

    try {
      await client.messages.create({
        body:
          `${alert || "Alert from ESP32"}\nHeart Rate: ${
            heart_rate || "N/A"
          }\nSpO2: ${spo2 || "N/A"}\nlatitude:${lat || "no fix"}\nlongitude:${
            log || "no fix"
          }\ncount:${sat || "no fix"}\nspeed:${speed || "no fix"}\ngps:${
            lat && log
              ? `https://maps.google.com/maps?q=${lat},${log}&z=15`
              : "no fix"
          }`,
        from: "+12765215799",
        to: "+917815999960",
      });
      console.log("SMS sent 🥳");
    } catch (e) {
      console.log("SMS not sent 😥", e);
    }

    res.status(200).json({ message: "Mail sent", cause: alert });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ message: "Error sending mail", error: err.message });
  }
});

app.post("/gps", async (req, res) => {
  const { latitude, logngitude, sati, speeds } = req.body;
  console.log("lat=", latitude);
  console.log("log=", logngitude);
  console.log("sat=", sati);
  console.log("speed=", speeds);

  if (latitude && logngitude && sati && speeds) {
    lat = latitude;
    log = logngitude;
    sat = sati;
    speed = speeds;
  }

  res.status(200).json({ message: "GPS data updated" });
});

app.post("/data", (req, res) => {
  const { alert, heart_rate, spo2, led1, led2, led3, led4 } = req.body;

  alerts = alert;
  spo2s = spo2;
  heartrate = heart_rate;
  led = [led1, led2, led3, led4]; // store all LED states in array

  console.log({ lat, log, alerts, heartrate, spo2s, led });

  res.status(200).json({ message: "Data received" });
});

app.get("/get_data", (req, res) => {
  console.log("sending data");
  // let lat = 0;
// let log = 0;
// let sat = 0;
// let speed = 0;
// let alerts = 0;
// let led = [false, false, false, false];
// let heartrate = 0;
// let spo2s = 0;
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
