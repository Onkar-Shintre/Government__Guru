const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    if (!mobileMenu) return;
    const isOpen = mobileMenu.style.display === "block";
    mobileMenu.style.display = isOpen ? "none" : "block";
    hamburger.classList.toggle("open");
  });
}

/* Close mobile menu when clicking a link inside it */
document.addEventListener('click', function(e){
  const mobileMenu = document.getElementById('mobileMenu');
  if (!mobileMenu) return;
  if (mobileMenu.contains(e.target) && e.target.tagName === 'A') {
    mobileMenu.style.display = 'none';
    document.getElementById('hamburger').classList.remove('open');
  }
});

/* Add header shadow on scroll */
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (!header) return;
  if (window.scrollY > 10) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
});

/* Reveal on scroll using IntersectionObserver */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});

/* Updates: localStorage demo */
function readUpdates() {
  try {
    return JSON.parse(localStorage.getItem("gg_updates") || "[]");
  } catch (e) {
    return [];
  }
}
function writeUpdates(arr) {
  localStorage.setItem("gg_updates", JSON.stringify(arr));
}
function escapeHtml(unsafe) {
  return unsafe.replace(/[&<"'>]/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[m];
  });
}

function renderUpdates() {
  const list = readUpdates();
  const container = document.getElementById("updateList");
  container.innerHTML = "";
  if (!list.length) {
    const el = document.createElement("div");
    el.className = "card";
    el.style.display = "block";
    el.innerHTML =
      "<strong>No updates yet.</strong> Check back later or log in to add updates (demo).";
    container.appendChild(el);
    return;
  }
  list
    .slice()
    .reverse()
    .forEach((item) => {
      const el = document.createElement("div");
      el.className = "update";
      const left = document.createElement("div");
      left.style.flex = "1";
      left.innerHTML = `
        <div style="font-weight:700;display:flex;align-items:center;gap:8px">
          <span style="color:var(--accent-2);font-size:18px">•</span>
          <div>${escapeHtml(item.text)}</div>
        </div>
        <div class="meta">${new Date(item.date).toLocaleString()} • ${escapeHtml(item.source || "GovtGuru")}</div>
      `;
      el.appendChild(left);
      if (item.link) {
        const a = document.createElement("a");
        a.href = item.link;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "View";
        a.className = "btn";
        a.style.background = "transparent";
        a.style.color = "var(--accent-2)";
        a.style.fontWeight = "700";
        el.appendChild(a);
      }
      container.appendChild(el);
    });
}

function addUpdate() {
  const txt = document.getElementById("updateText").value.trim();
  const link = document.getElementById("updateLink").value.trim();
  if (!txt) {
    alert("Enter an update text");
    return;
  }
  const updates = readUpdates();
  updates.push({
    text: txt,
    link: link || "",
    date: new Date().toISOString(),
    source: "GovtGuru",
  });
  writeUpdates(updates);
  document.getElementById("updateText").value = "";
  document.getElementById("updateLink").value = "";
  renderUpdates();
}

function checkLoginForUpdates() {
  const cur = JSON.parse(localStorage.getItem("gg_current") || "null");
  if (cur) {
    document.getElementById("addUpdateArea").style.display = "block";
  } else {
    document.getElementById("addUpdateArea").style.display = "none";
  }
}

function subscribe() {
  const email = document.getElementById("subscribeEmail").value.trim();
  if (!email) {
    alert("Enter your email to subscribe");
    return;
  }
  const subs = JSON.parse(localStorage.getItem("gg_subs") || "[]");
  if (subs.includes(email)) {
    alert("You are already subscribed");
    return;
  }
  subs.push(email);
  localStorage.setItem("gg_subs", JSON.stringify(subs));
  alert("Thanks! You are subscribed (demo).");
  document.getElementById("subscribeEmail").value = "";
}

function performSearch() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!q) {
    window.location.href = "Select.html";
    return;
  }
  const updates = readUpdates().filter((u) => u.text.toLowerCase().includes(q));
  if (updates.length) {
    alert(
      "Found " +
        updates.length +
        " update(s) matching: " +
        q +
        "\\nJumping to updates."
    );
    location.hash = "#updates";
    return;
  }
  window.location.href = "Select.html";
}

/* Seed demo updates */
(function seed() {
  if (!localStorage.getItem("gg_updates")) {
    const sample = [
      {
        text: "UPSC Prelims 2025: Registration starts on 2025-10-01. Check eligibility & apply.",
        link: "https://upsc.gov.in",
        date: new Date().toISOString(),
        source: "UPSC",
      },
      {
        text: "MPSC notification: State PSC released calendar for 2025 prelims — download PDF.",
        link: "",
        date: new Date().toISOString(),
        source: "MPSC",
      },
    ];
    localStorage.setItem("gg_updates", JSON.stringify(sample));
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  renderUpdates();
  checkLoginForUpdates();
  // animate hero image in
  const img = document.querySelector(".hero img");
  if (img) {
    img.style.opacity = 1;
    img.style.transform = "translateY(0)";
  }
});

// small helper (debug)
window._govtguru = { readUpdates, writeUpdates, addUpdate, renderUpdates };
