import express from 'express';
import Datastore from'nedb';

const getData = new Datastore({ filename: 'userToken.db', autoload: true });


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




app.post("/getUserInfo", async (request, response) => {
    const data = request.body.ip

    getData.find({IP: data}, (err, data) => {
            if (data.length == 1) {
                response.json({userInfo: data[0]})
            } else {
                createUser()
            }
    })

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    const randomId = makeid(7)

    function createUser() {
        getData.insert({IP: data, message: 5, userID: randomId})
        response.json({userInfo: {msg: 'User Created!', IP: data, message: 5, userID: randomId}})
    }
})


app.post("/back-end/api/gpt-4", async (request, response) => {
    const data = request.body

    const query = { IP: data.ip };
    

    getData.find({IP: data.ip}, (err, data) => {
        if (data.length == 1) {
            
            if (data[0].message <= 0) {

                const error = { error: { message: 'Insufficient tokens. Please purchase more credits or tokens to continue using the service.'} };
                response.status(404).json(error);
            } else {
                
                const update = { $set: { message: data[0].message - 1 } };
                getData.update(query, update, {}, (err, numReplaced) => {
                    if (err) {
                      console.error(err);
                    } else {
                        
                    }
                  });
                  
                  sendGPT4()
            }

        } else {
            const error = { error: { message: 'User not found!' } };
            response.status(404).json(error);
        }
    })


    async function sendGPT4() {

    const datas = {model: "gpt-4", messages: data.messages}
    const options = {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${apikey} `
        },
        body: JSON.stringify(datas)
    }
    const url = await fetch('https://api.openai.com/v1/chat/completions', options)
    const res = await url.json()

    response.json(res)
    }
})
