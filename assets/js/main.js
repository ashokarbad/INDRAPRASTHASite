/* Indraprastha by Pankti — site behaviour */
(function () {
  "use strict";

  const C = window.SITE_CONFIG || {};
  const MENU = window.MENU_DATA || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Time helpers (always restaurant-local time) ---------- */
  const tz = C.timezone || "Asia/Kolkata";
  function nowParts() {
    const f = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false
    });
    const p = Object.fromEntries(f.formatToParts(new Date()).map(x => [x.type, x.value]));
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      date: `${p.year}-${p.month}-${p.day}`,
      minutes: (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10),
      dow: days[p.weekday]
    };
  }
  const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fmt12 = mins => {
    const h = Math.floor(mins / 60), m = mins % 60;
    const ap = h >= 12 ? "PM" : "AM";
    const hh = ((h + 11) % 12) + 1;
    return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
  };

  /* ---------- Contact wiring from config ---------- */
  const phoneDigits = (C.phone || "").replace(/[^\d+]/g, "");
  const waDigits = (C.whatsapp || C.phone || "").replace(/\D/g, "");
  const mapsSearch = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.mapQuery || C.name);

  $$("[data-phone-link]").forEach(a => {
    if (!phoneDigits) return;
    a.href = "tel:" + phoneDigits;
    if (!a.textContent.trim()) a.textContent = C.phone;
  });
  $$("[data-whatsapp-link]").forEach(a => { if (waDigits) a.href = "https://wa.me/" + waDigits; });
  $$("[data-email-link]").forEach(a => { if (C.email) { a.href = "mailto:" + C.email; a.textContent = C.email; } });
  $$("[data-instagram-link]").forEach(a => { if (C.instagram) a.href = C.instagram; });

  $$("[data-needs-phone]").forEach(el => {
    const isWa = el.matches("[data-whatsapp-link]") || !!el.querySelector("[data-whatsapp-link]");
    el.classList.toggle("is-hidden", isWa ? !waDigits : !phoneDigits);
  });
  $$("[data-needs-email]").forEach(el => el.classList.toggle("is-hidden", !C.email));
  $$("[data-needs-instagram]").forEach(el => el.classList.toggle("is-hidden", !C.instagram));
  $$("[data-no-contact]").forEach(el => el.classList.toggle("is-hidden", !!(phoneDigits || C.email)));
  const mbar = $("#mbar");
  if (!phoneDigits && mbar) mbar.classList.add("has-no-phone");

  const dir = $("#directionsLink"); if (dir) dir.href = mapsSearch;
  const fml = $("#footerMapLink"); if (fml) fml.href = mapsSearch;
  const mapFrame = $("#mapFrame");
  if (mapFrame) {
    // Load the map only when it scrolls near view (saves bandwidth on mobile)
    const src = "https://www.google.com/maps?q=" + encodeURIComponent(C.mapQuery || C.name) + "&z=16&output=embed";
    if ("IntersectionObserver" in window) {
      const mo = new IntersectionObserver(es => {
        if (es[0].isIntersecting) { mapFrame.src = src; mo.disconnect(); }
      }, { rootMargin: "400px" });
      mo.observe(mapFrame);
    } else mapFrame.src = src;
  }

  // Google rating from config
  if (C.googleRating) {
    $$("[data-rating]").forEach(el => { el.textContent = Number(C.googleRating).toFixed(1); });
    $$("[data-rating-stars]").forEach(el => el.style.setProperty("--rating", C.googleRating));
  }
  if (C.googleReviewCount) $$("[data-review-count]").forEach(el => { el.textContent = C.googleReviewCount; });
  $$("[data-google-reviews]").forEach(a => { a.href = mapsSearch; });

  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Structured data (SEO) ---------- */
  const ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: C.name,
    image: new URL("assets/img/og-image.jpg", location.href).href,
    logo: new URL("assets/img/logo.webp", location.href).href,
    servesCuisine: ["North Indian", "Delhi"],
    priceRange: "₹200–₹400",
    acceptsReservations: true,
    slogan: "Ghar ka swaad, apno ke saath",
    parentOrganization: { "@type": "Organization", name: C.parent },
    address: {
      "@type": "PostalAddress",
      streetAddress: C.address && C.address.street,
      addressLocality: [C.address && C.address.locality, C.address && C.address.city].filter(Boolean).join(", "),
      postalCode: C.address && C.address.postalCode,
      addressRegion: C.address && C.address.region,
      addressCountry: C.address && C.address.country
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: C.open, closes: C.close
    }],
    hasMenu: location.href.split("#")[0] + "#menu"
  };
  if (C.phone) ld.telephone = C.phone;
  if (C.instagram) ld.sameAs = [C.instagram];
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(ld);
  document.head.appendChild(s);

  /* ---------- Open / closed status + today's hours ---------- */
  function updateStatus() {
    const n = nowParts();
    const open = n.minutes >= toMin(C.open || "09:00") && n.minutes < toMin(C.close || "23:00");
    $$("[data-open-status]").forEach(el => {
      el.classList.toggle("is-open", open);
      el.classList.toggle("is-closed", !open);
      el.textContent = open ? "Open now" : "Closed now";
    });
    $$("#hoursTable tr").forEach(tr => tr.classList.toggle("is-today", Number(tr.dataset.day) === n.dow));
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Nav: solid on scroll, active link, drawer ---------- */
  const nav = $("#nav");
  const heroBg = $(".hero__bg");
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-solid", y > 40);
    if (mbar) mbar.classList.toggle("is-visible", y > window.innerHeight * 0.6);
    if (!reduceMotion) {
      if (heroBg && y < window.innerHeight * 1.2) heroBg.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
      $$("[data-parallax]").forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const k = parseFloat(img.dataset.parallax);
        const lim = r.height * 0.05;
        const off = Math.max(-lim, Math.min(lim, (r.top + r.height / 2 - window.innerHeight / 2) * k));
        img.style.transform = `translate3d(0, ${off}px, 0)`;
      });
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  const navLinks = $$("[data-nav]");
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(sec => so.observe(sec));
  }

  const burger = $("#burger"), drawer = $("#drawer");
  function setDrawer(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", () => setDrawer(burger.getAttribute("aria-expanded") !== "true"));
  $$("#drawer a").forEach(a => a.addEventListener("click", () => setDrawer(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("is-open")) setDrawer(false); });

  /* ---------- Menu ---------- */
  const tabsEl = $("#menuTabs"), panelsEl = $("#menuPanels");
  const esc = str => String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  MENU.forEach((cat, i) => {
    const tab = document.createElement("button");
    tab.className = "tab";
    tab.id = "tab-" + cat.id;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "panel-" + cat.id);
    tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.textContent = cat.title;
    tabsEl.appendChild(tab);

    const panel = document.createElement("div");
    panel.className = "menu__panel";
    panel.id = "panel-" + cat.id;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.hidden = i !== 0;
    panel.innerHTML = `
      <div class="menu__panel-head"><h3>${esc(cat.title)}</h3><p>${esc(cat.subtitle || "")}</p></div>
      <ul class="dishes">
        ${cat.items.map((d, j) => `
          <li class="dish" style="--i:${j}">
            <div class="dish__top">
              <span class="dish__name"><span class="veg" title="Vegetarian" aria-label="Vegetarian"></span>${esc(d.name)}${d.sig ? ' <span class="sig-chip">Signature</span>' : ""}</span>
              <span class="dish__dots" aria-hidden="true"></span>
              <span class="dish__price">₹${esc(d.price)}</span>
            </div>
            <p class="dish__desc">${esc(d.desc)}</p>
          </li>`).join("")}
      </ul>`;
    panelsEl.appendChild(panel);
  });

  const tabs = $$(".tab", tabsEl);
  function selectTab(tab, focus) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const p = document.getElementById(t.getAttribute("aria-controls"));
      if (on) {
        // re-trigger the entrance animation
        p.hidden = false;
        p.style.animation = "none"; void p.offsetWidth; p.style.animation = "";
        $$(".dish", p).forEach(d => { d.style.animation = "none"; void d.offsetWidth; d.style.animation = ""; });
      } else p.hidden = true;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", e => {
      let k = null;
      if (e.key === "ArrowRight") k = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") k = (i - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") k = 0;
      if (e.key === "End") k = tabs.length - 1;
      if (k !== null) { e.preventDefault(); selectTab(tabs[k], true); }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    // small stagger for siblings
    reveals.forEach(el => {
      const sibs = $$(":scope > .reveal", el.parentElement);
      const idx = sibs.indexOf(el);
      if (idx > 0) el.style.setProperty("--rd", Math.min(idx, 6) * 0.08 + "s");
      ro.observe(el);
    });
  } else reveals.forEach(el => el.classList.add("is-in"));

  /* ---------- Gallery lightbox ---------- */
  const items = $$(".g-item");
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let cur = 0, lastFocus = null;
  function show(i) {
    cur = (i + items.length) % items.length;
    const it = items[cur];
    lbImg.src = it.dataset.full;
    lbImg.alt = $("img", it).alt;
    lbCap.textContent = it.dataset.caption || "";
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
  }
  function openLb(i) { lastFocus = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = "hidden"; $(".lb-close", lb).focus(); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  items.forEach((it, i) => it.addEventListener("click", () => openLb(i)));
  $(".lb-close", lb).addEventListener("click", closeLb);
  $(".lb-prev", lb).addEventListener("click", () => show(cur - 1));
  $(".lb-next", lb).addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });
  let tx = null;
  lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    tx = null;
  });

  /* ---------- Reservation form ---------- */
  const form = $("#reserveForm"), dateIn = $("#rDate"), timeSel = $("#rTime"), msg = $("#rMsg");
  const openM = toMin(C.open || "09:00"), lastM = toMin(C.lastSeating || "22:30");

  function maxDate(fromIso, days) {
    const d = new Date(fromIso + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }
  function fillTimes() {
    const n = nowParts();
    const isToday = dateIn.value === n.date;
    const prev = timeSel.value;
    timeSel.innerHTML = "";
    let count = 0;
    for (let m = openM; m <= lastM; m += 30) {
      if (isToday && m < n.minutes + 30) continue; // need at least 30 min notice
      const o = document.createElement("option");
      o.value = fmt12(m);
      o.textContent = fmt12(m);
      timeSel.appendChild(o);
      count++;
    }
    if (!count) {
      const o = document.createElement("option");
      o.value = ""; o.textContent = "No slots left today";
      timeSel.appendChild(o);
    } else {
      // sensible default: 8:00 PM if available
      const pref = [...timeSel.options].find(o => o.value === prev) || [...timeSel.options].find(o => o.value === "8:00 PM");
      if (pref) pref.selected = true;
    }
  }
  if (form) {
    const n = nowParts();
    dateIn.min = n.date;
    dateIn.max = maxDate(n.date, 90);
    // default to today, or tomorrow if today's seatings are over
    dateIn.value = n.minutes + 30 > lastM ? maxDate(n.date, 1) : n.date;
    fillTimes();
    dateIn.addEventListener("change", fillTimes);

    form.addEventListener("submit", e => {
      e.preventDefault();
      msg.className = "r-form__msg";
      let ok = true;
      $$(".field", form).forEach(f => f.classList.remove("is-invalid"));
      const fd = new FormData(form);
      const name = (fd.get("name") || "").trim();
      const phone = (fd.get("phone") || "").trim();
      const digits = phone.replace(/\D/g, "");
      const F = form.elements;
      const checks = [
        [F.namedItem("name"), name.length >= 2],
        [F.namedItem("phone"), digits.length >= 10 && digits.length <= 13],
        [F.namedItem("date"), !!fd.get("date") && fd.get("date") >= dateIn.min],
        [F.namedItem("time"), !!fd.get("time")]
      ];
      checks.forEach(([el, good]) => { if (!good) { ok = false; el.closest(".field").classList.add("is-invalid"); } });
      if (!ok) {
        msg.textContent = "Please check the highlighted fields.";
        msg.classList.add("is-error");
        const first = $(".is-invalid input, .is-invalid select", form); if (first) first.focus();
        return;
      }

      const dateNice = new Date(fd.get("date") + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      const lines = [
        `Table request — ${C.name}`,
        ``,
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Date: ${dateNice}`,
        `Time: ${fd.get("time")}`,
        `Guests: ${fd.get("guests")}`
      ];
      if (fd.get("occasion")) lines.push(`Occasion: ${fd.get("occasion")}`);
      if ((fd.get("notes") || "").trim()) lines.push(`Requests: ${fd.get("notes").trim()}`);
      const text = lines.join("\n");

      if (!waDigits) {
        msg.textContent = "Online booking is being set up. Please walk in or call us — we'd love to host you.";
        msg.classList.add("is-error");
        console.warn("[Indraprastha] Set SITE_CONFIG.whatsapp or SITE_CONFIG.phone in assets/js/config.js to enable reservations.");
        return;
      }
      window.open("https://wa.me/" + waDigits + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      msg.textContent = "Opening WhatsApp… press Send there, and we'll confirm your table shortly.";
    });
  }
})();
