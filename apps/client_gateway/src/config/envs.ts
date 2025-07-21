import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  AUTH_MS_HOST: string;
  AUTH_MS_PORT: number;
  USER_MS_HOST: string;
  USER_MS_PORT: number;
  PROJECTS_MS_HOST: string;
  PROJECTS_MS_PORT: number;
  TASKS_MS_HOST: string;
  TASKS_MS_PORT: number;
  COMMENTS_MS_HOST: string;
  COMMENTS_MS_PORT: number;
  NOTIFICATIONS_MS_HOST: string;
  NOTIFICATIONS_MS_PORT: number;
}

const envVarsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    AUTH_MS_HOST: joi.string().required(),
    AUTH_MS_PORT: joi.number().required(),
    USER_MS_HOST: joi.string().required(),
    USER_MS_PORT: joi.number().required(),
    PROJECTS_MS_HOST: joi.string().required(),
    PROJECTS_MS_PORT: joi.number().required(),
    TASKS_MS_HOST: joi.string().required(),
    TASKS_MS_PORT: joi.number().required(),
    COMMENTS_MS_HOST: joi.string().required(),
    COMMENTS_MS_PORT: joi.number().required(),
    NOTIFICATIONS_MS_HOST: joi.string().required(),
    NOTIFICATIONS_MS_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  AUTH_MS_HOST: envVars.AUTH_MS_HOST,
  AUTH_MS_PORT: envVars.AUTH_MS_PORT,
  USER_MS_HOST: envVars.USER_MS_HOST,
  USER_MS_PORT: envVars.USER_MS_PORT,
  PROJECTS_MS_HOST: envVars.PROJECTS_MS_HOST,
  PROJECTS_MS_PORT: envVars.PROJECTS_MS_PORT,
  TASKS_MS_HOST: envVars.TASKS_MS_HOST,
  TASKS_MS_PORT: envVars.TASKS_MS_PORT,
  COMMENTS_MS_HOST: envVars.COMMENTS_MS_HOST,
  COMMENTS_MS_PORT: envVars.COMMENTS_MS_PORT,
  NOTIFICATIONS_MS_HOST: envVars.NOTIFICATIONS_MS_HOST,
  NOTIFICATIONS_MS_PORT: envVars.NOTIFICATIONS_MS_PORT,
};
