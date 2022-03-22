import { serve } from "./deps.ts";
import { Router } from "./router.ts";
import { jwtAuth } from "./middleware/jwt.ts";
import { get, register, login } from "./handler/auth.ts";

const router = new Router();
router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.get("/api/auth/:id", get, jwtAuth);

async function handler(req: Request) {
  return await router.route(req);
}

serve(handler, { port: 8000 });
console.log("Server start!");
