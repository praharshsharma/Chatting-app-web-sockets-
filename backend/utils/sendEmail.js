const nodemailer = require("nodemailer");
const server = require("../server");
module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			//service: process.env.SERVICE,
			port: 465,
			secure: true,
			auth: {
				user: "",
				pass: "",
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
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