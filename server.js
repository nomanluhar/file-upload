import express from "express";
import path from "path";
import mongoose from "mongoose";
import { engine } from 'express-handlebars';
import Handlebars from "handlebars";
import bodyparser from "body-parser";
import multer from "multer";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
// const Media = mongoose.model('media');
import Media from './model.js';
import fs from 'fs';

const app = express();
const __dirname = path.resolve();

const MONGO_URL = "mongodb://127.0.0.1:27017/trustTag";

app.set('views', path.join(__dirname, '/views'));
app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'index', handlebars: allowInsecurePrototypeAccess(Handlebars), layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const fileUpload = multer({
    storage: storage,
});


app.get('/', async (req, res) => {
    const allMedia = await Media.find();
    res.render('main', {
        user_media: allMedia
    });
});
app.use('/audio',express.static(path.join(__dirname,'/uploads')));

app.post('/upload', fileUpload.single('media_file'), async (req, res) => {
    var obj = {
        userMedia: req.file.filename
    }
    var media = new Media(obj);

    const saveMedia = await media.save();
    res.redirect('/')
});
app.get('/file/:filename', async (req, res) => {
    const fileName = req.params.filename;
    let filePath = path.join(__dirname + '/uploads/' + fileName);
    fs.readFile(filePath, (err, data) => {
        console.log(err);
        console.log(data);
    });
})


mongoose.connect(MONGO_URL, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('open', () => {
    console.log('Database connected!!!');
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
