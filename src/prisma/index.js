// @ts-check
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;
/** @type {PrismaClient} */
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
