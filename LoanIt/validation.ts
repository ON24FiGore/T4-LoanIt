import { Context, Next } from "@oak/oak";
import Joi, { ObjectSchema } from "npm:joi";

export const createItemSchema = Joi.object({
  ownerId: Joi.string().required(),
  name: Joi.string().min(1).required(),
  description: Joi.string().allow("").optional()
});

export const updateItemSchema = Joi.object({
  ownerId: Joi.string().optional(),
  name: Joi.string().min(1).optional(),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("available", "borrowed").optional(),
  borrowerId: Joi.string().allow(null).optional()
}).or("ownerId", "name", "description", "status", "borrowerId");

export const validate = (schema: ObjectSchema) =>
  async (ctx: Context, next: Next) => {
    let body: unknown;

    try {
      body = await ctx.request.body.json();
    } catch {
      ctx.response.status = 400;
      ctx.response.body = { errors: ["Invalid or missing JSON body"] };
      return;
    }

    const { error, value } = schema.validate(body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        errors: error.details.map((d) => d.message)
      };
      return;
    }

    (ctx.state as Record<string, unknown>).payload = value;

    await next();
  };