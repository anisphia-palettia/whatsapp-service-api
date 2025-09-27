import {Prisma, PrismaClient} from "@/generated";

import ClientCreateInput = Prisma.ClientCreateInput;

export default class ClientService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async create(data: ClientCreateInput) {
        return this.prisma.client.create({
            data
        })
    }

    async deleteById(id: string) {
        return this.prisma.client.delete({
            where: {
                id
            },
        })
    }

    async findById(id: string) {
        return this.prisma.client.findFirst({
            where: {
                id
            }
        })
    }
}
