import joi from "joi";
import passswordComplexity from "joi-password-complexity";

export const validateData = (data) => {
  const schema = joi.object({
    email: joi.string().required().label("email"),
    password: passswordComplexity().required().label("password"),
    confirmPassword: joi.string().required().label("confirmPassword"),
    appType:joi.string().required().label("appType"),
  });

  return schema.validate(data);
};
