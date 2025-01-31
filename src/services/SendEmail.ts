import nodemailer from "nodemailer";
// Configura el transportador (transporter) de nodemailer
const email = process.env.EMAIL;
const email_password = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service:"gmail",       
  auth: {
    user: email,
    pass: email_password,
  },
});

export const SendEmail = async (email: string, subject: string, body: string) => {
    try {
        const mailOptions = {
          from: 'Bienvenido a FNL', 
          to: email,                                           
          subject,
          html: `<h4>${body}<h4/>`                                     
        };
    
        await transporter.sendMail(mailOptions);
        console.log(`correo enviado enviado a ${email}`)
      } catch (error) {
        console.error(`Error al enviar el correo a ${email}:`, error);
        throw new Error("No se pudo enviar el correo.");
      }
}