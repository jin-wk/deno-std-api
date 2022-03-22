import { Model, ValidationErrors } from "../deps.ts";

export function response(
  status: number,
  message: string,
  data?: Model | ValidationErrors | null | undefined
) {
  return new Response(
    JSON.stringify({
      message: message,
      data: data,
    }),
    { status: status }
  );
}
