import express from 'express';

const app = express();
app.use(express.static("svg"));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));


const porta = process.env.PORT || 8080 

app.listen(porta, () =>{
    console.log('Server runing on port: '+porta)
})

const apikey = "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"

app.post("/back-end/api/openai", async (request, response) => {
    
    const data = request.body
    const options = {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${apikey} `
        },
        body: JSON.stringify(data)
    }
    const url = await fetch('https://api.openai.com/v1/chat/completions', options)
    const res = await url.json()

    response.json(res)
})

app.post("/back-end/api/v1/openai", async (request, response) => {
    
    const data = request.body
    const options = {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    }
    const url = await fetch('https://us-central1-chat-for-chatgpt.cloudfunctions.net/basicUserRequestBeta', options)
    const res = await url.json()

    response.json(res)
})

app.post("/back-end/api/v2/openai", async (request, response) => {
    
    const data = request.body
    const options = {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${apikey} `
        },
        body: JSON.stringify(data)
    }
    const url = await fetch('https://api.openai.com/v1/completions', options)
    const res = await url.json()

    response.json(res)
})