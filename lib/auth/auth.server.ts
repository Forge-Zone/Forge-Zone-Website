"use server";
import { User } from "@supabase/supabase-js";
import db from "../db";
import { getRandomProfilePicture } from "../utils";
import { InternshipOrJob, UserType } from "@/types/user.types";
import { SingleProject } from "@/types/project.types";

async function sendWelcomeEmail(email: string, name?: string) {
  try {
    console.log(`Sending welcome email to: ${email}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_URL || "http://localhost:3000"}/api/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: name || email.split("@")[0],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send welcome email:", errorText);
      return false;
    }

    const result = await response.json();
    console.log("Welcome email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
}

async function createResendContact(
  email: string,
  firstName?: string,
  lastName?: string
) {
  try {
    console.log(`Creating Resend contact for: ${email}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_URL || "http://localhost:3000"}/api/send`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName: firstName || email.split("@")[0],
          lastName: lastName || "",
          unsubscribed: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to create Resend contact:", errorText);
      return false;
    }

    const result = await response.json();
    console.log("Resend contact created successfully:", result);
    return true;
  } catch (error) {
    console.error("Error creating Resend contact:", error);
    return false;
  }
}

export async function createUser(user: User) {
  try {
    if (!user.email) {
      return null;
    }

    // Check if user already exists before creating
    const existingUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (existingUser) {
      return existingUser as unknown as UserType;
    }

    const pfp = getRandomProfilePicture();
    const res = await db.user.create({
      data: {
        id: user.id,
        email: user.email,
        username: user.email.split("@")[0],
        pfp: pfp,
        internshipOrJob: "internship",
        projectsNum: 0,
      },
    });

    // Send welcome email to new user
    await sendWelcomeEmail(user.email, user.user_metadata?.name);

    // Create contact in Resend
    await createResendContact(user.email, user.user_metadata?.name);

    return res as unknown as UserType;
  } catch (error) {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    // Use Prisma's include to perform a single query instead of multiple queries
    const userData = await db.user.findUnique({
      where: {
        id: id,
      },
      include: {
        socials: true,
        projects: {
          include: {
            messages: true,
          },
        },
      },
    });

    if (!userData) {
      return null;
    }

    const user: UserType = {
      id: userData.id || "",
      name: userData.name || "",
      email: userData.email || "",
      username: userData.username || "",
      pfp: userData.pfp || "",
      oneLiner: userData.oneLiner || "",
      location: userData.location || "",
      whatworkingrn: userData.whatworkingrn || "",
      internshipOrJob:
        userData.internshipOrJob === "internship"
          ? InternshipOrJob.internship
          : InternshipOrJob.job,
      projectsNumber: userData.projectsNum || 0,
      socials: {
        github: userData.socials?.github || "",
        linkedIn: userData.socials?.linkedIn || "",
        twitter: userData.socials?.twitter || "",
      },
      projects: userData.projects.map((projectUser) => ({
        id: projectUser.id,
        projectname: projectUser.projectname,
        isDiscordConnected: projectUser.isDiscordConnected,
        isTwitterShared: projectUser.isTwitterShared,
        total: projectUser.total,
        current: projectUser.current,
        userId: projectUser.userId,

        messages: projectUser.messages.map((message) => ({
          id: message.id,
          message: message.message,
          target: message.target,
        })),
      })),
    };

    return user;
  } catch (error) {
    return null;
  }
}

export async function updatePfp(id: string, pfp: string) {
  try {
    const res = await db.user.update({
      where: {
        id: id,
      },
      data: {
        pfp: pfp,
      },
    });

    return res as unknown as UserType;
  } catch (error) {
    return null;
  }
}

export async function updateUser(user: UserType) {
  try {
    // Update user and handle socials in a single operation
    const res = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        pfp: user.pfp,
        oneLiner: user.oneLiner,
        location: user.location,
        internshipOrJob: user.internshipOrJob ? "internship" : "job",
        projectsNum: user.projectsNumber,
        socials: {
          upsert: {
            create: {
              github: user.socials?.github || "",
              linkedIn: user.socials?.linkedIn || "",
              twitter: user.socials?.twitter || "",
            },
            update: {
              github: user.socials?.github || "",
              linkedIn: user.socials?.linkedIn || "",
              twitter: user.socials?.twitter || "",
            },
          },
        },
      },
      include: {
        socials: true,
      },
    });

    return res as unknown as UserType;
  } catch (error) {
    return null;
  }
}
