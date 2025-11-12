import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const PORT = Number(Deno.env.get("PORT") ?? 8787);

const router = new Router();
router.get("/health", (ctx) => {
  ctx.response.type = "json";
  ctx.response.body = { ok: true, service: "loanit-api", time: new Date().toISOString() };
});

const app = new Application();

app.use(oakCors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: PORT });