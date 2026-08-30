function flashPrice(element, direction) {

  if (!element) return;

  element.classList.remove(
    "price-flash-up",
    "price-flash-down"
  );

  void element.offsetWidth;

  element.classList.add(
    direction === "up"
      ? "price-flash-up"
      : "price-flash-down"
  );
}

function animateNumber(
  element,
  from,
  to,
  duration = 400,
  formatter = value => value.toFixed(2)
) {

  if (!element) return;

  const start = performance.now();

  function frame(now) {

    const progress = Math.min(
      (now - start) / duration,
      1
    );

    const eased =
      1 - Math.pow(1 - progress, 3);

    const value =
      from + (to - from) * eased;

    element.textContent = formatter(value);

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function showToast(message, type = "normal") {

  const container =
    document.getElementById("toastContainer");

  if (!container) return;

  const toast = document.createElement("div");

  toast.className = "toast";

  if (type === "buy") {
    toast.innerHTML = `🟢 ${message}`;
  } else if (type === "sell") {
    toast.innerHTML = `🔴 ${message}`;
  } else {
    toast.textContent = message;
  }

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";

    setTimeout(() => toast.remove(), 250);
  }, 3000);
}
