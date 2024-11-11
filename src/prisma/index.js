// @ts-check
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;
/** @type {PrismaClient} */
export const prisma = globalForPrisma.prisma || new PrismaClient();

/** @type {NodeJS.ProcessEnv} */
const env = process.env;

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
