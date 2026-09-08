// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Back to top button
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

// Close mobile nav after clicking a link
document.querySelectorAll("#mainNav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("mainNav");
    if (nav.classList.contains("show")) {
      const collapse = bootstrap.Collapse.getOrCreateInstance(nav);
      collapse.hide();
    }
  });
});
