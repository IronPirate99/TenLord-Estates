const bodyParser = require("body-parser");
const session = require("express-session")
const express = require("express");
const app = new express();
const multer = require("multer");
const path = require("path")



app.get('/complaint', (req, res) => {
    const tenant = req.session.tenant;
    const error = req.session.error || null;
    const success = req.session.success || null;
    const formData = req.session.formData || {};

    req.session.error = null;
    req.session.success = null;
    req.session.formData = null;

    res.render('complaint', {tenant, error, success, formData});
})

app.post('/complaint', (req, res)=> {
    const {issue} = req.body;
    const tenant = req.session.tenant;

    if (!issue || issue.trim() === ''){
        req.session.error = "Please provide details about the complaint.";
        req.session.formData = { issue };
        return res.redirect('/complaint');
    }

    req.session.success = 'Your complaint has been submitted successfully.';
    return res.redirect('/complaint');
})

let propertyListings = [];

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({storage: storage});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'someSecret',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', { properties: propertyListings });
});

app.get('/add-property', (req, res) => {
    res.render('add-property');
});

app.post('/add-property', upload.array('pics', 5), (req, res) => {
    const { name, email, beds, baths, location, price } = req.body;
    const images = req.files.map(file => '/uploads/' + file.filename);

    const newListing = {
        name,
        email,
        beds,
        baths,
        location,
        price,
        images
    };

    propertyListings.push(newListing);
    res.redirect('/');
});