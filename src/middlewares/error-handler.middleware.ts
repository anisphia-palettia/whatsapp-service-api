import {ErrorHandler} from "hono";
import {Prisma} from "@/generated";
import apiResponse from "@/utils/api-response";

const errorHandlerMiddleware: ErrorHandler = (err, c) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                return apiResponse.error(
                    c,
                    "Duplicate entry. Field must be unique.",
                    409
                );
            case "P2025":
                return apiResponse.error(c, "Record not found.", 404);
            default:
                return apiResponse.error(c, `Prisma error: ${err.code}`, 400);
        }
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        return apiResponse.error(c, "Invalid data provided.", 400);
    }

    return apiResponse.error(
        c,
        err?.message || "Internal Server Error",
        500
    );
};

export default errorHandlerMiddleware;
