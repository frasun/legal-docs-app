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

export async function sendFile(
  file: string,
  filename: string,
  To: string,
  sender: string,
  documentTemplate: string
) {
  try {
    await client.sendEmailWithTemplate({
      From: import.meta.env.POSTMARK_SENDER,
      To,
      TemplateAlias: "document-sharing",
      TemplateModel: {
        sender,
        documentTemplate,
      },
      InlineCss: false,
      Attachments: [
        {
          Name: `${filename}.pdf`,
          Content: file,
          ContentType: "application/octet-stream",
          ContentID: "",
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
}

export async function sendFiles(emailData: postmark.Models.TemplatedMessage[]) {
  try {
    await client.sendEmailBatchWithTemplates(emailData);
  } catch (e) {
    console.error(e);
  }
}
