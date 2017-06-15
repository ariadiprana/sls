// app/routes.js
module.exports = function(app, passport) {

	const corporateController = require('./controllers/corporate.js')
	const corporateUserController = require('./controllers/corporateuser.js')
	const projectController = require('./controllers/project.js')
	const paymentController = require('./controllers/payment.js')
	const corporateEmpController = require('./controllers/corporateemp.js')
	const mapfloorController = require('./controllers/mapfloor.js')

	// =====================================
	// home screen
	// =====================================
	app.get('/', function(req, res) { res.render('main.ejs'); });
	app.get('/contact', function(req, res) { res.render('contact.ejs'); });
	app.get('/about_us', function(req, res) { res.render('about_us.ejs'); });
	app.get('/services', function(req, res) { res.render('services.ejs'); });

	// SALES
	app.get('/finansial/kredit-jaminan-bpkb', function(req, res) { res.render('finansial-kredit-jaminan-bpkb.ejs'); });
	app.get('/finansial/kredit-jaminan-sertifikat', function(req, res) { res.render('finansial-kredit-jaminan-sertifikat.ejs'); });
	
	app.get('/asuransi/kendaraan', function(req, res) { res.render('asuransi-kendaraan.ejs'); });
	app.get('/asuransi/properti', function(req, res) { res.render('asuransi-properti.ejs'); });
	app.get('/asuransi/perjalanan', function(req, res) { res.render('asuransi-perjalanan.ejs'); });
	
	app.get('/kartu-kredit/cash-back', function(req, res) { res.render('kartu-kredit-cash-back.ejs'); });
	app.get('/kartu-kredit/travelling', function(req, res) { res.render('kartu-kredit-travelling.ejs'); });
	app.get('/kartu-kredit/promosi', function(req, res) { res.render('kartu-kredit-promosi.ejs'); });
	app.get('/kartu-kredit/reward', function(req, res) { res.render('kartu-kredit-reward.ejs'); });
	app.get('/kartu-kredit/shopping', function(req, res) { res.render('kartu-kredit-shopping.ejs'); });

	// TRAINING
	app.get('/training/professional-selling-skill', function(req, res) { res.render('training-professional-selling-skill.ejs'); });
	app.get('/training/sales-leadership', function(req, res) { res.render('training-sales-leadership.ejs'); });
	app.get('/training/customer-relationship-management', function(req, res) { res.render('training-customer-relationship-management.ejs'); });
	app.get('/training/collection-skill', function(req, res) { res.render('training-collection-skill.ejs'); });
	app.get('/training/managing-for-growth', function(req, res) { res.render('training-managing-for-growth.ejs'); });
	app.get('/training/professional-development-and-team-building', function(req, res) { res.render('training-professional-development-and-team-building.ejs'); });
	app.get('/training/learning-and-development', function(req, res) { res.render('learning-and-development.ejs'); });
	
}

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}
