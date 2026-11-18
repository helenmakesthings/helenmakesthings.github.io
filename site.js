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
  const hasPrice = (b) => typeof b.price === "number";
  const yr = (w) => (w.year ? ` · ${esc(w.year)}` : "");
  const TAGS = { original: "Original", print: "Print", sold: "Sold", archive: "Portfolio" };
  const forSale = (w) => w.status === "original" || w.status === "print";

  /* ---------- header, ticker, footer ---------- */
  const links = [["index.html", "Work", "home"], ["shop.html", "Shop", "shop"], ["commissions.html", "Commissions", "commissions"]];
  if (SITE.showWorkshops) links.push(["workshops.html", "Workshops", "workshops"]);
  links.push(["about.html", "About", "about"]);

  const tick = SITE.ticker.map((t) => `<span>${esc(t)}</span><span>★</span>`).join("");
  document.getElementById("site-header").innerHTML = `
    <header class="top"><div class="wrap">
      <a class="logo" href="index.html"><span class="star">✦</span>${esc(SITE.name)}</a>
      <nav class="nav" aria-label="Main">
        ${links.map(([href, label, key]) => `<a href="${href}"${key === page ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
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
      ? `<div class="art"><img src="${esc(src)}" alt="${esc(w.title)}" loading="lazy"${style}>${tag}</div>`
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
      <div class="meta">${esc(w.details)}${yr(w)}</div>${priceLine(w)}</div></button>`;
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
          <div class="meta">${esc(w.details)}${w.year ? `<br>${esc(w.year)}` : ""}</div>
          <p>${esc(w.blurb)}</p>${actions}</div></div>`;
    dlg.showModal();
  }
  dlg.addEventListener("click", (e) => {
    const t = e.target.closest(".thumbs button"); if (!t) return;
    dlg.querySelector(".viewer .art img").src = t.dataset.src;
    dlg.querySelectorAll(".thumbs button").forEach((b) => b.setAttribute("aria-pressed", b === t));
  });
  document.addEventListener("click", (e) => { const c = e.target.closest(".card[data-id]"); if (c) openWork(c.dataset.id); });

  /* ---------- home: mixed feed with channel filters ---------- */
  if (page === "home") {
    const grid = document.getElementById("grid"), ch = document.getElementById("channels");
    const fromHash = (location.hash.match(/^#ch-(\w+)/) || [])[1];
    let medium = WORKS.some((w) => w.medium === fromHash) ? fromHash : "all", saleOnly = false;
    if (fromHash) setTimeout(() => document.getElementById("work").scrollIntoView(), 50);
    const used = MEDIUMS.filter(([k]) => k === "all" || WORKS.some((w) => w.medium === k));
    ch.innerHTML = used.map(([k, label], i) =>
      `<button data-m="${k}" aria-pressed="${k === medium}"><b>CH ${String(i + 1).padStart(2, "0")}</b>${label}</button>`).join("") +
      `<button class="sale-toggle" aria-pressed="false">For sale only</button>`;
    const draw = () => {
      const list = WORKS.filter((w) => (medium === "all" || w.medium === medium) && (!saleOnly || forSale(w)));
      grid.innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="empty">No signal on this channel yet.</p>`;
    };
    ch.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.classList.contains("sale-toggle")) { saleOnly = !saleOnly; b.setAttribute("aria-pressed", saleOnly); }
      else { medium = b.dataset.m; ch.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", x === b)); }
      draw();
    });
    draw();
  }

  /* ---------- shop: originals and prints ---------- */
  if (page === "shop") {
    const fill = (id, status) => {
      const list = WORKS.filter((w) => w.status === status);
      if (!list.length && status === "print") { document.getElementById(id).closest("section").hidden = true; return; }
      document.getElementById(id).innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="empty">Nothing here right now. Check back soon.</p>`;
    };
    fill("originals", "original"); fill("prints", "print");
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
    const fill = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<mark class="todo">[$1]</mark>');
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
      .map(([k, label], i) => `<a class="chip" href="index.html#ch-${k}"><b>CH ${String(i + 2).padStart(2, "0")}</b>${label} <span>${counts[k]}</span></a>`).join("");
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
      </div>`).join("") || `<p class="empty">No workshops scheduled yet.</p>`;
  }
})();
