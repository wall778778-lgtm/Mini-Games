(() => {
  const gameKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
  const editableSelector = "input, textarea, select, [contenteditable=\"true\"], [role=\"textbox\"]";

  document.addEventListener("keydown", event => {
    if (!gameKeys.has(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;

    const target = event.target instanceof Element ? event.target : null;
    if (target && target.closest(editableSelector)) return;

    // Keep the browser from scrolling the game page, but let game key handlers run.
    event.preventDefault();
  }, { capture: true });
})();
