import postmark from "postmark";

const SENDER = "info@prawniczek.pl";
const client = new postmark.ServerClient(import.meta.env.POSTMARK_SECRET);

export default async function (to, subject, message) {
  try {
    await client.sendEmail({
      From: SENDER,
      To: to,
      Subject: subject,
      HtmlBody: message,
    });
  } catch (e) {
    console.error(e);
  }
}
