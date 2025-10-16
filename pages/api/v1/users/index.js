import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import activation from "models/activation.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  // 1. Criar token de ativação
  // 2. Enviar email de ativação
  await activation.sendEmailToUser(newUser);

  return response.status(201).json(newUser);
}
