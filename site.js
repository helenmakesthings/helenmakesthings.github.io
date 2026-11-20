/* Page logic. You shouldn't need to edit this — content lives in data.js. */
(function () {
  const page = document.body.dataset.page;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => CURRENCY + Number(n).toLocaleString();
  const MEDIUMS = [
    ["all", "Everything"], ["collage", "Collage"], ["painting", "Painting"], ["illustration", "Illustration"],
    ["textile", "Fiber & thread"], ["ceramics", "Ceramics"], ["photo", "Photo"], ["oneoff", "One-offs"],
  ];
  const cover = (w) => (w.images && w.images[0]) || w.image || "";
  const isCut = (src) => /-cut\.(webp|png)$/.test(src || "");   // cut-out photos (no background)
  const hasPrice = (b) => typeof b.price === "number";
  const yr = (w) => (w.year ? ` · ${esc(w.year)}` : "");
  const TAGS = { original: "Original", print: "Print", sold: "Sold", archive: "Not Available" };
  const forSale = (w) => w.status === "original" || w.status === "print";
  // categories that have any work, in channel order (used by the Shop menu and Shop page)
  const shopCats = MEDIUMS.filter(([k]) => k !== "all" && WORKS.some((w) => w.medium === k));

  /* ---------- header, ticker, footer ---------- */
  const links = [["shop.html", "Shop", "shop"], ["commissions.html", "Commissions", "commissions"]];
  if (SITE.showWorkshops) links.push(["workshops.html", "Workshops", "workshops"]);
  links.push(["about.html", "About", "about"]);

  const tick = SITE.ticker.map((t) => `<span>${esc(t)}</span><span>★</span>`).join("");
  document.getElementById("site-header").innerHTML = `
    <header class="top"><div class="wrap">
      <a class="logo" href="index.html"><span class="star">✦</span>${esc(SITE.name)}</a>
      <nav class="nav" aria-label="Main">
        <a class="nav-tv" href="index.html" aria-label="Home (TV)" title="Home"${page === "tv" ? ' aria-current="page"' : ""}>
          <svg viewBox="0 0 32 28" width="26" height="23" aria-hidden="true">
            <path d="M11 2.5l5 4.5 5-4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="2" y="7" width="28" height="18" rx="6" fill="currentColor"/>
            <rect x="5.5" y="10" width="17" height="12" rx="3.5" class="nav-tv-screen"/>
            <circle cx="26" cy="13" r="1.6" class="nav-tv-screen"/><circle cx="26" cy="18.5" r="1.6" class="nav-tv-screen"/>
          </svg><span>TV</span></a>
        ${links.map(([href, label, key]) => {
          const cur = key === page ? ' aria-current="page"' : "";
          if (key !== "shop" || !shopCats.length) return `<a href="${href}"${cur}>${label}</a>`;
          return `<div class="has-menu"><a href="${href}"${cur} aria-haspopup="true">${label} <span class="caret" aria-hidden="true">▾</span></a>
            <div class="menu"><a href="shop.html#all">All</a>${shopCats.map(([k, l]) => `<a href="shop.html#ch-${k}">${esc(l)}</a>`).join("")}</div></div>`;
        }).join("")}
      </nav>
    </div></header>
    <div class="ticker" aria-hidden="true"><div class="ticker-track">${tick}${tick}${tick}${tick}</div></div>`;

  document.getElementById("site-footer").innerHTML = `
    <footer><div class="wrap">
      <span>© ${new Date().getFullYear()} ${esc(SITE.name)} · End of broadcast</span>
      <span><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>${SITE.instagram ? ` <a class="ig" href="${esc(SITE.instagram)}" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg></a>` : ""}</span>
    </div></footer>`;

  document.querySelectorAll("[data-site-name]").forEach((el) => (el.textContent = SITE.name));
  document.querySelectorAll("[data-site-tagline]").forEach((el) => (el.textContent = SITE.tagline));

  /* ---------- placeholder art (used when a work has no image) ---------- */
  function hash(str) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
  function placeholder(id) {
    const h = hash(id), cols = ["#2b45ff", "#e6ff3a", "#ff3d9a", "#f3f1e7", "#19c9b0"];
    const i = h % 5, a = cols[i], b = cols[(i + 1 + ((h >> 3) % 4)) % 5], c = cols[(i + 1 + ((h >> 7) % 4)) % 5];
    const x = 20 + (h % 60), y = 20 + ((h >> 5) % 60), ang = h % 360;
    return `radial-gradient(circle at ${x}% ${y}%, ${a} 0 18%, transparent 18.5%),
      radial-gradient(circle at ${100 - x}% ${100 - y}%, ${c} 0 26%, transparent 26.5%),
      repeating-linear-gradient(${ang}deg, ${b} 0 14px, #07070f 14px 28px)`;
  }
  function artHTML(w, src = cover(w), crop = false) {
    const tag = `<span class="tag ${w.status}">${TAGS[w.status]}</span>`;
    const f = crop && Array.isArray(w.focus) ? w.focus : null;
    const style = f ? ` style="object-position:${+f[0]}% ${+f[1]}%;transform:scale(${+f[2] || 1});transform-origin:${+f[0]}% ${+f[1]}%"` : "";
    return src
      ? `<div class="art${isCut(src) ? " is-cut" : ""}"><img src="${esc(src)}" alt="${esc(w.title)}" loading="lazy"${style}>${tag}</div>`
      : `<div class="art" style="background:${placeholder(w.id)}" role="img" aria-label="Placeholder for ${esc(w.title)}">${tag}</div>`;
  }
  function priceLine(w) {
    if (!forSale(w) || !w.buy.length) return "";
    const priced = w.buy.filter(hasPrice);
    if (!priced.length) return `<div class="cost">Available</div>`;
    const min = Math.min(...priced.map((b) => b.price));
    return `<div class="cost">${priced.length > 1 ? "from " : ""}${money(min)}</div>`;
  }
  function cardHTML(w) {
    return `<button class="card" data-id="${esc(w.id)}">${artHTML(w, cover(w), true)}
      <div class="card-body"><h3>${esc(w.title)}</h3>
      <div class="meta">${esc(w.details)}${w.size ? `<br><span class="size">${esc(w.size)}</span>` : ""}${yr(w)}</div>${priceLine(w)}</div></button>`;
  }

  /* ---------- detail dialog ---------- */
  const dlg = document.createElement("dialog");
  document.body.appendChild(dlg);
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest(".close")) dlg.close(); });
  function inquiry(subject) { return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`; }
  function openWork(id) {
    const w = WORKS.find((x) => x.id === id); if (!w) return;
    let actions = "";
    if (forSale(w)) {
      actions = `<div class="btn-row">` + w.buy.map((b) => {
        if (!hasPrice(b)) return `<a class="btn" href="${inquiry(`Question about ${w.title}`)}">Ask about this piece</a>`;
        const inner = `${esc(b.label)} <span class="price">${money(b.price)}</span>`;
        return b.link
          ? `<a class="btn" href="${esc(b.link)}" target="_blank" rel="noopener">${inner}</a>`
          : `<a class="btn" href="${inquiry(`${w.title} — ${b.label}`)}">${inner}</a>`;
      }).join("") + `</div><p class="note">${w.buy.every((b) => b.link && hasPrice(b)) ? "Secure checkout by Stripe." : "This opens an email to me. I usually reply within a day or two."}</p>`;
    } else if (w.status === "archive") {
      actions = `<p class="note na-note">Not available</p>`;
    } else if (w.status === "sold") {
      actions = `<div class="btn-row"><a class="btn pink" href="commissions.html">Commission something like it</a></div>`;
    }
    const imgs = w.images || (w.image ? [w.image] : []);
    const thumbs = imgs.length > 1
      ? `<div class="thumbs">${imgs.map((s, i) => `<button data-src="${esc(s)}" aria-label="Photo ${i + 1}" aria-pressed="${i === 0}"><img src="${esc(s)}" alt=""></button>`).join("")}</div>`
      : "";
    dlg.innerHTML = `<button class="close" aria-label="Close">✕</button>
      <div class="detail"><div class="viewer">${artHTML(w)}${thumbs}</div>
        <div class="detail-body"><h2>${esc(w.title)}</h2>
          <div class="meta">${esc(w.details)}${w.size ? `<br><span class="size">Size: ${esc(w.size)}</span>` : ""}${w.year ? `<br>${esc(w.year)}` : ""}</div>
          <p>${esc(w.blurb)}</p>${actions}</div></div>`;
    dlg.showModal();
  }
  dlg.addEventListener("click", (e) => {
    const t = e.target.closest(".thumbs button"); if (!t) return;
    dlg.querySelector(".viewer .art img").src = t.dataset.src;
    dlg.querySelector(".viewer .art").classList.toggle("is-cut", isCut(t.dataset.src));
    dlg.querySelectorAll(".thumbs button").forEach((b) => b.setAttribute("aria-pressed", b === t));
  });
  document.addEventListener("click", (e) => { const c = e.target.closest(".card[data-id]"); if (c) openWork(c.dataset.id); });

  /* ---------- home: 90s TV + TV guide ----------
     Each CHANNEL is a category (same numbers as the Portfolio page: CH 02 Collage, CH 03 Painting...).
     Each piece is a SHOW airing on its category's channel. Shows rotate on their own, like a broadcast. */
  if (page === "tv" && WORKS.length) {
    const $ = (id) => document.getElementById(id);
    const tv = $("tv"), screen = $("tv-screen"), art = $("tv-art"), fill = $("tv-fill");
    const osd = $("tv-osd"), lower = $("tv-lower"), live = $("tv-live"), canvas = $("tv-static");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const AIR_MS = 6000;                                   // how long each show airs before the next one
    const used = MEDIUMS.filter(([k]) => k === "all" || WORKS.some((w) => w.medium === k));
    const channels = used.slice(1).map(([k, label]) => ({
      k, label, num: String(used.findIndex(([m]) => m === k) + 1).padStart(2, "0"),
      shows: WORKS.filter((w) => w.medium === k),
    }));
    const tagFor = (w) => (forSale(w) ? "FOR SALE" : w.status === "sold" ? "SOLD" : "");
    const pos = channels.map(() => 0);                     // which show each channel is airing
    let c = 0, on = true, osdTimer, staticTimer, airTimer;

    const start = (location.hash.match(/^#tv-(\d+)/) || [])[1];
    if (start) { const i = channels.findIndex((ch) => ch.num === start.padStart(2, "0")); if (i >= 0) c = i; }

    const ctx = canvas.getContext("2d");
    canvas.width = 160; canvas.height = 120;
    function noise() {
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255 | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      ctx.putImageData(img, 0, 0);
    }
    function burst(ms) {
      if (reduce) return;
      screen.classList.add("is-static");
      const end = performance.now() + ms;
      cancelAnimationFrame(staticTimer);
      const step = (t) => { noise(); if (t < end) staticTimer = requestAnimationFrame(step); else screen.classList.remove("is-static"); };
      staticTimer = requestAnimationFrame(step);
    }

    // draw whatever channel c is airing; kind = "channel" (big static + OSD), "show" (quick flicker) or "none"
    function render(kind = "none") {
      const ch = channels[c], w = ch.shows[pos[c]], src = cover(w);
      if (kind === "channel") burst(260); else if (kind === "show") burst(90);
      setTimeout(() => {
        art.src = src; fill.src = src; art.alt = w.title;
        screen.classList.toggle("cut", isCut(src));
        if (kind !== "show") {
          osd.innerHTML = `CH ${ch.num}<small>${esc(ch.label)}</small>`;
          osd.classList.add("show"); clearTimeout(osdTimer);
          osdTimer = setTimeout(() => osd.classList.remove("show"), 2600);
        }
        const tag = tagFor(w);
        lower.innerHTML = `<span class="net">${esc(ch.label)}</span><b>${esc(w.title)}</b>${tag ? `<span class="tag-mini ${w.status}">${tag}</span>` : ""}` +
          (ch.shows.length > 1 ? `<span class="ep">${pos[c] + 1}/${ch.shows.length}</span>` : "");
        $("tv-open").setAttribute("aria-label", `View details for ${w.title}`);
        live.textContent = `Channel ${+ch.num}, ${ch.label}: ${w.title}`;
      }, kind === "none" || reduce ? 0 : kind === "channel" ? 160 : 60);
      updateGuide();
      history.replaceState(null, "", `#tv-${ch.num}`);
      const nxt = ch.shows[(pos[c] + 1) % ch.shows.length];
      if (cover(nxt)) new Image().src = cover(nxt);
      schedule();
    }
    // auto-advance shows on the current channel (not with reduced motion, while hidden, or while off)
    function schedule() {
      clearTimeout(airTimer);
      if (reduce || !on) return;
      // play through the whole guide: next show on this channel, then on to the next channel when it runs out
      airTimer = setTimeout(() => {
        if (document.hidden || dlg.open) return schedule();
        if (pos[c] + 1 < channels[c].shows.length) { pos[c]++; render("show"); }
        else { pos[c] = 0; c = (c + 1) % channels.length; pos[c] = 0; render("channel"); }
      }, AIR_MS);
    }
    function power(state = !on) {
      on = state;
      tv.classList.toggle("off", !on);
      $("tv-power").setAttribute("aria-pressed", on);
      if (on) render("channel"); else clearTimeout(airTimer);
    }
    const flip = (d) => { if (!on) return power(true); c = (c + d + channels.length) % channels.length; render("channel"); };
    const skip = (d) => { if (!on) return power(true); const n = channels[c].shows.length; pos[c] = (pos[c] + d + n) % n; render("show"); };
    function tune(ci, si) { if (!on) { on = true; tv.classList.remove("off"); $("tv-power").setAttribute("aria-pressed", true); } const changed = ci !== c; c = ci; pos[c] = si; render(changed ? "channel" : "show"); }

    $("tv-up").addEventListener("click", () => flip(1));
    $("tv-down").addEventListener("click", () => flip(-1));
    $("tv-next").addEventListener("click", () => skip(1));
    $("tv-prev").addEventListener("click", () => skip(-1));
    $("tv-power").addEventListener("click", () => power());
    $("tv-open").addEventListener("click", () => (on ? openWork(channels[c].shows[pos[c]].id) : power(true)));
    addEventListener("keydown", (e) => {
      if (e.target.closest?.("input, textarea, select, dialog") || e.altKey || e.metaKey || e.ctrlKey) return;
      const map = { ArrowUp: () => flip(1), ArrowDown: () => flip(-1), ArrowRight: () => skip(1), ArrowLeft: () => skip(-1) };
      if (map[e.key]) { e.preventDefault(); map[e.key](); }
    });
    let x0 = null, y0 = null;
    screen.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    screen.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) skip(dx < 0 ? 1 : -1);
    });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) schedule(); });

    // ---- TV guide: one row per channel, each piece is a show in a time slot ----
    const grid = $("guide-grid"), now = $("guide-now");
    let userAt = 0;                                        // last time someone scrolled or touched the guide
    const slot = (d) => { const t = new Date(); t.setMinutes(t.getMinutes() < 30 ? 0 : 30, 0, 0); t.setMinutes(t.getMinutes() + d * 30); return t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); };
    // one shared grid: every row has the same number of time slots, so the whole guide scrolls sideways together
    const slots = Math.max(3, ...channels.map((ch) => ch.shows.length));
    grid.style.setProperty("--slots", slots);
    grid.innerHTML = `
      <div class="g-row g-head"><div class="g-net g-clock" id="g-clock"></div>${Array.from({ length: slots }, (_, d) => `<div class="g-time">${slot(d)}</div>`).join("")}</div>
      ${channels.map((ch, ci) => `<div class="g-row"><div class="g-net"><b>${ch.num}</b><span>${esc(ch.label)}</span></div>${
        ch.shows.map((w, si) => `<button class="g-show" data-c="${ci}" data-s="${si}"><small>${slot(si)}${tagFor(w) ? ` · ${tagFor(w)}` : ""}</small>${esc(w.title)}</button>`).join("")}${
        `<div class="g-off" aria-hidden="true">Off air</div>`.repeat(slots - ch.shows.length)}</div>`).join("")}`;
    grid.addEventListener("click", (e) => {
      const b = e.target.closest(".g-show"); if (!b) return;
      tune(+b.dataset.c, +b.dataset.s);
      if (tv.getBoundingClientRect().top < 0) tv.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    });
    function updateGuide() {
      const ch = channels[c], w = ch.shows[pos[c]];
      grid.querySelectorAll(".g-show").forEach((b) => b.setAttribute("aria-current", +b.dataset.c === c && +b.dataset.s === pos[c]));
      grid.querySelectorAll(".g-row:not(.g-head)").forEach((r, i) => r.classList.toggle("tuned", i === c));
      // keep the show that's on visible: slide the guide sideways if it's off to one side
      const cur = grid.querySelector(".g-show[aria-current=true]");
      if (cur && Date.now() - userAt > 15000) {
        const netW = grid.querySelector(".g-net").offsetWidth, left = cur.offsetLeft - netW;
        if (left < grid.scrollLeft || cur.offsetLeft + cur.offsetWidth > grid.scrollLeft + grid.clientWidth)
          grid.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
      }
      now.innerHTML = `<div class="g-now-text"><small>Now showing on</small><span class="net">Channel ${+ch.num} · ${esc(ch.label)}</span>
        <b>"${esc(w.title)}"</b><span>${esc(w.details)}</span>${tagFor(w) ? `<span class="ch">${tagFor(w)}</span>` : ""}</div>
        <img src="${esc(cover(w))}" alt=""${isCut(cover(w)) ? ' class="is-cut"' : ""}>`;
    }
    // size the slots so 3 fit on desktop (about 1.6 on phones); show a "more ▶" fade until scrolled to the end
    const sizeGuide = () => {
      const netW = grid.querySelector(".g-net").offsetWidth, visible = innerWidth <= 760 ? 1.6 : 3;
      grid.style.setProperty("--cell", `${Math.max(150, (grid.clientWidth - netW) / visible)}px`);
      markMore();
    };
    const markMore = () => grid.parentElement.classList.toggle("more", grid.scrollLeft + grid.clientWidth < grid.scrollWidth - 4);
    grid.addEventListener("scroll", markMore, { passive: true });
    ["wheel", "touchstart", "pointerdown", "keydown"].forEach((ev) => grid.addEventListener(ev, () => (userAt = Date.now()), { passive: true }));
    addEventListener("resize", sizeGuide); sizeGuide();
    const clock = () => { const el = $("g-clock"); if (el) el.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }); };
    clock(); setInterval(clock, 1000);

    render("none");
  }

  /* ---------- shop: every piece, filter by category and availability ----------
     Address bar examples: shop.html#ch-ceramics   shop.html#ch-collage+available   shop.html#all+unavailable */
  if (page === "shop") {
    const cats = document.getElementById("shop-cats"), avail = document.getElementById("shop-avail");
    const grid = document.getElementById("shop-grid"), count = document.getElementById("shop-count");
    const AV = [["all", "All"], ["available", "Available"], ["unavailable", "Not available"]];
    const parse = () => {
      const h = location.hash;
      const want = (h.match(/ch-(\w+)/) || [])[1];
      return {
        medium: shopCats.some(([k]) => k === want) ? want : null,
        av: /unavailable/.test(h) ? "unavailable" : /available/.test(h) ? "available" : "all",
      };
    };
    const hashFor = (medium, av) => `#${medium ? "ch-" + medium : "all"}${av !== "all" ? "+" + av : ""}`;
    const render = () => {
      const { medium, av } = parse();
      cats.innerHTML = [["all", "All"], ...shopCats].map(([k, l]) => {
        const m = k === "all" ? null : k, on = m === medium;
        return `<a class="chip" href="shop.html${hashFor(m, av)}"${on ? ' aria-current="true"' : ""}>${esc(l)}</a>`;
      }).join("");
      avail.innerHTML = AV.map(([k, l]) => `<a class="chip av-${k}" href="shop.html${hashFor(medium, k)}"${k === av ? ' aria-current="true"' : ""}>${esc(l)}</a>`).join("");
      const list = WORKS.filter((w) => (!medium || w.medium === medium) &&
        (av === "all" || (av === "available") === forSale(w)));
      const nAvail = list.filter(forSale).length;
      count.textContent = list.length
        ? `${list.length} piece${list.length === 1 ? "" : "s"}${av === "all" ? ` · ${nAvail} available` : ""}`
        : "";
      grid.innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="empty">Nothing here right now. Check back soon.</p>`;
    };
    render();
    addEventListener("hashchange", render);
  }

  /* ---------- commissions: form opens a pre-filled email ---------- */
  if (page === "commissions") {
    document.getElementById("comm-status").textContent = SITE.commissionsOpen ? "Commissions are open" : "Commissions are closed right now";
    document.getElementById("comm-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const body = `Name: ${f.get("name")}\nType: ${f.get("type")}\nBudget: ${f.get("budget")}\nNeeded by: ${f.get("deadline") || "No deadline"}\n\n${f.get("idea")}`;
      location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Commission request from " + f.get("name"))}&body=${encodeURIComponent(body)}`;
    });
  }

  /* ---------- about ---------- */
  if (page === "about" && typeof ABOUT !== "undefined") {
    const fill = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<mark class="todo">[$1]</mark>').replace(/\n/g, "<br>");
    document.getElementById("about-photo").innerHTML = `
      <figure class="tv-photo">
        <div class="screen">${ABOUT.photo ? `<img src="${esc(ABOUT.photo)}" alt="${esc(SITE.name)}">` : `<div class="no-signal"><span>No signal</span><small>Photo coming soon</small></div>`}</div>
        <figcaption>${esc(ABOUT.photoCaption)}</figcaption>
      </figure>`;
    document.getElementById("about-bio").innerHTML = ABOUT.bio
      .map((p, i) => `<p${i === 0 ? ' class="lead"' : ""}>${fill(p)}</p>`).join("");
    const hob = ABOUT.hobbies || [];
    document.getElementById("hobby-count").textContent = String(hob.length).padStart(2, "0");
    document.getElementById("about-hobbies").innerHTML = hob.map((h) => `<span class="hobby">${esc(h)}</span>`).join("");
    if (!hob.length) document.querySelector(".scoreboard").closest("section").hidden = true;
    const counts = {};
    WORKS.forEach((w) => (counts[w.medium] = (counts[w.medium] || 0) + 1));
    document.getElementById("about-channels").innerHTML = MEDIUMS.filter(([k]) => counts[k])
      .map(([k, label], i) => `<a class="chip" href="shop.html#ch-${k}"><b>CH ${String(i + 2).padStart(2, "0")}</b>${label} <span>${counts[k]}</span></a>`).join("");
    const pickupTitle = ABOUT.pickupArea ? `Local pickup · ${esc(ABOUT.pickupArea)}` : "Local pickup";
    document.getElementById("about-policies").innerHTML = [
      ["US shipping", ABOUT.shipping], [pickupTitle, ABOUT.pickup], ["All sales final", ABOUT.returns], ["Arrived damaged?", ABOUT.damage],
    ].filter(([, t]) => t).map(([h, t]) => `<li><div><h3>${h}</h3><p>${fill(t)}</p></div></li>`).join("");
    document.getElementById("about-faq").innerHTML = ABOUT.faq
      .map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${fill(a)}</p></details>`).join("");
  }

  /* ---------- workshops ---------- */
  if (page === "workshops") {
    document.getElementById("workshops").innerHTML = WORKSHOPS.map((w) => `
      <div class="panel"><h3 style="font-size:26px">${esc(w.title)}</h3>
        <p class="meta" style="font-family:var(--tv);font-size:22px;color:var(--yellow);margin:8px 0">${esc(w.date)} · ${esc(w.place)} · ${esc(w.length)} · ${esc(w.spots)}</p>
        <p>${esc(w.blurb)}</p>
        <a class="btn" ${w.link ? `href="${esc(w.link)}" target="_blank" rel="noopener"` : `href="${inquiry("Workshop: " + w.title)}"`}>Book a spot <span class="price">${money(w.price)}</span></a>
      </div>`).join("") || `
      <div class="coming-soon">
        <div class="osd"><span class="rec">PLEASE STAND BY</span></div>
        <h2>Coming Soon</h2>
        ${SITE.instagram ? `<p>Follow along on <a href="${esc(SITE.instagram)}" target="_blank" rel="noopener">Instagram</a> to hear first when workshops open.</p>` : ""}
      </div>`;
  }
})();
