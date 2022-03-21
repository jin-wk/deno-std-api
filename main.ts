import { serve } from "./deps.ts";
import { Router } from "./router.ts";
import { get, register } from "./handler/auth.ts";

const router = new Router();
router.get("/api/auth/:id", get);
router.post("/api/auth", register);

async function handler(req: Request) {
  return await router.route(req);
}

serve(handler, { port: 8000 });
console.log("Server start!");
