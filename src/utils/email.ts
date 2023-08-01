import postmark from "postmark";

const client = new postmark.ServerClient(import.meta.env.POSTMARK_SECRET);

export default async function (To: string, code: string) {
  try {
    await client.sendEmailWithTemplate({
      From: import.meta.env.POSTMARK_SENDER,
      To,
      TemplateAlias: "verification-code",
      TemplateModel: {
        code,
      },
      InlineCss: false,
    });
  } catch (e) {
    console.error(e);
  }
}
