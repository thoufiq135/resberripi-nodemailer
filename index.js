const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const sid='AC3a751924113de4fecdd041303c11bca2'
// ----last-d---
const token='43a048aadb422bf8c405f3d7fa74acd'
const twilio=require('twilio')
const client=twilio(sid,token)
const port = 3001;
let lat=0
let log=0
let sat=0
let speed=0
let alerts=0
let led1s=false
let led2s=false
let led3s=false
let led4s=false
let heartrate=0
let spo2s=0

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
      text: `${alert || 'Alert from ESP32'}\nHeart Rate: ${heart_rate || 'N/A'}\nSpO2: ${spo2 || 'N/A'}\nlatitude:${lat||"no fix"}\nlogngitude:${log||"no fix"}\ncount:${sat||"no fix"}\nspeed:${speed||"no fix"}\ngps:${lat&&log?`https://maps.google.com/maps?q=${lat},${log}&z=15`:"no fix"}`|| "Alert from ESP32", 
    });

    console.log("Mail sent with cause:", alert);
   try{
     await client.messages.create({
      body:`${alert || 'Alert from ESP32'}\nHeart Rate: ${heart_rate || 'N/A'}\nSpO2: ${spo2 || 'N/A'}\nlatitude:${lat||"no fix"}\nlogngitude:${log||"no fix"}\ncount:${sat||"no fix"}\nspeed:${speed||"no fix"}\ngps:${lat&&log?`https://maps.google.com/maps?q=${lat},${log}&z=15`:"no fix"}`|| "Alert from ESP32",
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
app.post("/data",(req,res)=>{
  
    const { alert,heart_rate,spo2,led1,led2,led3,led4 } = req.body;

      console.log(alert)
      console.log(heart_rate)
      console.log(spo2)
      console.log(led1)
      console.log(led2)
      console.log(led3)
      console.log(led4)

      alerts=alert
      spo2s=spo2
      heartrate=heart_rate
      led1s=true
      led2s=true
      led3s=true
      led4s=true 
      if(lat&log){
        console.log(lat)
        console.log(log)
      }else{
        console.log("gps no fix")
      }
      res.status(200).json({message:"data recived"})     
   
      // led1s=false
      // led2s=false
      // led3s=false
      // led4s=false
  
    
})

app.listen(port, () => {
  console.log(`The server is running at port ${port}`);
});