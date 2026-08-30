function flashElement(element, direction) {

  if (!element) return;

  element.classList.remove(
    "flash-up",
    "flash-down"
  );

  void element.offsetWidth;

  element.classList.add(
    direction === "up"
      ? "flash-up"
      : "flash-down"
  );
}

function showToast(message, type = "normal") {

  const container =
    document.getElementById("toastContainer");

  if (!container) return;

  const toast =
    document.createElement("div");

  toast.className =
    "toast " + type;

  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-hide");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2800);
}
