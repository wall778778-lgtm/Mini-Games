document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("gameSearch");
  const cards = [...document.querySelectorAll(".game-card")];
  const filters = [...document.querySelectorAll(".category-filters [data-category]")];
  const results = document.getElementById("gameResults");
  if (!search || !cards.length) return;
  cards.forEach(card => {
    const info = card.querySelector(".game-info");
    if (!info || info.querySelector(".game-kind")) return;
    const category = (card.dataset.categories || "game").split(/\s+/)[0];
    const label = document.createElement("span");
    label.className = "game-kind";
    label.textContent = category;
    info.prepend(label);
  });
  let active = "all";
  const update = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    cards.forEach(card => {
      const categories = (card.dataset.categories || "").split(/\s+/);
      const show = (!query || card.textContent.toLocaleLowerCase().includes(query)) &&
        (active === "all" || categories.includes(active));
      card.hidden = !show;
      if (show) count++;
    });
    if (results) results.textContent = count ? `${count} ${count === 1 ? "game" : "games"} shown` : "No games match. Try another search or category.";
  };
  search.addEventListener("input", update);
  filters.forEach(button => button.addEventListener("click", () => {
    active = button.dataset.category;
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    update();
  }));
  update();
});
