import { build } from "./app.js";
import test from 'ava';

test("health check", async (t) => {
  const app = build()

  const response = await app.inject({
    method: "GET",
    url: "/health"
  })

  t.assert(response.statusCode === 200);
})

test("menu thumbnails", async t => {
  const app = build();

  const response = await app.inject({
    method: "GET",
    url: "/menus/ef85d803-3451-5479-a9c2-54d103c76b2f"
  });

  t.assert(response.statusCode === 200);
  t.assert(response.headers["cache-control"] === "max-age=86400");
  t.assert(response.headers["content-type"] === "image/png");
});
