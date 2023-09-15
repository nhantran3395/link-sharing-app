import express from 'express';
import * as process from "process";

const app = express();
const port = process.env.PORT || 3001;

app.get('/ping',(req, res) => {
    res.json({
        message: "pong"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})