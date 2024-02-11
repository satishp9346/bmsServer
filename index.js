require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const {Schema}=mongoose;
const cors=require('cors');
const corsoptions={
    origin: [
        "https://bmspayment.vercel.app",
        "http://localhost:3000",
        "http://localhost:3002",
    ]
}

const app=express();
app.use(cors(corsoptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const PORT=process.env.PORT || 5000;


//CONNECT MONGO_DB
mongoose.set('strictQuery',false);
const connectDB=async ()=>{
    try{
        const conn =await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connnected : ${conn.connection.host}`);
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
}


//create SCHEMA
const schema=new Schema({
    id:Number,
    totalAmount:String,
    displayButton:Boolean,
    Name:String
},{versionKey:false});


const monmodel=mongoose.model("ticketdata",schema);


//GET 
app.get('/Getdata',async (req,res)=>{
    try{
        const data=await monmodel.find();
        console.log(data);
        res.send(data);
    }
    catch(err){
        console.log("Error: "+err.message)
    }
})

//PUT
app.put('/Updatedata/:id',async (req,res)=>{
    try{
        const updatedid=req.params.id;
        const updatedtotalAmount=req.body.totalAmount;
        const updateddisplayButton=req.body.displayButton;
        const updateName=req.body.Name;

        const result=await monmodel.findOneAndUpdate({id:updatedid},{$set:{totalAmount:updatedtotalAmount,displayButton:updateddisplayButton,Name:updateName}},
            {new:true})

        if(result==null){
            console.log("nothing found");
        }
        else{
            console.log(result);
            res.send(result)
        }
    }
    catch(err){
        console.log("Error(put) :"+err.message)
    }
})

connectDB().then(()=>{
    app.listen(PORT,()=>{console.log(`Listening on port ${PORT}`)})
})
