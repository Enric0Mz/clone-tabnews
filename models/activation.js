import email from "infra/email.js";

async function sendEmailToUser(user) {
  await email.send({
    from: "Curso <contato@tabnews.com.br>",
    to: user.email,
    subject: "Ative seu cadastro no Tab News!",
    text: `${user.username}, clique no link abaixo para ativar sua conta no Tab News:
https://seulinkdeativacao.com.br

Atenciosamente,
Equipe Tab News
    `,
  });
}

const activation = { sendEmailToUser };

export default activation;
