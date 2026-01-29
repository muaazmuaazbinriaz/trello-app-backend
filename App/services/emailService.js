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

// const sendBoardInvite = async (to, boardTitle, boardId) => {
//   const inviteLink = `${process.env.FRONTEND_URL}/home/${boardId}`;
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

const sendBoardInvite = async (to, boardTitle, inviterName, boardId) => {
  const inviteLink = `${process.env.FRONTEND_URL}/home/${boardId}`;
  await transporter.sendMail({
    from: `"MERN Notes App" <${process.env.SMTP_USER}>`,
    to,
    subject: `${inviterName} invited you to board: "${boardTitle}"`,
    text: `${inviterName} invited you to join the board "${boardTitle}".\n\nClick here: ${inviteLink}`,
    html: `
      <h2>Board Invitation</h2>
      <p><strong>${inviterName}</strong> invited you to board <strong>"${boardTitle}"</strong></p>
      <a href="${inviteLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Board</a>
    `,
  });
};

module.exports = {
  sendBoardInvite,
};
