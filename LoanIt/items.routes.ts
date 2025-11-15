import { Router } from "@oak/oak/router";
import type { Item } from "./items.types.ts";
import { createItemSchema, updateItemSchema, validate } from "./validation.ts";

const kv = await Deno.openKv();

const itemsRouter = new Router();
itemsRouter.prefix("/items");

async function getItemById(id: string) {
  const res = await kv.get(["items", id]);
  return res.value as Item | null;
}

//Alle
itemsRouter.get("/", async (ctx) => {
  try {
    const entries = kv.list({ prefix: ["items"] });
    const items: Item[] = [];
    for await (const entry of entries) {
      items.push(entry.value as Item);
    }
    ctx.response.body = items;
  } catch {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to fetch items" };
  }
});

//Einzelne
itemsRouter.get("/:id", async (ctx) => {
  try {
    const id = ctx.params.id!;
    const item = await getItemById(id);
    if (!item) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Item not found" };
      return;
    }
    ctx.response.body = item;
  } catch {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to fetch item" };
  }
});

//Anlegen
itemsRouter.post("/", validate(createItemSchema), async (ctx) => {
  try {
    const payload = (ctx.state as any).payload as {
      ownerId: string;
      name: string;
      description?: string;
    };

    const id = crypto.randomUUID();
    const newItem: Item = {
      id,
      ownerId: payload.ownerId,
      name: payload.name,
      description: payload.description,
      status: "available",
      borrowerId: null
    };

    await kv.set(["items", id], newItem);

    ctx.response.status = 201;
    ctx.response.body = { message: "Item created", item: newItem };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to create item" };
  }
});

//Aktualisieren
itemsRouter.patch("/:id", validate(updateItemSchema), async (ctx) => {
  try {
    const id = ctx.params.id!;
    const existing = await getItemById(id);
    if (!existing) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Item not found" };
      return;
    }

    const payload = (ctx.state as any).payload as Partial<Item>;
    const updated: Item = { ...existing, ...payload };

    await kv.set(["items", id], updated);
    ctx.response.status = 200;
    ctx.response.body = { message: "Item updated", item: updated };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to update item" };
  }
});

//Entfernene
itemsRouter.delete("/:id", async (ctx) => {
  try {
    const id = ctx.params.id!;
    const existing = await getItemById(id);
    if (!existing) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Item not found" };
      return;
    }

    await kv.delete(["items", id]);
    ctx.response.status = 200;
  } catch {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to delete item" };
  }
});

export { itemsRouter };