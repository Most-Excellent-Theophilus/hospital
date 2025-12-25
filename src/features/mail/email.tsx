
import React from "react";

export function mail({
  userName,
  loginUrl,
  site
}: {
  userName: string;
  loginUrl: string;
  site: string
}) {
  console.log({ loginUrl });
  return (
    <div style={{ fontFamily: "Arial", lineHeight: "1.5" }}>
      <h2>
        Hello, {userName}! from {site}
      </h2>
      <br />
      <hr />
      <br />
      <p>Thanks for signing up. Click below to Login:</p>
      <a
        href={loginUrl}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#087ea4",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "6px",
        }}
      >
        Lets Go
      </a>
      <br />
      <hr />
      <br />
      <a style={{ fontSize: "12px", marginTop: "20px" }} href={loginUrl}>
        {loginUrl}
      </a>
     
      <p style={{ fontSize: "12px", marginTop: "20px", color: "#666" }}>
        If you didn’t sign up for this, you can safely ignore this email.
      </p>
    </div>
  );
}
