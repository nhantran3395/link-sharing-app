import express from 'express';
import morgan from 'morgan';

import * as process from "node:process";

const app = express();
const port = process.env.PORT || 3001;

app.use(morgan('short'));

app.get('/ping',(req, res) => {
    res.json({
        message: "pong"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})