const nodemailer = require("nodemailer");
const server = require("../server");
module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			service: "gmail",
			port: 465,
			secure: true,
			auth: {
				user: "praharshdeepaksharma@gmail.com",
				pass: "aivszhvexlathqet",
			},
		});

		await transporter.sendMail({
			from: "praharshdeepaksharma@gmail.com",
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