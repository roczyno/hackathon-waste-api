import joi from "joi";
import passswordComplexity from "joi-password-complexity";

export const validateData = (data) => {
  const schema = joi.object({
    username: joi.string().required().label("username"),
    email: joi.string().required().label("email"),
    password: passswordComplexity().required().label("password"),
    location: joi.string().required().label("location"),
    date: joi.string().required().label("date"),
  });

  return schema.validate(data);
};
