import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

dotenv.config();

app.post("/authenticate", async (req,res) => {
    const { username } = req.body;

    try {
        const r = await axios.put(
            'https://api.chatengine.io/users/',
            {username: username, secret: username, first_name: username},
            { headers: { "Private-Key": process.env.CHAT_ENGINE_PRIVATE_KEY } }
        )
        return res.status(r.status).json(r.data)
    } catch (e) {
        return res.status(e.response.status).json(e.response.data)
    }
});

app.listen(3001);