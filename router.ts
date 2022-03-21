// deno-lint-ignore-file no-explicit-any
import { response } from "./core/response.ts";

type CallbackHandler = (
  request: Request,
  params: Record<string, string>
) => Promise<Response>;

const METHODS: Record<string, string> = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export class Router {
  private routes: Record<string, Array<any>> = {};

  constructor() {
    for (const m in METHODS) {
      this.routes[METHODS[m]] = [];
    }
  }

  private add(method: string, pathname: string, handler: CallbackHandler) {
    this.routes[method].push({
      pattern: new URLPattern({ pathname }),
      handler,
    });
  }

  get(pathname: string, handler: CallbackHandler) {
    this.add(METHODS.GET, pathname, handler);
  }

  post(pathname: string, handler: CallbackHandler) {
    this.add(METHODS.POST, pathname, handler);
  }

  put(pathname: string, handler: CallbackHandler) {
    this.add(METHODS.PUT, pathname, handler);
  }

  delete(pathname: string, handler: CallbackHandler) {
    this.add(METHODS.DELETE, pathname, handler);
  }

  async route(req: Request): Promise<Response> {
    for (const r of this.routes[req.method]) {
      if (r.pattern.test(req.url)) {
        const params = r.pattern.exec(req.url).pathname.groups;
        try {
          return await r["handler"](req, params);
        } catch (_err) {
          return response(500, "Internal Server Error", null);
        }
      }
    }
    return response(404, "Not found", null);
  }
}
