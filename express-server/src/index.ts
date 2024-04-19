import express from 'express'
import {createClient} from 'redis'

const app=express();
app.use(express.json());

const client = createClient();
client.on('error' ,(err:unknown) => console.log('Redis Client error',err)); 

app.post('/submit',async(req,res)=>{
    const problemId=req.body.problemId;
    const code=req.body.code;
    const language=req.body.language;

    try {
        await client.lPush("problems",JSON.stringify({code,language,problemId}))
        res.status(200).send("Submission recieved and stored.")
    }catch(error){
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission");
    }
})

const startServer = async () => {
    try{
        await client.connect();
        console.log("Redis connected !");

        app.listen("3000",()=>{
            console.log("Server listening on port 3000")
        })
    }catch(error){
        console.error("Failed to connect to Redis",error)
    }

}

startServer();