Express = require("express");
app = new Express();

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

    req.success.success = 'Your complaint has been submitted successfully.';
})