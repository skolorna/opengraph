import fastify from "fastify";
import { generateMenuImage } from "./menu.js";

interface IParams {
  menu: string;
}

export function build() {
  const app = fastify();

  app.get<{
    Params: IParams;
  }>("/menus/:menu", async (req, res) => {
    const buf = await generateMenuImage(req.params.menu);

    if (!buf) {
      return res.status(404).send("menu not found");
    }

    return res
      .header("content-type", "image/png")
      .header("cache-control", "max-age=86400")
      .send(buf);
  });

  app.get("/health", async (_req, res) => {
    return res.header("cache-control", "no-store").send("OK!");
  });

  return app;
}
