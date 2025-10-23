const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const sid='AC3a751924113de4fecdd041303c11bca2'
const token='2ce5d744098035fd03b9d552aab95444'
const twilio=require('twilio')
const client=twilio(sid,token)
const port = 3001;
let lat=0
let log=0
let sat=0
let speed=0

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.post("/mail", async (req, res) => {
  try {

    const { alert,heart_rate,spo2 } = req.body;
    console.log("alert=",alert)
    console.log("heart=",heart_rate)
    console.log("spo2=",spo2)

    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "alimilidurgacharan@gmail.com",
        pass: "usxi rswa qmih lalg", 
      },
    });

    await transport.sendMail({
      from: "alimilidurgacharan@gmail.com",
      to: "cyrildavid1234@gmail.com",
      subject: "🚨 resberry pi ALERT!",
      text: `${alert || 'Alert from ESP32'}\nHeart Rate: ${heart_rate || 'N/A'}\nSpO2: ${spo2 || 'N/A'}\nlatitude:${lat||"no fix"}\nlogngitude:${log||"no fix"}\ncount:${sat||"no fix"}\nspeed:${speed||"no fix"}`|| "Alert from ESP32", 
    });

    console.log("Mail sent with cause:", alert);
   try{
     await client.messages.create({
      body:`${alert || 'Alert from ESP32'}\nHeart Rate: ${heart_rate || 'N/A'}\nSpO2: ${spo2 || 'N/A'}\nlatitude:${lat||"no fix"}\nlogngitude:${log||"no fix"}\ncount:${sat||"no fix"}\nspeed:${speed||"no fix"}`|| "Alert from ESP32",
      from:"+12765215799",
      to:"+917815999960"
    })
    console.log("sms send 🥳")
   }catch(e){
    console.log("sms is not send 😥",e)
   }
    res.status(200).json({ message: "Mail sent", cause: alert });
   
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ message: "Error sending mail", error: err.message });
  }
});
app.post("/gps",async(req,res)=>{
  const {latitude,logngitude,sati,speeds}=req.body;
  console.log("lat=",latitude)
  console.log("log=",logngitude)
  console.log("sat=",sati)
  console.log("speed=",speeds)
if(latitude&&logngitude&&sati&&speeds){
  lat=latitude
  log=logngitude
  sat=sati
speed=speeds
}
  // let transport=nodemailer.createTransport({
  //   service:"gmail",
  //   auth:{
  //     user:"shaikno150@gmail.com",
  //     pass:"ubvb xmif edli lrwa",
  //   }

  // })
  // await transport.sendMail({
  //   from:"shaikno150@gmail.com",
  //   to:"cyrildavid1234@gmail.com",
  //   subject: "🚨 resberry pi ALERT!",
  //     text: `${heart || 'Alert from ESP32'}`, 
  // })
})

app.listen(port, () => {
  console.log(`The server is running at port ${port}`);
});