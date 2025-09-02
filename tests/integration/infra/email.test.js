import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "TabNews <contato@tabnews.com.br>",
      to: "enricovmarquezz@gmail.com",
      subject: "Teste de Assunto",
      text: "Teste de corpo.",
    });

    await email.send({
      from: "TabNews <contato@tabnews.com.br>",
      to: "enricovmarquezz@gmail.com",
      subject: "Último email Enviado",
      text: "Corpo do último email.",
    });
    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@tabnews.com.br>");
    expect(lastEmail.recipients[0]).toBe("<enricovmarquezz@gmail.com>");
    expect(lastEmail.subject).toBe("Último email Enviado");
    expect(lastEmail.text).toBe("Corpo do último email.\r\n");
  });
});
