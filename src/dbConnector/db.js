import {PrismaClient} from "@prisma/client";
import chalk from "chalk";

export const prisma = new PrismaClient()

prisma.$on('beforeExit', async () => {
    console.log(chalk.red('\nServer shut down'))
    // Write report
    // await prisma.log.create...
})