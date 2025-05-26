import user from "models/user.js";
import password from "models/password.js";
import { UnauthorizedError } from "infra/errors.js";
import { NotFoundError } from "infra/errors.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticacao nao conferem.",
        action: "Verifique se os dados enviados estao corretos.",
      });
    }
    throw error;
  }

  async function findUserByEmail(providedEmail) {
    try {
      return await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email nao confere.",
          action: "Verifique se o dado esta correto",
        });
      }
      throw error;
    }
  }

  async function validatePassword(providedPassword, storedPassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha nao confere.",
        action: "Verifique se o dado esta correto",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
