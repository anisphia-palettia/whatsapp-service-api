import {HTTPException} from "hono/http-exception";

export default function assertFound<T>(data: T | null, message: string): T {
    if (!data) throw new HTTPException(404, {message})
    return data
}