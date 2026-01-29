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
// update
const sendBoardInvite = async (to, boardTitle, boardId) => {
  const inviteLink = `${process.env.FRONTEND_URL}/home/${boardId}`;
  await transporter.sendMail({
    from: `"MERN Notes App" <${process.env.SMTP_USER}>`,
    to,
    subject: `Invitation to board :  "${boardTitle}"`,
    text: ` you are invited to join the board "${boardTitle}".\n\n${inviteLink}`,
    html: `

      <a href="${inviteLink}">Accept Invite</a>
    `,
  });
};

module.exports = {
  sendBoardInvite,
};
