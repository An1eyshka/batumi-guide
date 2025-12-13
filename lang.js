document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // THEME TOGGLE
  // =========================
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  // Проверяем системные настройки темы
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem("theme") || (prefersDark ? 'dark' : 'light');
  htmlElement.setAttribute("data-theme", savedTheme);

  // Обновляем состояние кнопки темы
  updateThemeButtonState(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeButtonState(newTheme);
    });
  }

  // Слушаем изменения системной темы
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!localStorage.getItem("theme")) {
      const newTheme = event.matches ? 'dark' : 'light';
      htmlElement.setAttribute("data-theme", newTheme);
      updateThemeButtonState(newTheme);
    }
  });

  function updateThemeButtonState(theme) {
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  // =========================
  // SWIPER SLIDERS
  // =========================
  if (typeof Swiper !== "undefined") {
    const baseOptions = {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 16,
      grabCursor: true,
      pagination: {
        clickable: true
      }
    };

    // Инициализация каждого слайдера отдельно
    const eatSwiper = new Swiper(".eat-slider", {
      ...baseOptions,
      pagination: {
        el: ".eat-pagination",
        clickable: true
      }
    });

    const citySwiper = new Swiper(".city-slider", {
      ...baseOptions,
      pagination: {
        el: ".city-pagination",
        clickable: true
      }
    });

    const natureSwiper = new Swiper(".nature-slider", {
      ...baseOptions,
      pagination: {
        el: ".nature-pagination",
        clickable: true
      }
    });

    const streetSwiper = new Swiper(".street-slider", {
      ...baseOptions,
      pagination: {
        el: ".street-pagination",
        clickable: true
      }
    });

    // Выравнивание высоты карточек
    function equalizeCardHeights() {
      setTimeout(() => {
        document.querySelectorAll(".swiper").forEach((slider) => {
          const cards = slider.querySelectorAll(".place-card");
          if (!cards.length) return;

          cards.forEach(c => c.style.minHeight = "");

          let maxHeight = 0;
          cards.forEach(c => {
            const height = c.offsetHeight;
            maxHeight = Math.max(maxHeight, height);
          });

          if (maxHeight > 0) {
            cards.forEach(c => {
              c.style.minHeight = `${maxHeight}px`;
            });
          }
        });
      }, 100);
    }

    equalizeCardHeights();
    
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(equalizeCardHeights, 150);
    });
  }

  // =========================
  // Кнопки "Show more"
  // =========================
  const showMoreButtons = document.querySelectorAll(".show-more-btn");
  showMoreButtons.forEach(button => {
    button.addEventListener("click", function() {
      this.style.opacity = '0.7';
      setTimeout(() => {
        this.style.opacity = '1';
      }, 200);
      
      console.log(`"Show more" clicked`);
    });
  });
});