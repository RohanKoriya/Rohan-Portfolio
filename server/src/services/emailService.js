const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const PORTFOLIO_NAME = "Rohan Koriya";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

/**
 * Escape user-provided values before inserting them into HTML.
 */
function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Creates the HTML email sent to the portfolio owner.
 */
function getContactEmailTemplate({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  const replyEmail = encodeURIComponent(email);
  const replySubject = encodeURIComponent("Re: Portfolio Inquiry");

  const sentAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Message</title>
</head>

<body
  style="
    margin: 0;
    padding: 32px 16px;
    background-color: #f5f5f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif;
    color: #18181b;
    -webkit-font-smoothing: antialiased;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    role="presentation"
  >
    <tr>
      <td align="center">

        <!-- Main container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          role="presentation"
          style="
            max-width: 560px;
            background-color: #ffffff;
            border: 1px solid #e4e4e7;
            border-radius: 12px;
            overflow: hidden;
          "
        >

          <!-- Header -->
          <tr>
            <td
              style="
                padding: 26px 28px;
                border-bottom: 1px solid #e4e4e7;
              "
            >
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
              >
                <tr>
                  <td valign="top">
                    <div
                      style="
                        font-size: 11px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.06em;
                        color: #71717a;
                        margin-bottom: 8px;
                      "
                    >
                      Portfolio
                    </div>

                    <h1
                      style="
                        margin: 0;
                        font-size: 20px;
                        line-height: 1.4;
                        font-weight: 600;
                        color: #18181b;
                        letter-spacing: -0.01em;
                      "
                    >
                      New contact message
                    </h1>
                  </td>

                  <td
                    align="right"
                    valign="top"
                    style="
                      padding-left: 16px;
                      white-space: nowrap;
                      font-size: 11px;
                      color: #71717a;
                    "
                  >
                    ${sentAt}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 28px;">

              <!-- Sender -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="margin-bottom: 24px;"
              >
                <tr>
                  <td
                    width="50%"
                    valign="top"
                    style="padding-right: 8px;"
                  >
                    <div
                      style="
                        font-size: 11px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.06em;
                        color: #71717a;
                        margin-bottom: 6px;
                      "
                    >
                      From
                    </div>

                    <div
                      style="
                        font-size: 15px;
                        line-height: 1.5;
                        font-weight: 500;
                        color: #18181b;
                      "
                    >
                      ${safeName}
                    </div>
                  </td>

                  <td
                    width="50%"
                    valign="top"
                    style="padding-left: 8px;"
                  >
                    <div
                      style="
                        font-size: 11px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.06em;
                        color: #71717a;
                        margin-bottom: 6px;
                      "
                    >
                      Email
                    </div>

                    <a
                      href="mailto:${safeEmail}"
                      style="
                        font-size: 14px;
                        line-height: 1.5;
                        color: #18181b;
                        text-decoration: underline;
                        text-underline-offset: 2px;
                        word-break: break-word;
                      "
                    >
                      ${safeEmail}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Message label -->
              <div
                style="
                  font-size: 11px;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                  color: #71717a;
                  margin-bottom: 8px;
                "
              >
                Message
              </div>

              <!-- Message box -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  background-color: #f7f7f8;
                  border: 1px solid #e4e4e7;
                  border-radius: 8px;
                  margin-bottom: 24px;
                "
              >
                <tr>
                  <td
                    style="
                      padding: 16px;
                      font-size: 14px;
                      line-height: 1.65;
                      color: #27272a;
                      white-space: pre-wrap;
                      word-break: break-word;
                    "
                  >
                    ${safeMessage}
                  </td>
                </tr>
              </table>

              <!-- Reply button -->
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
              >
                <tr>
                  <td>
                    <a
                      href="mailto:${replyEmail}?subject=${replySubject}"
                      style="
                        display: inline-block;
                        padding: 10px 16px;
                        background-color: #18181b;
                        color: #ffffff;
                        font-size: 13px;
                        font-weight: 500;
                        line-height: 1.4;
                        text-decoration: none;
                        border-radius: 7px;
                      "
                    >
                      Reply to ${safeName}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                padding: 16px 28px;
                background-color: #fafafa;
                border-top: 1px solid #e4e4e7;
              "
            >
              <div
                style="
                  font-size: 11px;
                  line-height: 1.5;
                  color: #a1a1aa;
                "
              >
                Sent automatically from ${PORTFOLIO_NAME}'s portfolio.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends a notification email when someone submits the contact form.
 */
async function sendContactNotification({ name, email, message }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    if (!NOTIFICATION_EMAIL) {
      throw new Error("NOTIFICATION_EMAIL is not configured.");
    }

    const { data, error } = await resend.emails.send({
      from: "Portfolio Alert <onboarding@resend.dev>",
      to: [NOTIFICATION_EMAIL],
      subject: `New portfolio message from ${name}`,
      replyTo: email,
      html: getContactEmailTemplate({
        name,
        email,
        message,
      }),
    });

    if (error) {
      console.error("Resend Email Dispatch Error:", error);

      return {
        success: false,
        error,
      };
    }

    console.log("Portfolio notification sent:", data?.id);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Resend Email Dispatch Error:", error);

    return {
      success: false,
      error,
    };
  }
}

module.exports = {
  sendContactNotification,
};