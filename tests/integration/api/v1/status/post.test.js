import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "methodNotAllowedError",
        message: "Método não permitido nesse endpoint.",
        action:
          "Verifique se o método HTTP enviado é válido para esse endpoint.",
        status_code: 405,
      });
    });
  });
});
