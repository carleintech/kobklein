# Lighthouse PWA Audit - Manual Instructions

Since automated Lighthouse requires additional setup, here's how to run it manually in Chrome:

## 🔍 Manual Lighthouse Audit

### Option 1: Chrome DevTools (Recommended)

1. **Open your PWA in Chrome:**

   ```
   http://localhost:3000
   ```

2. **Open Chrome DevTools:**

   - Press `F12` or `Ctrl+Shift+I`
   - Or right-click → "Inspect"

3. **Run Lighthouse:**

   - Click the **Lighthouse** tab (or **Audits** in older Chrome)
   - Select categories:
     - ✅ Performance
     - ✅ Progressive Web App
     - ✅ Accessibility
     - ✅ Best Practices
   - Device: **Mobile**
   - Click **"Analyze page load"**

4. **Wait for results** (30-60 seconds)

5. **Review scores:**
   - PWA score should be ≥ 90
   - Performance ≥ 80
   - Accessibility ≥ 90
   - Best Practices ≥ 90

### Option 2: Lighthouse CLI (If Node.js is available)

```bash
# Install globally
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view

# Or with specific categories
lighthouse http://localhost:3000 \
  --only-categories=pwa,performance,accessibility,best-practices \
  --output html \
  --output-path ./lighthouse-report.html \
  --view
```

### Option 3: Online Tool

1. Deploy to a public URL (temporary)
2. Visit: https://pagespeed.web.dev/
3. Enter your URL
4. Click "Analyze"

---

## 📊 Expected PWA Scores

### PWA Category (Target: 100)

- ✅ **Installable** - manifest.json valid
- ✅ **Service Worker** - sw.js registered
- ✅ **Offline Capable** - offline page works
- ✅ **HTTPS** - Required for production (localhost OK for dev)
- ✅ **Responsive** - Mobile-friendly design
- ✅ **Fast Loading** - Optimized resources

### Performance (Target: ≥80)

- First Contentful Paint < 1.8s
- Largest Contentful Paint < 2.5s
- Total Blocking Time < 200ms
- Cumulative Layout Shift < 0.1
- Speed Index < 3.4s

### Accessibility (Target: ≥90)

- Color contrast ratios
- ARIA labels
- Alt text for images
- Keyboard navigation
- Screen reader support

### Best Practices (Target: ≥90)

- HTTPS (in production)
- No console errors
- Valid HTML
- Secure dependencies
- No deprecated APIs

---

## 🎯 PWA Checklist

### Core PWA Requirements

- [ ] Web app manifest (`manifest.json`)
- [ ] Service worker registered and active
- [ ] HTTPS (localhost is OK for testing)
- [ ] Responsive meta viewport tag
- [ ] Content sized correctly for viewport
- [ ] Page loads fast on mobile networks
- [ ] Works offline or on flaky connections
- [ ] User can install to home screen

### Enhanced PWA Features

- [ ] Fast loading (< 3s on 3G)
- [ ] Works cross-browser
- [ ] Smooth page transitions
- [ ] Each page has a URL
- [ ] Offline page displays correctly
- [ ] Service worker caches resources
- [ ] Updates available notification

---

## 🔍 What to Look For

### In the PWA Report

1. **Installability:**

   - "Fast and reliable" badge
   - "Installable" badge
   - Manifest checks passed

2. **Service Worker:**

   - "Service worker registered"
   - "Service worker controls page"
   - "Has fetch handler"

3. **Offline:**
   - "Responds with 200 when offline"
   - "Offline fallback page"

### Common Issues & Fixes

#### ❌ "Page does not work offline"

**Fix:** Ensure service worker is registered and caching properly.
Check: `web/public/sw.js` is present and registered.

#### ❌ "Web app manifest missing"

**Fix:** Verify `manifest.json` is in public folder.
Check: `web/public/manifest.json` exists.

#### ❌ "Not served over HTTPS"

**Fix:** Deploy to HTTPS host for production testing.
Note: localhost is exempt from this requirement.

#### ❌ "Viewport not mobile-friendly"

**Fix:** Already included in layout.
Check: `<meta name="viewport" content="width=device-width, initial-scale=1">`

---

## 📸 Screenshots to Take

1. Overall Lighthouse scores
2. PWA badge (should be green)
3. Performance metrics timeline
4. PWA installability section
5. Service worker details
6. Any warnings or failures

---

## 🎨 Testing Offline Mode

### In Chrome DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Change throttling to **Offline**
4. Refresh the page (F5)
5. You should see the offline page with:
   - "You're Currently Offline" message
   - Retry connection button
   - List of available offline features
   - KobKlein branding

### In Application Tab

1. DevTools → **Application** tab
2. Click **Service Workers**
3. Verify status: "activated and is running"
4. Click **Offline** checkbox
5. Refresh page
6. Service worker should serve cached content or offline page

---

## 🚀 After Lighthouse Audit

### If Scores Are Good (≥90 PWA)

1. ✅ Document scores in summary
2. ✅ Take screenshots for records
3. ✅ Move to deployment phase
4. ✅ Celebrate! 🎉

### If Improvements Needed

1. Review specific recommendations
2. Fix critical issues first
3. Re-run audit
4. Iterate until scores improve

---

## 📝 Lighthouse Report Template

Copy this after running the audit:

```markdown
## Lighthouse Audit Results

**Date:** October 4, 2025
**URL:** http://localhost:3000
**Device:** Mobile
**Connection:** Simulated 4G

### Scores

- **PWA:** \_\_/100
- **Performance:** \_\_/100
- **Accessibility:** \_\_/100
- **Best Practices:** \_\_/100

### PWA Details

- Installable: ✅/❌
- Service Worker: ✅/❌
- Offline Capable: ✅/❌
- Fast & Reliable: ✅/❌

### Key Metrics

- First Contentful Paint: \_\_ s
- Largest Contentful Paint: \_\_ s
- Total Blocking Time: \_\_ ms
- Cumulative Layout Shift: \_\_
- Speed Index: \_\_ s

### Issues Found

1. [List any warnings or failures]
2. [With their severity]

### Recommendations

1. [Lighthouse suggestions]
2. [Priority order]
```

---

## 🔗 Resources

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker Testing](https://developer.chrome.com/docs/workbox/service-worker-lifecycle/)
- [Performance Budgets](https://web.dev/performance-budgets-101/)

---

_Run this audit and paste results into: `docs/LIGHTHOUSE_AUDIT_RESULTS.md`_
