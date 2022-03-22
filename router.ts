// deno-lint-ignore-file no-explicit-any
import { response } from "./core/response.ts";

type CallbackHandler = (
  request: Request,
  params: Record<string, string>
) => Promise<Response>;

type Middleware = (request: Request) => Promise<Response | null>;

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

  private add(
    method: string,
    pathname: string,
    handler: CallbackHandler,
    middleware?: Middleware
  ) {
    this.routes[method].push({
      pattern: new URLPattern({ pathname }),
      handler,
      middleware,
    });
  }

  get(pathname: string, handler: CallbackHandler, middleware?: Middleware) {
    this.add(METHODS.GET, pathname, handler, middleware);
  }

  post(pathname: string, handler: CallbackHandler, middleware?: Middleware) {
    this.add(METHODS.POST, pathname, handler, middleware);
  }

  put(pathname: string, handler: CallbackHandler, middleware?: Middleware) {
    this.add(METHODS.PUT, pathname, handler, middleware);
  }

  delete(pathname: string, handler: CallbackHandler, middleware?: Middleware) {
    this.add(METHODS.DELETE, pathname, handler, middleware);
  }

  async route(req: Request): Promise<Response> {
    for (const r of this.routes[req.method]) {
      if (r.pattern.test(req.url)) {
        const params = r.pattern.exec(req.url).pathname.groups;
        try {
          if (r["middleware"]) {
            const error = await r["middleware"](req);
            if (error) {
              return error;
            }
          }
          return await r["handler"](req, params);
        } catch (err) {
          console.log(err);
          return response(500, "Internal Server Error");
        }
      }
    }
    return response(404, "Not found");
  }
}
