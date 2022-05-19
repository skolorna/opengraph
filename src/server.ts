import { build } from "./app.js";

const server = build();

server.listen(8000, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`live at ${address}`);
});
