import { chromium } from "playwright";

(async () => {
  console.log("[diag-net] Playwright network diagnostic start");
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture failing responses
  page.on('response', async (response) => {
    try {
      const status = response.status();
      if (status >= 400) {
        const url = response.url();
        console.log(`[diag-net] RESP ${status} -> ${url}`);
        // Try to get small body (limit to 10k chars)
        let text = "";
        try {
          text = await response.text();
          if (text && text.length > 10000) text = text.slice(0, 10000) + "...(truncated)";
          console.log("[diag-net] BODY START\n" + text + "\n[diag-net] BODY END");
        } catch (err) {
          console.log("[diag-net] Cannot read body:", err.message || err);
        }
      }
    } catch (err) {
      console.log("[diag-net] Response handler error:", err.message || err);
    }
  });

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[diag-net] CONSOLE ${msg.type()}: ${msg.text()}`);
    }
  });

  const url = "http://localhost:3000/#/dashboard/overview?mode=demo";
  console.log("[diag-net] Navigating to", url);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch(e) {
    console.log("[diag-net] goto error:", e.message || e);
  }

  // give time for background requests
  await page.waitForTimeout(2000);

  // count matching buttons
  const locator = page.getByRole('button', { name: /View All Ads|Zobacz wszystkie reklamy/i });
  try {
    const cnt = await locator.count();
    console.log("[diag-net] ViewAll locator count:", cnt);
    for (let i=0;i<cnt;i++) {
      try {
        console.log(`[diag-net] button[${i}] text:`, await locator.nth(i).innerText());
      } catch(e) {
        console.log(`[diag-net] button[${i}] innerText error:`, e.message || e);
      }
    }
  } catch(e){
    console.log("[diag-net] locator count error:", e.message || e);
  }

  // frames
  const frames = page.frames();
  console.log("[diag-net] frames count:", frames.length);
  for (const f of frames) {
    try { console.log("[diag-net] frame url:", f.url()); } catch(e) { console.log("[diag-net] frame error:", e.message||e); }
  }

  await page.screenshot({ path: "diag-network-overview.png", fullPage: true });
  console.log("[diag-net] Screenshot saved: diag-network-overview.png");

  await browser.close();
  console.log("[diag-net] Done.");
})();
