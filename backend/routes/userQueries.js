// routes/userQueries.js
const express = require("express");
const nodemailer = require("nodemailer");
const UserQuery = require("../models/UserQuery");
const user = require("../models/User");

const router = express.Router();

// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or other email service (like SendGrid, Mailgun)
  auth: {
    user: `${process.env.EMAIL}`, //"your-email@gmail.com",  // Replace with your email
    pass: `${process.env.EMAIL_PASSWORD}`//"your-email-password",  // Replace with your email password or App password
  },
});


// Route to create a user query and send it to the support email
router.post("/submit-query", async (req, res) => {
    // console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);
  const { userEmail, subject, message } = req.body;

  if (!userEmail || !subject || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Save the user query to the database
    const newQuery = new UserQuery({ userEmail, subject, message });
    await newQuery.save();

    // Send the query to the support email
    const mailOptions = {
      from: userEmail,
      to: "support@yourdomain.com",  // Replace with support email
      subject: `Support Request: ${subject}`,
      text: message,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email", error });
      }
      res.status(200).json({ message: "Query submitted successfully", info });
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting query", error });
  }
});


// Route to send email to all users
router.post("/send-to-all", async (req, res) => {
    const { subject, message } = req.body;
  
    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required." });
    }
  
    try {
      // Get all users with email
      const users = await user.find({ email: { $exists: true, $ne: "" } });
      const userEmails = users.map(user => user.email);
  
      if (userEmails.length === 0) {
        return res.status(404).json({ message: "No users with email addresses found." });
      }
  
      // Send email to all users
      const mailOptions = {
        from: "support@nftpatrata.com", // Your email
        to: userEmails.join(", "), // Join emails to send in one batch
        subject,
        text: message,
      };
      // console.log('wwwwwwwwwwwwww');
  
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: "Error sending email", error });
        }
        res.status(200).json({ message: "Email sent successfully to all users", info });
      });
    } catch (error) {
      res.status(500).json({ message: "Error sending email to users", error });
    }
  });

  // Get all user queries
router.get("/all-queries", async (req, res) => {
  try {
    const queries = await UserQuery.find(); // Retrieve all queries from the DB
    res.status(200).json({ success: true, data: queries });
  } catch (error) {
    console.error("Error fetching user queries:", error);
    res.status(500).json({ success: false, message: "Error fetching user queries" });
  }
});


module.exports = router;
