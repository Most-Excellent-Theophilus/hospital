import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { mail } from "./email";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SITE_NAME,

} = process.env;
const sendMail = async (email: string, token: string, site: string) => {
  // Create a transporter
  console.log({sendingMail:"im frommail"})
  const emailHtml = await render(mail({ userName: email, loginUrl: token , site}));
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false, // true for 465, false for 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    const mymail = await transporter.sendMail({
      from: `"${SITE_NAME}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `"Trying to Login  "${email}`,
      html: emailHtml,
    });

    return mymail;
  } catch (err) {
    console.log(err)
  }
};

export default sendMail;
