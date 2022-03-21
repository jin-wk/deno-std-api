import { User } from "../model/user.ts";
import { response } from "../core/response.ts";
import { bcrypt } from "../deps.ts";

export async function register(req: Request): Promise<Response> {
  const body = await req.json();
  if ((await User.where("email", body.email).count()) > 0) {
    return response(409, "The Email is already registerd");
  }

  const { lastInsertId } = await User.create({
    email: body.email,
    password: await bcrypt.hash(body.password),
    name: body.name,
  });

  return response(201, "Created", await User.find(lastInsertId as number));
}

export async function get(
  _req: Request,
  params: Record<string, string>
): Promise<Response> {
  const user = await User.find(params.id);
  if (!user) {
    return response(404, "Not Found");
  }
  return response(200, "Ok", user);
}
