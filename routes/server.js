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

// this handles adding a notification from the agent/landlord. 
const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { sendWhatsApp } = require('../services/whatsappService');

// Display the notice form
router.get('/notices/new', authenticateAgent, async (req, res) => {
    try {
        // Get the logged in agent/landlord
        const user = req.user;
        
        // Get the tenants/properties this agent manages
        const tenants = await Tenant.find({ managedBy: user._id });
        
        res.render('send-notice', { 
            user,
            tenants 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Handle form submission
router.post('/notices/send', authenticateAgent, async (req, res) => {
    try {
        const { tenantId, noticeType, subject, message, effectiveDate, deliveryMethods } = req.body;
        
        // Get tenant details
        const tenant = await Tenant.findById(tenantId);
        
        // Create notice in database
        const notice = new Notice({
            sender: req.user._id,
            recipient: tenantId,
            noticeType,
            subject,
            message,
            effectiveDate: effectiveDate || null,
            deliveryMethods: Array.isArray(deliveryMethods) ? deliveryMethods : [deliveryMethods],
            status: 'sent'
        });
        
        await notice.save();
        
        // Send notifications based on selected methods
        if (deliveryMethods.includes('platform')) {
            // Add to tenant's notification center
            await Tenant.updateOne(
                { _id: tenantId },
                { $push: { notifications: notice._id } }
            );
        }
        
        if (deliveryMethods.includes('email') && tenant.email) {
            await sendEmail({
                to: tenant.email,
                subject: `Notice: ${subject}`,
                text: `Dear ${tenant.name},\n\n${message}\n\nSincerely,\n${req.user.name}`
            });
        }
        
        if (deliveryMethods.includes('sms') && tenant.phone) {
            await sendSMS({
                to: tenant.phone,
                body: `NOTICE: ${subject}\n\n${message.substring(0, 140)}...\n\nLogin to view full notice.`
            });
        }
        
        if (deliveryMethods.includes('whatsapp') && tenant.phone) {
            await sendWhatsApp({
                to: tenant.phone,
                message: `*Notice: ${subject}*\n\n${message}\n\n_Sent via ${req.user.name}_`
            });
        }
        
        res.redirect('/notices/confirmation');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error sending notice');
    }
});