const nodemailer = require("nodemailer");

// Environment variable-based config (recommended for security)
require("dotenv").config();

exports.sendEmail = async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // "23bmiit154@gmail.com"
        pass: process.env.EMAIL_PASS, // App-specific password
      },
    });

    const mailOptions = {
      from: `"Binkeyit" <${process.env.EMAIL_USER}>`, // Name + your Gmail
      to,
      subject,
      html,
      // If you want to use HTML instead of plain text, you can do:
      // html: `<strong>${text}</strong>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
};
