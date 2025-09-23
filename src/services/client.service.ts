import prismaClient from "@/lib/db";
import {Prisma} from "@/generated";

import ClientCreateInput = Prisma.ClientCreateInput;

const clientService = {
    async create(data: ClientCreateInput) {
        return prismaClient.client.create({
            data: {
                ...data,
                clientKey: {
                    create: {}
                }
            },
            include: {
                clientKey: {
                    select: {
                        key: true
                    }
                }
            }
        })
    },
    async deleteById(id: number) {
        return prismaClient.client.delete({
            where: {
                id,
            }, include: {
                clientKey: {
                    select: {
                        key: true
                    }
                }
            }
        })
    },
    async findById(id: number) {
        return prismaClient.client.findFirst({
            where: {
                id
            }
        })
    }
}
export default clientService;