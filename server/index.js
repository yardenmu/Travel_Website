import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import * as path from 'path';
import { getQuery } from './DataBase/database.js'

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname , '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());



app.post("/submit", async (req,res)=>{
    try{
        const result = await getQuery(req.body);
        res.json(result);
    } catch (error) {
        console.error("Error in getQuery:", error);
        res.status(500).json({ error: "Something went wrong", details: error });
    }
});

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});