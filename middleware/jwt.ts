// deno-lint-ignore-file no-explicit-any
import { response } from "../core/response.ts";
import { jose } from "../deps.ts";

export const jwtConfig = {
  header: "Authorization",
  schema: "Bearer",
  secret: new TextEncoder().encode(Deno.env.get("JWT_SECRET_KEY")),
  exp: Deno.env.get("JWT_EXPIRE_TIME") || "1h",
  typ: "JWT",
  alg: "HS256",
};

export async function jwtSign(payload: Record<string, any>): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(jwtConfig.exp)
    .sign(jwtConfig.secret);
}

export async function jwtAuth(req: Request): Promise<Response | null> {
  const token = req.headers
    .get(jwtConfig.header)
    ?.replace(`${jwtConfig.schema} `, "");

  if (!token || !(await jose.jwtVerify(token, jwtConfig.secret))) {
    return response(401, "Unauthorized");
  }

  return null;
}
