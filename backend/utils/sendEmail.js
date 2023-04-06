const nodemailer = require("nodemailer");
const password = require("../password");
module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			service: "gmail",
			port: 465,
			secure: true,
			auth: {
				user: password.email,
				pass: password.pass,
			},
		});

		await transporter.sendMail({
			from: password.email,
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};
