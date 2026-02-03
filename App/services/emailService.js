// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// dotenv.config();
// const transporter = nodemailer.createTransport({
//   service: process.env.SMTP_SERVICE,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });
// const sendBoardInvite = async (to, boardTitle, inviteId) => {
//   const inviteLink = `${process.env.FRONTEND_URL}/signup?inviteId=${inviteId}`;
//   await transporter.sendMail({
//     from: `"MERN Notes App" <${process.env.SMTP_USER}>`,
//     to,
//     subject: `Invitation to board :  "${boardTitle}"`,
//     text: ` you are invited to join the board "${boardTitle}".\n\n${inviteLink}`,
//     html: `
//       <a href="${inviteLink}">Accept Invite</a>
//     `,
//   });
// };

// module.exports = {
//   sendBoardInvite,
// };

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendBoardInvite = async (to, boardTitle, inviteId) => {
  const inviteLink = `${process.env.FRONTEND_URL}/signup?inviteId=${inviteId}`;

  await transporter.sendMail({
    from: `"MERN Notes App" <${process.env.SMTP_USER}>`,
    to,
    subject: `Invitation to board: "${boardTitle}"`,
    text: `You are invited to join the board "${boardTitle}".\n\nClick here to accept: ${inviteLink}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(90deg, rgba(57,35,170,1) 0%, rgba(110,49,165,1) 50%, rgba(192,67,159,1) 100%); min-height: 100vh;">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                
                <!-- Card Container -->
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #f3f4f6; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: -0.5px;">
                        📋 Board Invitation
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                        Hi there! 👋
                      </p>
                      <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                        You've been invited to collaborate on the board:
                      </p>
                      
                      <!-- Board Title Box -->
                      <div style="background-color: #ffffff; border-left: 4px solid #8b5cf6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <p style="margin: 0; color: #8b5cf6; font-size: 20px; font-weight: 600;">
                          "${boardTitle}"
                        </p>
                      </div>
                      
                      <p style="margin: 0 0 30px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        Click the button below to accept the invitation and start collaborating!
                      </p>
                      
                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="${inviteLink}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4); transition: all 0.3s;">
                              Accept Invitation →
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Alternative Link -->
                      <p style="margin: 30px 0 0; color: #9ca3af; font-size: 13px; text-align: center; line-height: 1.6;">
                        Or copy this link: <br>
                        <a href="${inviteLink}" style="color: #8b5cf6; word-break: break-all;">${inviteLink}</a>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #e5e7eb; padding: 20px 30px; text-align: center; border-top: 1px solid #d1d5db;">
                      <p style="margin: 0; color: #6b7280; font-size: 13px;">
                        MERN Notes App • Organize Better, Together
                      </p>
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
      </html>
    `,
  });
};

module.exports = {
  sendBoardInvite,
};
