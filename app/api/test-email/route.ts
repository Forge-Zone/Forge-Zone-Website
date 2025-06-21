import { WelcomeEmailTemplate } from "@/components/email/WelcomeEmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "Shrit <shrit@forgezone.dev>",
      to: [email],
      subject: "Test Welcome Email - Forge Zone",
      react: await WelcomeEmailTemplate({ name: name || "Test User" }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
