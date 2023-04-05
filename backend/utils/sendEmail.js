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
				user: "snehashah0854@gmail.com",
				pass: "bateku08052004",
			},
		});

		await transporter.sendMail({
			from: "snehashah0854@gmail.com",
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