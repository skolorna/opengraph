import fastify from "fastify";
import { generateMenuImage } from "./menu.js";

const server = fastify();

interface IParams {
  menu: string;
}

server.get<{
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

server.get("/health", async (_req, res) => {
  return res.header("cache-control", "no-store").send("OK!");
});

server.listen(8000, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
