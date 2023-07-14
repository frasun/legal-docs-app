import postmark from "postmark";

const client = new postmark.ServerClient(import.meta.env.POSTMARK_SECRET);

export default async function (To, code) {
  try {
    await client.sendEmailWithTemplate({
      From: import.meta.env.POSTMARK_SENDER,
      To,
      TemplateId: import.meta.env.POSTMARK_VERIFICATION_TEMPLATE,
      TemplateModel: {
        code,
      },
    });
  } catch (e) {
    console.error(e);
  }
}
