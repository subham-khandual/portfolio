const puppeteer = require('puppeteer-core');
const fs = require('fs');
const { URL } = require('url');

const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
let rawUrl = process.argv[2] || 'http://localhost:4173/';
let url;
try {
  const parsed = new URL(rawUrl);
  if (!parsed.protocol.startsWith('http')) {
    throw new Error('Only http(s) URLs are supported');
  }
  url = parsed.href;
} catch (e) {
  console.error('INVALID_URL:', rawUrl, e && e.message);
  process.exit(1);
}

const outPath = process.argv[3] || 'lh-report.json';
const tracePath = process.argv[4] || 'lh-trace.json';
console.log('Target:', url, 'out:', outPath, 'trace:', tracePath);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--window-size=1440,900'
    ]
  });

  let page;
  let perfMetrics = {};
  try {
    page = await browser.newPage();

    await page.setViewport({
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });

    const ua = 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
    await page.setUserAgent(ua);

    const requests = new Map();
    const consoleMessages = [];

    await page.setCacheEnabled(false);

    // Track each outgoing request so we can attach the matching response.
    page.on('request', (req) => {
      const key = `${req.method()}::${req.url()}`;
      requests.set(key, {
        url: req.url(),
        method: req.method(),
        resourceType: req.resourceType()
      });
    });

    page.on('response', (res) => {
      const key = `::${res.url()}`;
      const entry = Array.from(requests.values()).find(r => r.url === res.url());
      if (!entry) {
        // Fallback in case the matching request event was missed.
        requests.set(key, {
          url: res.url(),
          method: 'GET',
          resourceType: res.request()?.resourceType?.() || 'other',
          status: res.status(),
          mimeType: res.headers()['content-type'] || res.headers()['content-type'] || '',
          size: parseInt(res.headers()['content-length'] || '0', 10)
        });
        return;
      }
      entry.status = res.status();
      entry.mimeType = res.headers()['content-type'] || res.headers()['content-type'] || '';
      entry.size = parseInt(res.headers()['content-length'] || '0', 10);
    });

    page.on('console', (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location() && msg.location()
      });
    });

    await page.goto(url, {
      waitUntil: 'load',
      timeout: 40000
    });

    await page.waitForNetworkIdle({ timeout: 10000 }).catch(() => {});

    await new Promise(r => setTimeout(r, 4500));

    const resources = Array.from(requests.values()).filter(r => r.url && r.url.startsWith('http'));
    const imageResources = resources.filter(r =>
      /image/.test(r.mimeType || '') ||
      /\.(png|jpg|jpeg|webp|svg|avif|apng|gif)/i.test(r.url)
    );
    const totalImageBytes = imageResources.reduce((s, r) => s + (r.size || 0), 0);
    const failedResources = resources.filter(r => (r.status || 0) >= 400);

    const errors = consoleMessages.filter(m =>
      m.type === 'error' ||
      (m.type === 'warning' && /blocked|cors|neterr|failed|refused/i.test(m.text))
    );
    const warnCount = consoleMessages.filter(m => m.type === 'warning').length;
    const errorCount = errors.length;

    fs.writeFileSync(tracePath, JSON.stringify({
      url,
      perfMetrics,
      requestsCount: resources.length,
      consoleMessagesCount: consoleMessages.length,
      imageResourcesCount: imageResources.length,
      totalImageBytes,
      failedResourcesCount: failedResources.length,
      errorCount,
      warnCount,
      requests: resources.map(r => ({
        url: r.url,
        method: r.method,
        resourceType: r.resourceType,
        status: r.status,
        mimeType: r.mimeType,
        size: r.size
      })),
      consoleMessages: consoleMessages.map(m => ({ type: m.type, text: m.text, location: m.location && m.location.url }))
    }, null, 2));

    console.log('Requests:', resources.length);
    console.log('ImageResources:', imageResources.length, 'TotalImageBytes:', totalImageBytes);
    console.log('FailedResources:', failedResources.length);
    console.log('ConsoleErrors:', errorCount, 'ConsoleWarnings:', warnCount);
    console.log('ImageDetails:', JSON.stringify(imageResources.map(r => ({
      url: r.url,
      status: r.status,
      mimeType: r.mimeType,
      size: r.size
    })), null, 2));
    console.log('FailedDetails:', JSON.stringify(failedResources.map(r => ({
      url: r.url,
      status: r.status
    })), null, 2));
    console.log('ConsoleErrorsText:', errors.map(e => e.text).join('\n'));
    console.log('TraceWritten:', tracePath);
  } finally {
    if (page) {
      await page.close();
    }
    await browser.close();
  }
})().catch(err => {
  console.error(err && err.stack || err);
  process.exit(1);
});

