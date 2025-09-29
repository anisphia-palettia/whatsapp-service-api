import {Prisma, PrismaClient} from "@/generated/index";

import SessionCreateInput = Prisma.SessionCreateInput;
import SessionUpdateInput = Prisma.SessionUpdateInput;

export default class SessionService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async find() {
        return this.prisma.session.findMany()
    }

    async create(data: SessionCreateInput) {
        return this.prisma.session.create({
            data
        })
    }

    async deleteById(id: string | undefined) {
        return this.prisma.session.delete({
            where: {
                id
            },
        })
    }

    async findById(id: string) {
        return this.prisma.session.findFirst({
            where: {
                id
            }
        })
    }

    async update(id: string, data: SessionUpdateInput) {
        return this.prisma.session.update({
            where: {
                id
            }, data
        })
    }

    async getActiveSessions() {
        return this.prisma.session.findMany({
            where: {isActive: true}
        })
    }
}
