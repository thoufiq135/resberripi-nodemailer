const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const sid= 'AC3a751924113de4fecdd041303c11bca2'
const token='e2605ed428153dfd28040da4337cd33d'
const twilio=require('twilio')(sid,token)

const port = 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.post("/mail", async (req, res) => {
  try {

    const { alert,heart_rate,spo2 } = req.body;

    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shaikno150@gmail.com",
        pass: "ubvb xmif edli lrwa", 
      },
    });

    await transport.sendMail({
      from: "shaikno150@gmail.com",
      to: "alimilidurgacharan@gmail.com",
      subject: "🚨 resberry pi ALERT!",
      text: `${alert || 'Alert from ESP32'}\nHeart Rate: ${heart_rate || 'N/A'}\nSpO2: ${spo2 || 'N/A'}`|| "Alert from ESP32", 
    });

    console.log("Mail sent with cause:", alert);
   try{
     await twilio.messages.create({
      body:"resberry-pi alert",
      from:"+12765215799",
      to:"+917815999960"
    })
    console.log("mail send 🥳")
   }catch(e){
    console.log("sms is not send 😥",e)
   }
    res.status(200).json({ message: "Mail sent", cause: alert });
   
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ message: "Error sending mail", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`The server is running at port ${port}`);
});
