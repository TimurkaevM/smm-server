const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRouter');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 80;

const app = express();

app.use(express.json());
app.use('/smm', authRouter);
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

async function start() {
    try{
        await mongoose.connect("mongodb+srv://mohmad:12345@cluster0.rxses.mongodb.net/smm", {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        app.listen(PORT, () => {
            console.log(`Server has been started on port: ${PORT}`);
        });
    } catch(e) {
        console.log(e);
    }
}


start();

