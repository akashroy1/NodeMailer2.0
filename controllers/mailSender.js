const Papa = require('papaparse');
const multer = require("multer");
const fs = require('fs');
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const path = require("path");


// Function to check if an email address is valid
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

exports.mailSender = (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded' });
  }

  const dataPath = req.file.path;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading the CSV file' });
    }
    const results = Papa.parse(data, {
      header: true,
    });
    
    // Delete the uploaded file after parsing is done
    fs.unlink(dataPath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting the uploaded file:', unlinkErr);
      }
    });

    const templatePath = path.join(__dirname, '../templates/email.ejs');
    fs.readFile(templatePath, 'utf8', (templateErr, templateData) => {
      if (templateErr) {
        console.error('Error reading the email template file:', templateErr);
        return;
      }
      results.data.forEach((object) => {
        const { name, email } = object;

        if (!isValidEmail(email)) {
          console.error(`Invalid email address: ${email}.`);
          return;
        }

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'idakashroy@gmail.com',
            pass: 'hzbgnbdlnmgdraqg', 
          },
        });

        const emailContent = ejs.render(templateData, { name });

        const mailOptions = {
          from: 'akash.roy2807@gmail.com', 
          to: email,
          subject: 'Sample Email',
          html: emailContent,
        };

        mailOptions.headers = { 'Content-Type': 'text/html' };

        transporter.sendMail(mailOptions, (emailErr, info) => {
          if (emailErr) {
            console.error('Error sending email:', emailErr);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      });
    });
    
    res.json({ data: results.data });
  });
}