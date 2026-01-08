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
let ibi = 0;
let hr = 0;
let rmssd=0;
let sdnn=0;
let pns=0;
let sns=0;
let stress=0;

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
    const { alert } = req.body;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "neeljetti.nj@gmail.com",
        pass: "tjqt ljda ktyq upta",
      },
    });

    const message = `
🚨 ALERT FROM ESP32 🚨

📍 GPS DATA
Latitude  : ${lat || "No Fix"}
Longitude : ${log || "No Fix"}
Satellites: ${sat || 0}
Speed     : ${speed || 0} km/h

🧠 HEART & ANS DATA
Heart Rate : ${hr || "N/A"} bpm
IBI        : ${ibi || "N/A"} ms
RMSSD     : ${rmssd || "N/A"}
SDNN      : ${sdnn|| "N/A"}
PNS Index : ${pns || "N/A"}
SNS Index : ${sns || "N/A"}
Stress    : ${stress || "N/A"}

⚠️ SYSTEM STATUS
Alerts Count : ${alerts}
LED Status   : ${led.map((v, i) => `LED${i + 1}:${v ? "ON" : "OFF"}`).join(", ")}

🗺 Location Link:
${
  lat && log
    ? `https://maps.google.com/maps?q=${lat},${log}&z=15`
    : "No GPS Fix"
}

📝 Message:
${alert || "No custom alert message"}
`;

    await transport.sendMail({
      from: "ESP32 ALERT <neeljetti.nj@gmail.com>",
      to: alertEmails.join(","),
      subject: "🚨 ESP32 Health & Location Alert",
      text: message,
    });

    res.status(200).json({ success: true, message: "Mail sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mail sending failed" });
  }
});



app.post("/gps", async (req, res) => {
  const { latitude, logngitude, sati, speeds, IBI,HR,RMSSD,SDNN,PNS,SNS,Stress} = req.body;
  console.log("lat=", latitude);
  console.log("log=", logngitude);
  console.log("sat=", sati);
  console.log("speed=", speeds);
console.log(IBI)
console.log(HR)
console.log(RMSSD)
console.log(SDNN)
console.log(PNS)
console.log(SNS)
console.log(Stress)
  if (latitude && logngitude && sati && speeds&&IBI&&HR&&RMSSD&&SDNN&&PNS&&SNS&&Stress) {
    lat = latitude;
    log = logngitude;
    sat = sati;
    speed = speeds;
    ibi=IBI
    hr=HR
    rmssd=RMSSD
    sdnn=SDNN
    pns=PNS
    sns=SNS
    stress=Stress
  }

  res.status(200).json({ message: "GPS data updated" });
});

app.post("/data", (req, res) => {
  const { alert,  led1, led2, led3, led4 } = req.body;

  alerts = alert;

  led = [led1, led2, led3, led4];

  console.log({  alerts, led });

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

  res.status(200).json({ lat, log, heartrate,  spo2s, alerts, led,ibi,hr,rmssd,sdnn,pns,sns,stress });
});

app.listen(port, () => {
  console.log(`The server is running at port ${port}`);
});
