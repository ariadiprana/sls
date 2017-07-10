var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		auth: {
				user: "salesku.id@gmail.com",
				pass: "Ad1pr4n4"
		}
})


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

	app.post('/email-sales-support', function(req, res) {
		console.log(req.body)
		var namaForm = req.body.fields.namaForm
		var namaDepan = req.body.fields.namaDepan
		var namaTengah = req.body.fields.namaTengah
		var namaBelakang = req.body.fields.namaBelakang
		var jk = req.body.fields.jk
		var email = req.body.fields.email
		var noTelpRumah = req.body.fields.noTelpRumah
		var noTelpHp = req.body.fields.noTelpHp
		var kotaDomisili = req.body.fields.kotaDomisili
		var namaPerusahaan = req.body.fields.namaPerusahaan
		var sektorUsaha = req.body.fields.sektorUsaha
		var jabatan = req.body.fields.jabatan
		var emailKantor = req.body.fields.emailKantor
		var telKantor = req.body.fields.telKantor
		var alamatKantor = req.body.fields.alamatKantor

		var subjectTitle = 'Informasi Pengunjung Salesku - '+namaForm

		var mailOptions={
		   to : 'ari.adiprana@gmail.com',
		   subject : subjectTitle,
		   text : `Berikut informasi pengunjung salesku untuk ${namaForm}\n
			 Nama Depan  	    : ${namaDepan} \n
			 Nama Tengah 	    : ${namaTengah} \n
			 Nama Belakang    : ${namaBelakang} \n
			 Jenis Kelamin    : ${jk} \n
			 Email 			      : ${email} \n
			 No Telp Rumah    : ${noTelpRumah} \n
			 No Handphone     : ${noTelpHp} \n
			 Kota Domisili    : ${kotaDomisili} \n
			 Nama Perusahaan  : ${namaPerusahaan} \n
			 Sektor Usaha     : ${sektorUsaha} \n
			 Jabatan          : ${jabatan} \n
			 Email Kantor     : ${emailKantor} \n
			 Telpon Kantor    : ${telKantor} \n
			 Alamat Kantor    : ${alamatKantor}
			 `
		}
		console.log(mailOptions);
		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
				res.end("error");
			}else{
				console.log("Message sent: " + response.message);
				res.end("sent");
			}
		});
	})

	app.post('/email-finansial', function(req, res) {
		console.log(req.body)
		var namaForm = req.body.fields.namaForm
		var namaDepan = req.body.fields.namaDepan
		var namaTengah = req.body.fields.namaTengah
		var namaBelakang = req.body.fields.namaBelakang
		var jk = req.body.fields.jk
		var email = req.body.fields.email
		var noTelpRumah = req.body.fields.noTelpRumah
		var noTelpHp = req.body.fields.noTelpHp
		var kotaDomisili = req.body.fields.kotaDomisili
		var statusPekerjaan = req.body.fields.statusPekerjaan
		var penghasilanPekerjaan = req.body.fields.penghasilanPekerjaan
		var subjectTitle = 'Informasi Pengunjung Salesku - '+namaForm

		var mailOptions={
		   to : 'ari.adiprana@gmail.com',
		   subject : subjectTitle,
		   text : `Berikut informasi pengunjung salesku untuk ${namaForm}\n
			 Nama Depan  	    : ${namaDepan} \n
			 Nama Tengah 	    : ${namaTengah} \n
			 Nama Belakang    : ${namaBelakang} \n
			 Jenis Kelamin    : ${jk} \n
			 Email 			      : ${email} \n
			 No Telp Rumah    : ${noTelpRumah} \n
			 No Handphone     : ${noTelpHp} \n
			 Kota Domisili    : ${kotaDomisili} \n
			 Status Pekerjaan : ${statusPekerjaan} \n
			 Penghasilan      : ${penghasilanPekerjaan}
			 `
		}
		console.log(mailOptions);
		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
				res.end("error");
			}else{
				console.log("Message sent: " + response.message);
				res.end("sent");
			}
		});
	})

	app.post('/email-kartu-kredit', function(req, res) {
		console.log(req.body)
		var namaForm = req.body.fields.namaForm
		var namaDepan = req.body.fields.namaDepan
		var namaTengah = req.body.fields.namaTengah
		var namaBelakang = req.body.fields.namaBelakang
		var jk = req.body.fields.jk
		var email = req.body.fields.email
		var noTelpRumah = req.body.fields.noTelpRumah
		var noTelpHp = req.body.fields.noTelpHp
		var kotaDomisili = req.body.fields.kotaDomisili
		var statusPekerjaan = req.body.fields.statusPekerjaan
		var penghasilanPekerjaan = req.body.fields.penghasilanPekerjaan
		var subjectTitle = 'Informasi Pengunjung Salesku - '+namaForm

		var mailOptions={
		   to : 'ari.adiprana@gmail.com',
		   subject : subjectTitle,
		   text : `Berikut informasi pengunjung salesku untuk ${namaForm}\n
			 Nama Depan  	    : ${namaDepan} \n
			 Nama Tengah 	    : ${namaTengah} \n
			 Nama Belakang    : ${namaBelakang} \n
			 Jenis Kelamin    : ${jk} \n
			 Email 			      : ${email} \n
			 No Telp Rumah    : ${noTelpRumah} \n
			 No Handphone     : ${noTelpHp} \n
			 Kota Domisili    : ${kotaDomisili} \n
			 Status Pekerjaan : ${statusPekerjaan} \n
			 Penghasilan      : ${penghasilanPekerjaan}
			 `
		}
		console.log(mailOptions);
		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
				res.end("error");
			}else{
				console.log("Message sent: " + response.message);
				res.end("sent");
			}
		});
	})

	app.post('/email-asuransi', function(req, res) {
		console.log(req.body)
		var namaForm = req.body.fields.namaForm
		var namaDepan = req.body.fields.namaDepan
		var namaTengah = req.body.fields.namaTengah
		var namaBelakang = req.body.fields.namaBelakang
		var jk = req.body.fields.jk
		var email = req.body.fields.email
		var noTelpRumah = req.body.fields.noTelpRumah
		var noTelpHp = req.body.fields.noTelpHp
		var kotaDomisili = req.body.fields.kotaDomisili
		var statusPekerjaan = req.body.fields.statusPekerjaan
		var penghasilanPekerjaan = req.body.fields.penghasilanPekerjaan
		var subjectTitle = 'Informasi Pengunjung Salesku - '+namaForm

		var mailOptions={
		   to : 'ari.adiprana@gmail.com',
		   subject : subjectTitle,
		   text : `Berikut informasi pengunjung salesku untuk ${namaForm}\n
			 Nama Depan  	    : ${namaDepan} \n
			 Nama Tengah 	    : ${namaTengah} \n
			 Nama Belakang    : ${namaBelakang} \n
			 Jenis Kelamin    : ${jk} \n
			 Email 			      : ${email} \n
			 No Telp Rumah    : ${noTelpRumah} \n
			 No Handphone     : ${noTelpHp} \n
			 Kota Domisili    : ${kotaDomisili} \n
			 Status Pekerjaan : ${statusPekerjaan} \n
			 Penghasilan      : ${penghasilanPekerjaan}
			 `
		}
		console.log(mailOptions);
		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
				res.end("error");
			}else{
				console.log("Message sent: " + response.message);
				res.end("sent");
			}
		});
	})

	app.get('/', function(req, res) { res.render('main.ejs'); });
	app.get('/contact', function(req, res) { res.render('contact.ejs'); });
	app.get('/about_us', function(req, res) { res.render('about_us.ejs'); });
	app.get('/services', function(req, res) { res.render('services.ejs'); });

	// SALES
	app.get('/finansial/kredit-tanpa-agunan', function(req, res) { res.render('finansial-kredit-tanpa-agunan.ejs'); });
	app.get('/finansial/kredit-pemilikan-rumah', function(req, res) { res.render('finansial-kredit-pemilikan-rumah.ejs'); });
	app.get('/finansial/kredit-agunan-bpkb', function(req, res) { res.render('finansial-kredit-agunan-bpkb.ejs'); });
	app.get('/finansial/kredit-agunan-sertifikat', function(req, res) { res.render('finansial-kredit-agunan-sertifikat.ejs'); });

	app.get('/asuransi/mobil', function(req, res) { res.render('asuransi-mobil.ejs'); });
	app.get('/asuransi/motor', function(req, res) { res.render('asuransi-motor.ejs'); });
	app.get('/asuransi/sepeda', function(req, res) { res.render('asuransi-sepeda.ejs'); });
	app.get('/asuransi/rumah-apartment', function(req, res) { res.render('asuransi-rumah-apartment.ejs'); });
	app.get('/asuransi/ruko-rukan', function(req, res) { res.render('asuransi-ruko-rukan.ejs'); });
	app.get('/asuransi/tempat-usaha', function(req, res) { res.render('asuransi-tempat-usaha.ejs'); });
	app.get('/asuransi/industri', function(req, res) { res.render('asuransi-industri.ejs'); });
	app.get('/asuransi/kesehatan', function(req, res) { res.render('asuransi-kesehatan.ejs'); });
	app.get('/asuransi/personal-accident', function(req, res) { res.render('asuransi-personal-accident.ejs'); });
	app.get('/asuransi/travel', function(req, res) { res.render('asuransi-travel.ejs'); });
	app.get('/asuransi/surety-bond', function(req, res) { res.render('asuransi-surety-bond.ejs'); });
	app.get('/asuransi/prefessional-indemnity', function(req, res) { res.render('asuransi-prefessional-indemnity.ejs'); });
	app.get('/asuransi/marine-cargo', function(req, res) { res.render('asuransi-marine-cargo.ejs'); });
	app.get('/asuransi/term-life', function(req, res) { res.render('asuransi-term-life.ejs'); });
	app.get('/asuransi/unit-link', function(req, res) { res.render('asuransi-unit-link.ejs'); });
	app.get('/asuransi/dana-pensiun', function(req, res) { res.render('asuransi-dana-pensiun.ejs'); });


	app.get('/kartu-kredit/promo', function(req, res) { res.render('kartu-kredit-promo.ejs'); });
	app.get('/kartu-kredit/reward', function(req, res) { res.render('kartu-kredit-reward.ejs'); });
	app.get('/kartu-kredit/cashback', function(req, res) { res.render('kartu-kredit-cashback.ejs'); });
	app.get('/kartu-kredit/miles', function(req, res) { res.render('kartu-kredit-miles.ejs'); });
	app.get('/kartu-kredit/shopping', function(req, res) { res.render('kartu-kredit-shopping.ejs'); });
	app.get('/kartu-kredit/travel', function(req, res) { res.render('kartu-kredit-travel.ejs'); });
	app.get('/kartu-kredit/lifestyle', function(req, res) { res.render('kartu-kredit-lifestyle.ejs'); });
	app.get('/kartu-kredit/charge-card', function(req, res) { res.render('kartu-kredit-charge-card.ejs'); });
	app.get('/kartu-kredit/syariah', function(req, res) { res.render('kartu-kredit-syariah.ejs'); });


	// BANKING - AND - FINANCE
	app.get('/banking-and-finance', function(req, res) { res.render('banking-and-finance.ejs'); });

	// INSURANCE
	app.get('/insurance', function(req, res) { res.render('insurance.ejs'); });

	// TRAINING
	app.get('/training/learning-and-development', function(req, res) { res.render('learning-and-development.ejs'); });
	app.get('/training/professional-selling-skill', function(req, res) { res.render('training-professional-selling-skill.ejs'); });
	app.get('/training/sales-leadership', function(req, res) { res.render('training-sales-leadership.ejs'); });
	app.get('/training/customer-relationship-management', function(req, res) { res.render('training-customer-relationship-management.ejs'); });
	app.get('/training/collection-skill', function(req, res) { res.render('training-collection-skill.ejs'); });
	app.get('/training/managing-for-growth', function(req, res) { res.render('training-managing-for-growth.ejs'); });
	app.get('/training/professional-development-and-team-building', function(req, res) { res.render('training-professional-development-and-team-building.ejs'); });

	// SALES SUPPORT
	app.get('/sales-support/online-offline', function(req, res) { res.render('sales-support-online-offline.ejs'); });
	app.get('/sales-support/multi-product', function(req, res) { res.render('sales-support-multi-product.ejs'); });
	app.get('/sales-support/sales-analytic', function(req, res) { res.render('sales-support-sales-analytic.ejs'); });
	app.get('/sales-support/sales-empowering', function(req, res) { res.render('sales-support-sales-empowering.ejs'); });
	// Initial
	//app.get('', function(req, res) { res.render('.ejs'); });

}

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}
