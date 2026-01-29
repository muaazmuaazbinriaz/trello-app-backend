// const { Resend } = require("resend");

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendBoardInvite = async (email, boardName, inviterName, boardId) => {
//   try {
//     const data = await resend.emails.send({
//       from: "Trello Clone <onboarding@resend.dev>",
//       to: [email],
//       subject: `You've been invited to the board: ${boardName}`,
//       html: `
//       <h1>Board Invitation</h1>
//       <p><strong>${inviterName}</strong> has invited you to colloborate on the <strong>${boardName}</strong> board.</p>
//       <a href="${process.env.FRONTEND_URL}/home/${boardId}" style="background-color: #0079bf; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Board</a>
//        <p>If you don't have an account, please sign up first.</p>
//       `,
//     });
//     return data;
//   } catch (err) {
//     console.error("Error sending email :", err);
//     throw err;
//   }
// };

// module.exports = { sendBoardInvite };

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

const sendBoardInvite = async (to, boardTitle, inviterName, boardId) => {
  const inviteLink = `${process.env.FRONTEND_URL}/boards/${boardId}`;

  await transporter.sendMail({
    from: `"MERN Notes App" <${process.env.SMTP_USER}>`,
    to,
    subject: `${inviterName} invited you to "${boardTitle}"`,
    text: `${inviterName} invited you to join the board "${boardTitle}".\n\n${inviteLink}`,
    html: `
      <p><b>${inviterName}</b> invited you to join the board <b>${boardTitle}</b>.</p>
      <a href="${inviteLink}">Accept Invite</a>
    `,
  });
};

module.exports = {
  sendBoardInvite,
};
