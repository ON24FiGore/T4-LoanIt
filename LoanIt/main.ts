import { Application } from "@oak/oak/application";
import { itemsRouter } from "./items.routes.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { usersRouter } from "./users.routes.ts";


const app = new Application();

app.use(oakCors());

app.use(itemsRouter.routes());
app.use(itemsRouter.allowedMethods());
app.use(usersRouter.routes());
app.use(usersRouter.allowedMethods());

const PORT = 3000;

console.log(`API running on http://localhost:${PORT}`);
await app.listen({ port: PORT });