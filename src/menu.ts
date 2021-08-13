import fetch from "node-fetch";
import puppeteer from "puppeteer";

const { MENU_PROXY_ENDPOINT = "https://api-staging.skolorna.com/v1/mp" } =
  process.env;

interface IMenu {
  title: string;
}

export function templateMenuImage(data: IMenu): string {
  return `
		<html>
		<head>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
			<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet"> 
			<style>
				body {
					margin: 0;
				}
				
				h1 {
					font: 500 80px/1.1 "Space Grotesk", sans-serif;
					letter-spacing: -0.022em;
					margin: 0;
					overflow-wrap: break-word;
					position: absolute;
					top: 80px;
					left: 80px;
					right: 80px;
					z-index: 1;
				}

				.logo {
					font: 500 40px/1 "Space Grotesk", sans-serif;
					letter-spacing: -0.01em;
					color: #666;
					position: fixed;
					bottom: 80px;
					right: 80px;
				}

				.ascii {
					font: 400 40px/1 "JetBrains Mono", monospace;
					position: fixed;
					bottom: 80px;
					left: 80px;
					white-space: nowrap;
					color: #eee;
				}
			</style>
		</head>
		<body>
			<h1>${data.title}</h1>
			<span class="ascii">┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴</span>
			<span class="logo">Skolorna</span>
		</body>
	</html>`;
}

export async function generateMenuImage(menu: string): Promise<Buffer | null> {
  const res = await fetch(
    `${MENU_PROXY_ENDPOINT}/menus/${encodeURIComponent(menu)}`
  );

  if (res.status === 404) {
    return null;
  }

  const data: IMenu = await res.json();

  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox", // Issues with permissions forced me to do this.
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 600,
  });
  await page.setContent(templateMenuImage(data));
  // Instead of waiting for all network connections to close (networkidle0),
  // just wait for the fonts to load (since that is the only thing we care about).
  await page.evaluateHandle("document.fonts.ready");

  const buf = await page.screenshot({ encoding: "binary" });

  if (!Buffer.isBuffer(buf)) {
    throw new Error("buf is not buffer");
  }

  return buf;
}
