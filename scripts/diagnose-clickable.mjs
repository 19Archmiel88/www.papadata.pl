import { chromium } from "playwright";

(async () => {
  const url = "http://localhost:3000/#/dashboard/overview?mode=demo";
  console.log("[diagnose] Starting Playwright diagnostic...");
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Zbieraj console errors
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({type: msg.type(), text: msg.text()});
  });

  try {
    console.log("[diagnose] Navigating to", url);
    await page.goto(url, { waitUntil: "networkidle" , timeout: 30000 });

    // odczekaj chwilę, żeby UI się ustabilizował
    await page.waitForTimeout(1500);

    // Zbadaj lokator przycisku
    const locator = page.getByRole('button', { name: /View All Ads/i });
    let count = 0;
    try {
      count = await locator.count();
    } catch (e) {
      console.error("[diagnose] Error while counting locator:", e);
    }
    console.log("[diagnose] View All Ads matching count:", count);
    for (let i = 0; i < count; i++) {
      try {
        const text = await locator.nth(i).innerText();
        console.log(`[diagnose] button[${i}] text:`, text);
      } catch (e) {
        console.log(`[diagnose] button[${i}] innerText error:`, e.message || e);
      }
    }

    // Sprawdź, czy istnieją inne warianty tekstu w DOM (polski)
    const polish = await page.locator('text=Zobacz wszystkie reklamy').count();
    console.log("[diagnose] 'Zobacz wszystkie reklamy' count:", polish);

    // Wypisz iframe'y i ich src
    const frames = page.frames();
    console.log("[diagnose] frames count:", frames.length);
    for (const f of frames) {
      try {
        console.log("[diagnose] frame url:", f.url());
      } catch (e) {
        console.log("[diagnose] frame url read error:", e);
      }
    }

    // Wypisz ostatnie komunikaty konsoli (filtr: error/warn)
    if (consoleMessages.length) {
      console.log("[diagnose] Console messages (type:text):");
      consoleMessages.forEach((m, idx) => console.log(`[${idx}] ${m.type}: ${m.text}`));
    } else {
      console.log("[diagnose] No console messages captured.");
    }

    // Zrób screenshot statusu
    await page.screenshot({ path: "diagnose-dashboard-overview.png", fullPage: true });
    console.log("[diagnose] Screenshot saved: diagnose-dashboard-overview.png");
  } catch (err) {
    console.error("[diagnose] Exception:", err);
  } finally {
    console.log("[diagnose] Closing browser in 2s (you can inspect UI now)...");
    await page.waitForTimeout(2000);
    await browser.close();
    console.log("[diagnose] Done.");
  }
})();
