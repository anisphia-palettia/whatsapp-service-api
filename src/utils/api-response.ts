import {Context} from "hono";
import {ContentfulStatusCode} from "hono/dist/types/utils/http-status";

type ApiResponse<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
    status?: ContentfulStatusCode;
};

const response = <T>(
    c: Context,
    {success, message, data, status = 200}: ApiResponse<T>
) => {
    return c.json(
        {
            success,
            message,
            data,
        },
        status
    );
};

const success = <T>(c: Context, message: string, data?: T, status: ContentfulStatusCode = 200) =>
    response(c, {success: true, message, data, status});

const error = <T>(c: Context, message: string, data?: T, status: ContentfulStatusCode = 400) =>
    response(c, {success: false, message, data, status});

export default {response, success, error};
