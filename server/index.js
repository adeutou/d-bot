import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from "openai";
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';


dotenv.config();


const configuration = new Configuration({
    organization: "org-QkE6bRQ2bMqGv16rsRcjuNbV",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



// Create a simple express api that calls the function above
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3300;

app.post('/', async (req, res) => {
    const { message, currentModel } = req.body;
    
    const response = await openai.createCompletion ({
        model: `${currentModel}`,//"text-davinci-003",
        prompt:`${message}`,
        max_tokens: 100,
        temperature: 0.5,
    });

    //console.log(response.data.choices[0].text);
    res.json({
        message: response.data.choices[0].text,
    });
});

app.get('/models', async (req, res) => {
    const response = await openai.listEngines();
    //console.log(response.data.data);
    res.json({
        models: response.data.data
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});