import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  const { html, styles } = await req.json();

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });

  const page = await browser.newPage();

  await page.setContent(
    `
    <html>
      <head>
        <style>
          ${styles}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
    `,
    { waitUntil: "networkidle0" }
  );

  const screenshotBuffer = await page.screenshot({
    type: "png",
    fullPage: true,
  });

  await browser.close();

  return new Response(screenshotBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="summary.png"',
    },
  });
}