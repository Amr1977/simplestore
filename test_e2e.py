import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.path.insert(0, r"C:\Users\amr\.agents\skills\webapp-testing")

from playwright.sync_api import sync_playwright

results = []


def assert_eq(actual, expected, label):
    status = "PASS" if actual == expected else "FAIL"
    results.append((label, status, actual, expected))
    print(f"  [{status}] {label}")


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})

    console_logs = []
    page_errors = []

    def on_console(msg):
        text = msg.text
        if "_devtools" not in text and "React DevTools" not in text:
            console_logs.append(f"{msg.type}: {text}")

    page.on("console", on_console)
    page.on("pageerror", lambda err: page_errors.append(str(err)))

    print("=== Navigating to homepage ===")
    page.goto("http://localhost:5173", wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(8000)
    page.screenshot(path="/tmp/e2e_homepage.png", full_page=True)

    print("\n=== Page Title ===")
    title = page.title()
    print(f"  {title}")
    assert_eq(
        "بقالة أبو قير | كل احتياجات البيت" in title, True, "Title contains store name"
    )

    print("\n=== Store Error State ===")
    body_text = page.inner_text("body")
    print(f"  Body text: {repr(body_text[:200])}")
    assert_eq(
        "المتجر غير متاح حالياً" in body_text, True, "Shows store unavailable message"
    )
    assert_eq("نعتذر عن الإزعاج" in body_text, True, "Shows apology text")

    print("\n=== Header Elements ===")
    header_html = page.evaluate('document.querySelector("header")?.innerHTML')
    assert_eq(header_html is not None and len(header_html) > 0, True, "Header rendered")
    assert_eq(
        "animate-pulse" in (header_html or ""), True, "Header shows loading skeleton"
    )

    print("\n=== No JS Errors ===")
    print(f"  Console logs: {len(console_logs)}")
    print(f"  Page errors: {len(page_errors)}")
    for err in page_errors:
        print(f"    ERROR: {err}")
    assert_eq(len(page_errors), 0, "No page errors")

    print("\n=== Navigation ===")
    nav_links = page.evaluate("""() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.map(a => a.getAttribute('href')).filter(Boolean);
    }""")
    print(f"  Found {len(nav_links)} links")

    print("\n=== Routing ===")
    page.goto(
        "http://localhost:5173/cart", wait_until="domcontentloaded", timeout=30000
    )
    page.wait_for_timeout(3000)
    page.screenshot(path="/tmp/e2e_cart.png", full_page=True)
    cart_text = page.inner_text("body")
    print(f"  Cart page text: {repr(cart_text[:200])}")
    assert_eq(
        "المتجر غير متاح حالياً" in cart_text, True, "Cart page shows store unavailable"
    )

    page.goto(
        "http://localhost:5173/checkout", wait_until="domcontentloaded", timeout=30000
    )
    page.wait_for_timeout(3000)
    checkout_text = page.inner_text("body")
    print(f"  Checkout page text: {repr(checkout_text[:200])}")
    assert_eq(
        "المتجر غير متاح حالياً" in checkout_text,
        True,
        "Checkout page shows store unavailable",
    )

    page.goto(
        "http://localhost:5173/search?q=أرز",
        wait_until="domcontentloaded",
        timeout=30000,
    )
    page.wait_for_timeout(3000)
    search_text = page.inner_text("body")
    print(f"  Search page text: {repr(search_text[:200])}")
    assert_eq(
        "المتجر غير متاح حالياً" in search_text,
        True,
        "Search page shows store unavailable",
    )

    page.goto(
        "http://localhost:5173/admin/login",
        wait_until="domcontentloaded",
        timeout=30000,
    )
    page.wait_for_timeout(3000)
    admin_text = page.inner_text("body")
    print(f"  Admin login text: {repr(admin_text[:200])}")
    assert_eq(
        "تسجيل دخول" in admin_text or "البريد الإلكتروني" in admin_text,
        True,
        "Admin login page renders",
    )

    page.goto(
        "http://localhost:5173/admin", wait_until="domcontentloaded", timeout=30000
    )
    page.wait_for_timeout(3000)
    admin_dash_text = page.inner_text("body")
    print(f"  Admin dashboard text: {repr(admin_dash_text[:200])}")
    assert_eq(
        "تسجيل دخول" in admin_dash_text or "يجب تسجيل الدخول" in admin_dash_text,
        True,
        "Admin dashboard redirects to login",
    )

    print("\n=== HTML Lang/Dir ===")
    html_lang = page.evaluate("document.documentElement.lang")
    html_dir = page.evaluate("document.documentElement.dir")
    print(f"  lang={html_lang}, dir={html_dir}")
    assert_eq(html_lang, "ar", "HTML lang is Arabic")
    assert_eq(html_dir, "rtl", "HTML dir is RTL")

    print("\n=== Viewport Meta ===")
    viewport = page.evaluate("""() => {
      const m = document.querySelector('meta[name="viewport"]');
      return m ? m.getAttribute('content') : '';
    }""")
    print(f"  viewport={viewport}")
    assert_eq("width=device-width" in (viewport or ""), True, "Viewport meta present")

    print("\n=== Responsive Breakpoints ===")
    for w, h, name in [
        (360, 800, "small"),
        (768, 1024, "tablet"),
        (1280, 800, "desktop"),
    ]:
        page.set_viewport_size({"width": w, "height": h})
        page.wait_for_timeout(1000)
        page.screenshot(path=f"/tmp/e2e_{name}.png", full_page=False)
        print(f"  {name} ({w}x{h}): screenshot saved")

    page.set_viewport_size({"width": 390, "height": 844})

    print("\n=== Font Loading ===")
    fonts = page.evaluate("""() => {
      return document.fonts ? Array.from(document.fonts).map(f => f.family).slice(0, 5) : [];
    }""")
    print(f"  Loaded fonts: {fonts}")

    browser.close()

print("\n=== E2E Test Results ===")
passed = sum(1 for _, s, _, _ in results if s == "PASS")
failed = sum(1 for _, s, _, _ in results if s == "FAIL")
for label, status, actual, expected in results:
    marker = "✓" if status == "PASS" else "✗"
    print(f"  {marker} [{status}] {label}")
print(f"\nTotal: {passed} passed, {failed} failed")

if failed > 0:
    sys.exit(1)
