
(function () {
  let dragging = false;
  let startY = 0;
  let lastY = 0;
  let velocity = 0;
  let targetY = window.scrollY;
  let currentY = window.scrollY;
  let rafId = null;

  const friction = 0.92; // هرچی کمتر، ترمز بیشتر
  const follow = 0.12;   // نرمی دنبال‌کردن

  function clampScroll(y) {
    const max = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    return Math.max(0, Math.min(max, y));
  }

  function onDown(e) {
    dragging = true;
    startY = e.clientY;
    lastY = e.clientY;
    velocity = 0;
    document.body.style.cursor = "grabbing";
  }

  function onMove(e) {
    if (!dragging) return;

    e.preventDefault();

    const dy = e.clientY - lastY;
    lastY = e.clientY;

    // سرعت حرکت ماوس
    velocity = dy;

    // درگ معکوس مثل تاچ موبایل
    targetY = clampScroll(targetY - dy);
  }

  function onUp() {
    dragging = false;
    document.body.style.cursor = "grab";
  }

  function animate() {
    if (!dragging) {
      // اینرسی و ترمز نرم
      if (Math.abs(velocity) > 0.1) {
        targetY = clampScroll(targetY - velocity);
        velocity *= friction;
      } else {
        velocity = 0;
      }
    }

    // حرکت نرم به سمت target
    currentY += (targetY - currentY) * follow;
    window.scrollTo(0, currentY);

    rafId = requestAnimationFrame(animate);
  }

  function init() {
    // فقط drag را اضافه می‌کنیم، اسکرول نرم اصلی را دست نمی‌زنیم
    document.addEventListener("mousedown", onDown, { passive: false });
    document.addEventListener("mousemove", onMove, { passive: false });
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onUp);

    // برای جلوگیری از تداخل انتخاب متن
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grab";

    if (!rafId) animate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

})();