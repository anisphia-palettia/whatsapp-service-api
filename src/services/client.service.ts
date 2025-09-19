import prismaClient from "@/lib/db";
import {ClientCreatePayload} from "@/schema/client.schema";

const clientService = {
    async create(data: ClientCreatePayload) {
        return prismaClient.client.create({
            data
        })
    }
}