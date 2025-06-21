import React from "react";

interface WelcomeEmailTemplateProps {
  name: string;
}

export const WelcomeEmailTemplate: React.FC<
  Readonly<WelcomeEmailTemplateProps>
> = ({ name = "" }) => (
  <div>
    <h1>Hey {name},</h1>
    <p>welcome.</p>
    <img
      src="https://i.postimg.cc/YqcRH4J8/image.png"
      alt="Welcome to Forge Zone"
    />
    <p>Welcome to Forge Zone — glad to have you on board!</p>
    <p>
      Check out our latest build: <b>Create your own Spotify AI Rewind</b>. It's
      live now.
    </p>
    <p>
      And remember: it's easier to quit than to build — but growth only happens
      when you keep going.
    </p>
    <p>
      <i>
        "The people who are crazy enough to think they can change the world are
        the ones who do."
      </i>{" "}
      — Steve Jobs
    </p>
    <p>— Shrit</p>
  </div>
);
