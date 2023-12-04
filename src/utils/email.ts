import postmark from "postmark";

const client = new postmark.ServerClient(import.meta.env.POSTMARK_SECRET);

export default async function (
  To: string,
  TemplateModel: object,
  TemplateAlias = "verification-code"
) {
  try {
    await client.sendEmailWithTemplate({
      From: import.meta.env.POSTMARK_SENDER,
      To,
      TemplateAlias,
      TemplateModel,
      InlineCss: false,
    });
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : undefined, { cause: 500 });
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
    throw new Error(e instanceof Error ? e.message : undefined, { cause: 500 });
  }
}

export async function sendFiles(emailData: postmark.Models.TemplatedMessage[]) {
  try {
    await client.sendEmailBatchWithTemplates(emailData);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : undefined, { cause: 500 });
  }
}
