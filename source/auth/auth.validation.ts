import Joi from "@hapi/joi";

const createUser = {
    body: Joi.object().keys({
        password: Joi.string().min(8).max(15).required(),
        email: Joi.string().email().required(),
    }),
};

const login = {
    body: Joi.object().keys({
        password: Joi.string().min(8).max(15).required(),
        email: Joi.string().email().required(),
    }),
};

export default { createUser, login }