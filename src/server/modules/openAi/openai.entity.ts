import dotenv from "dotenv";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

dotenv.config();

const ParsedEmail = z.object({
  category: z.string(),
  details: z.string(),
});
const openai = new OpenAI({
  apiKey: "enter key",
});

export async function getGPTCategory(subject: string, body: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant taht categorizes emails into a strcutured JSON format.",
      },
      {
        role: "user",
        content: `Please categorize the following email into a JSON format with the keys category, and details: \n\n Email Subject: ${subject}\n Email Body: ${body}`,
      },
    ],
    response_format: zodResponseFormat(ParsedEmail, "parsed_email"),
  });
  const parsed_email = response.choices[0].message;

  if (parsed_email.refusal) {
    console.log(parsed_email.refusal);
  } else {
    console.log(parsed_email.content);
  }
}
