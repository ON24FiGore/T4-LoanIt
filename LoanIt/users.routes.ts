import { Router } from "@oak/oak/router";

export const usersRouter = new Router({ prefix: "/users" });

usersRouter.post("/register", async (ctx) => {
  const kv = await Deno.openKv();
  const body = await ctx.request.body.json();

  const { id, email, password } = body;

  const existing = await kv.get(["users", id]);
  if (existing.value) {
    ctx.response.status = 400;
    ctx.response.body = { error: "User existiert bereits." };
    return;
  }

  const newUser = { id, email, password };
  await kv.set(["users", id], newUser);

  ctx.response.status = 201;
  ctx.response.body = { message: "Registrierung erfolgreich", user: newUser };
});

usersRouter.post("/login", async (ctx) => {
  const kv = await Deno.openKv();
  const body = await ctx.request.body.json();

  const { id, password } = body;

  const stored = await kv.get(["users", id]);
  if (!stored.value) {
    ctx.response.status = 400;
    ctx.response.body = { error: "User existiert nicht." };
    return;
  }

  if (stored.value.password !== password) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Passwort falsch." };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = { message: "Login erfolgreich", user: stored.value };
});
