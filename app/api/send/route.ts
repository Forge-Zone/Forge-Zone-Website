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
      subject: "Welcome Builder!",
      react: await WelcomeEmailTemplate({ name: name || "Builder" }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const {
      email,
      firstName,
      lastName,
      unsubscribed = false,
    } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await resend.contacts.create({
      email: email,
      firstName: firstName || email.split("@")[0],
      lastName: lastName || "",
      unsubscribed: unsubscribed,
      audienceId: "b93f0fd4-a924-4693-8eac-359010084c5c",
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
