import prismaClient from "@/lib/db";
import {ClientCreatePayload, ClientDeletePayload} from "@/schema/client.schema";

const clientService = {
    async create(data: ClientCreatePayload) {
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
    async delete(data: ClientDeletePayload) {
        return prismaClient.client.delete({
            where: {
                id: Number(data.id),
            }, include: {
                clientKey: {
                    select: {
                        key: true
                    }
                }
            }
        })
    }
}
export default clientService;