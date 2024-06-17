import nodemailer from 'nodemailer';

const emailController = {
    sendEmail: async (req, res) => {
      const { tenantEmail, tenantName, landlordEmail, subject, message } = req.body;
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
  
      const mailOptions = {
        from: `"${tenantName}" <${tenantEmail}>`, // Display name and email of tenant
        to: landlordEmail, // Landlord's email
        subject: subject,
        text: `Message from ${tenantName} (${tenantEmail}):\n\n${message}`
      };
  
      try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
      }
    }
  };
  
  export default emailController;