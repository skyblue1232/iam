"use strict";

/* =========================================================
   나폴나폴 포트폴리오 공통 스크립트
   ========================================================= */

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".primary-navigation");
const navLinks = [
  ...document.querySelectorAll(".primary-navigation a"),
];

const backToTopButton =
  document.querySelector(".back-to-top");

const copyEmailButton =
  document.querySelector(".copy-email");

const toast = document.querySelector(".toast");

const currentYear =
  document.querySelector("#current-year");

const scrollProgress =
  document.querySelector("[data-scroll-progress]");

const scrollProgressBar =
  document.querySelector(".scroll-progress-bar");

const themeToggle =
  document.querySelector("[data-theme-toggle]");

const languageToggle =
  document.querySelector("[data-language-toggle]");

let toastTimer;


/* =========================================================
   localStorage 키
   ========================================================= */

const STORAGE_KEYS = {
  theme: "napolnapol-theme",
  language: "napolnapol-language",
  guestbook: "napolnapol-guestbook",
  easterEgg: "napolnapol-easter-egg",
};


/* =========================================================
   localStorage 안전 처리
   ========================================================= */

function getStoredValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

function removeStoredValue(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}


/* =========================================================
   토스트 메시지
   ========================================================= */

function showToast(message) {
  if (!toast) return;

  window.clearTimeout(toastTimer);

  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}


/* =========================================================
   현재 연도
   ========================================================= */

if (currentYear) {
  currentYear.textContent =
    String(new Date().getFullYear());
}


/* =========================================================
   MPA 현재 페이지 메뉴 표시
   ========================================================= */

function getCurrentFileName() {
  const path = window.location.pathname;
  const fileName = path.split("/").pop();

  return fileName || "index.html";
}

function updateCurrentPageNavigation() {
  const currentFileName = getCurrentFileName();

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const targetPath = href.split("#")[0];
    const targetFileName =
      targetPath.split("/").pop();

    const isHtmlPage =
      targetFileName &&
      targetFileName.endsWith(".html");

    if (!isHtmlPage) return;

    const isCurrentPage =
      targetFileName === currentFileName;

    const isContactLink =
      href.includes("#contact");

    if (isCurrentPage && !isContactLink) {
      link.classList.add("is-current");
      link.setAttribute(
        "aria-current",
        "page"
      );
    } else {
      link.classList.remove("is-current");
      link.removeAttribute("aria-current");
    }
  });
}

updateCurrentPageNavigation();


/* =========================================================
   모바일 메뉴
   ========================================================= */

function closeMenu() {
  if (!menuButton || !navigation) return;

  menuButton.classList.remove("active");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");

  menuButton.setAttribute(
    "aria-expanded",
    "false"
  );

  menuButton.setAttribute(
    "aria-label",
    "메뉴 열기"
  );
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen =
      navigation.classList.toggle("open");

    menuButton.classList.toggle(
      "active",
      isOpen
    );

    document.body.classList.toggle(
      "menu-open",
      isOpen
    );

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuButton.setAttribute(
      "aria-label",
      isOpen
        ? "메뉴 닫기"
        : "메뉴 열기"
    );
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});


/* =========================================================
   헤더, 맨 위로 버튼, 스크롤 진행률
   ========================================================= */

function updateScrollProgress() {
  if (
    !scrollProgress ||
    !scrollProgressBar
  ) {
    return;
  }

  const scrollableHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const progress =
    scrollableHeight > 0
      ? window.scrollY /
        scrollableHeight *
        100
      : 0;

  const safeProgress = Math.min(
    100,
    Math.max(0, progress)
  );

  scrollProgressBar.style.width =
    `${safeProgress}%`;

  scrollProgress.setAttribute(
    "aria-valuenow",
    String(Math.round(safeProgress))
  );
}

function updateScrollUI() {
  const isScrolled =
    window.scrollY > 18;

  if (header) {
    header.classList.toggle(
      "scrolled",
      isScrolled
    );
  }

  if (backToTopButton) {
    backToTopButton.classList.toggle(
      "visible",
      window.scrollY > 700
    );
  }

  updateScrollProgress();
}

window.addEventListener(
  "scroll",
  updateScrollUI,
  {
    passive: true,
  }
);

window.addEventListener(
  "resize",
  updateScrollProgress
);

window.addEventListener(
  "load",
  updateScrollProgress
);

updateScrollUI();


/* =========================================================
   맨 위로 이동
   ========================================================= */

if (backToTopButton) {
  backToTopButton.addEventListener(
    "click",
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  );
}


/* =========================================================
   스크롤 등장 애니메이션
   ========================================================= */

function initializeRevealAnimation() {
  const revealElements =
    document.querySelectorAll(".reveal");

  if (revealElements.length === 0) {
    return;
  }

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  const observer =
    new IntersectionObserver(
      (entries, revealObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "visible"
          );

          revealObserver.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px",
      }
    );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

initializeRevealAnimation();


/* =========================================================
   같은 페이지 해시 메뉴 강조
   ========================================================= */

function updateActiveSectionNavigation() {
  if (!header) return;

  const hashLinks = navLinks.filter(
    (link) => {
      const href =
        link.getAttribute("href");

      return (
        href &&
        href.startsWith("#") &&
        href !== "#"
      );
    }
  );

  if (hashLinks.length === 0) {
    return;
  }

  const currentPosition =
    window.scrollY +
    header.offsetHeight +
    120;

  let currentSectionId = "";

  hashLinks.forEach((link) => {
    const href =
      link.getAttribute("href");

    const section =
      document.querySelector(href);

    if (!section) return;

    if (
      currentPosition >=
      section.offsetTop
    ) {
      currentSectionId =
        section.id;
    }
  });

  hashLinks.forEach((link) => {
    const isActive =
      link.getAttribute("href") ===
      `#${currentSectionId}`;

    link.classList.toggle(
      "active",
      isActive
    );
  });
}

window.addEventListener(
  "scroll",
  updateActiveSectionNavigation,
  {
    passive: true,
  }
);

window.addEventListener(
  "resize",
  updateActiveSectionNavigation
);

window.addEventListener(
  "load",
  updateActiveSectionNavigation
);

updateActiveSectionNavigation();


/* =========================================================
   다크모드 / 라이트모드
   ========================================================= */

function getPreferredTheme() {
  const savedTheme =
    getStoredValue(STORAGE_KEYS.theme);

  if (
    savedTheme === "dark" ||
    savedTheme === "light"
  ) {
    return savedTheme;
  }

  const prefersDark =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

  return prefersDark
    ? "dark"
    : "light";
}

function updateThemeButton(theme) {
  if (!themeToggle) return;

  const isDark =
    theme === "dark";

  themeToggle.setAttribute(
    "aria-pressed",
    String(isDark)
  );

  themeToggle.setAttribute(
    "aria-label",
    isDark
      ? "라이트 모드로 변경"
      : "다크 모드로 변경"
  );
}

function applyTheme(
  theme,
  save = true
) {
  const nextTheme =
    theme === "dark"
      ? "dark"
      : "light";

  document.documentElement.dataset.theme =
    nextTheme;

  updateThemeButton(nextTheme);

  if (save) {
    setStoredValue(
      STORAGE_KEYS.theme,
      nextTheme
    );
  }

  document.dispatchEvent(
    new CustomEvent(
      "napolnapol:themechange",
      {
        detail: {
          theme: nextTheme,
        },
      }
    )
  );
}

applyTheme(
  getPreferredTheme(),
  false
);

if (themeToggle) {
  themeToggle.addEventListener(
    "click",
    () => {
      const currentTheme =
        document.documentElement
          .dataset.theme;

      const nextTheme =
        currentTheme === "dark"
          ? "light"
          : "dark";

      applyTheme(nextTheme);

      showToast(
        nextTheme === "dark"
          ? "다크 모드로 변경했습니다."
          : "라이트 모드로 변경했습니다."
      );
    }
  );
}


/* =========================================================
   한국어 / 영어 토글
   ========================================================= */

const translations = {
  ko: {
    "nav.home": "홈",
    "nav.projects": "프로젝트",
    "nav.journey": "여정",
    "nav.contact": "연락",

    "hero.role":
      "SW 개발자 고민균",

    "hero.line1":
      "소통은 부드럽게,",

    "hero.line2":
      "해결은 끝까지.",

    "hero.description":
      "작은 문제도 그냥 넘기지 않고 여러 가능성을 검토하며, 개인의 경험을 팀의 가치로 확장합니다.",

    "hero.projects":
      "대표 프로젝트 보기",

    "hero.contact":
      "연락하기",

    "footer.description":
      "나비처럼 나의 매력을 나폴나폴 퍼트리는 포트폴리오",
  },

  en: {
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.journey": "Journey",
    "nav.contact": "Contact",

    "hero.role":
      "Software Developer Min-Gyun Ko",

    "hero.line1":
      "Communicate with care,",

    "hero.line2":
      "solve to the end.",

    "hero.description":
      "I explore multiple possibilities, pursue root causes, and turn individual experience into shared team value.",

    "hero.projects":
      "View Projects",

    "hero.contact":
      "Contact Me",

    "footer.description":
      "A portfolio that gently spreads my strengths like a butterfly.",
  },
};

function getPreferredLanguage() {
  const savedLanguage =
    getStoredValue(
      STORAGE_KEYS.language
    );

  return savedLanguage === "en"
    ? "en"
    : "ko";
}

function updateLanguageButton(language) {
  if (!languageToggle) return;

  const currentText =
    languageToggle.querySelector(
      ".language-current"
    );

  const nextText =
    languageToggle.querySelector(
      ".language-next"
    );

  const isEnglish =
    language === "en";

  if (currentText) {
    currentText.textContent =
      isEnglish ? "EN" : "KO";
  }

  if (nextText) {
    nextText.textContent =
      isEnglish ? "KO" : "EN";
  }

  languageToggle.setAttribute(
    "aria-pressed",
    String(isEnglish)
  );

  languageToggle.setAttribute(
    "aria-label",
    isEnglish
      ? "한국어로 보기"
      : "영어로 보기"
  );
}

function applyLanguage(
  language,
  save = true
) {
  const nextLanguage =
    language === "en"
      ? "en"
      : "ko";

  document.documentElement.lang =
    nextLanguage;

  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {
      const key =
        element.dataset.i18n;

      const text =
        translations[nextLanguage][key];

      if (text) {
        element.textContent = text;
      }
    });

  updateLanguageButton(nextLanguage);

  if (save) {
    setStoredValue(
      STORAGE_KEYS.language,
      nextLanguage
    );
  }
}

applyLanguage(
  getPreferredLanguage(),
  false
);

if (languageToggle) {
  languageToggle.addEventListener(
    "click",
    () => {
      const currentLanguage =
        document.documentElement.lang;

      const nextLanguage =
        currentLanguage === "en"
          ? "ko"
          : "en";

      applyLanguage(nextLanguage);

      showToast(
        nextLanguage === "en"
          ? "English mode is on."
          : "한국어로 변경했습니다."
      );
    }
  );
}


/* =========================================================
   이메일 복사
   ========================================================= */

async function copyToClipboard(text) {
  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {
    await navigator.clipboard.writeText(
      text
    );

    return;
  }

  const temporaryTextarea =
    document.createElement("textarea");

  temporaryTextarea.value = text;

  temporaryTextarea.setAttribute(
    "readonly",
    ""
  );

  temporaryTextarea.style.position =
    "fixed";

  temporaryTextarea.style.top =
    "-9999px";

  temporaryTextarea.style.left =
    "-9999px";

  document.body.appendChild(
    temporaryTextarea
  );

  temporaryTextarea.focus();
  temporaryTextarea.select();

  temporaryTextarea.setSelectionRange(
    0,
    text.length
  );

  const copied =
    document.execCommand("copy");

  temporaryTextarea.remove();

  if (!copied) {
    throw new Error("복사 실패");
  }
}

if (copyEmailButton) {
  copyEmailButton.addEventListener(
    "click",
    async () => {
      const email =
        copyEmailButton.dataset.email;

      const copyText =
        copyEmailButton.querySelector(
          "strong"
        );

      if (!email) {
        showToast(
          "복사할 이메일 주소가 없습니다."
        );

        return;
      }

      try {
        await copyToClipboard(email);

        if (copyText) {
          copyText.textContent = "완료";
        }

        showToast(
          "이메일 주소를 복사했습니다."
        );

        window.setTimeout(() => {
          if (copyText) {
            copyText.textContent = "복사";
          }
        }, 1800);
      } catch (error) {
        showToast(
          "복사하지 못했습니다. 이메일을 직접 선택해 주세요."
        );
      }
    }
  );
}


/* =========================================================
   커스텀 마우스 커서
   ========================================================= */

function initializeCustomCursor() {
  const cursorDot =
    document.querySelector(
      "[data-cursor-dot]"
    );

  const cursorRing =
    document.querySelector(
      "[data-cursor-ring]"
    );

  if (!cursorDot || !cursorRing) {
    return;
  }

  const canUseCursor =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (
    !canUseCursor ||
    reducedMotion
  ) {
    return;
  }

  document.body.classList.add(
    "has-custom-cursor"
  );

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  function animateCursor() {
    ringX +=
      (mouseX - ringX) * 0.18;

    ringY +=
      (mouseY - ringY) * 0.18;

    cursorRing.style.left =
      `${ringX}px`;

    cursorRing.style.top =
      `${ringY}px`;

    window.requestAnimationFrame(
      animateCursor
    );
  }

  document.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.left =
        `${mouseX}px`;

      cursorDot.style.top =
        `${mouseY}px`;

      cursorDot.classList.add(
        "is-visible"
      );

      cursorRing.classList.add(
        "is-visible"
      );
    },
    {
      passive: true,
    }
  );

  document.addEventListener(
    "mouseleave",
    () => {
      cursorDot.classList.remove(
        "is-visible"
      );

      cursorRing.classList.remove(
        "is-visible"
      );
    }
  );

  document.addEventListener(
    "mouseover",
    (event) => {
      const interactiveElement =
        event.target.closest(
          "a, button, input, textarea, select, [role='button']"
        );

      cursorRing.classList.toggle(
        "is-hovering",
        Boolean(interactiveElement)
      );
    }
  );

  animateCursor();
}

initializeCustomCursor();


/* =========================================================
   배경 파티클
   ========================================================= */

function initializeParticles() {
  const canvas =
    document.querySelector(
      "[data-particle-canvas]"
    );

  if (
    !(canvas instanceof HTMLCanvasElement)
  ) {
    return;
  }

  const context =
    canvas.getContext("2d");

  if (!context) return;

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (reducedMotion) {
    canvas.hidden = true;
    return;
  }

  let canvasWidth = 0;
  let canvasHeight = 0;

  let particleColor = {
    red: 85,
    green: 120,
    blue: 245,
  };

  const particles = [];

  function parseHexColor(hexColor) {
    const hex = hexColor
      .replace("#", "")
      .trim();

    if (hex.length !== 6) {
      return particleColor;
    }

    return {
      red: Number.parseInt(
        hex.slice(0, 2),
        16
      ),

      green: Number.parseInt(
        hex.slice(2, 4),
        16
      ),

      blue: Number.parseInt(
        hex.slice(4, 6),
        16
      ),
    };
  }

  function updateParticleColor() {
    const primaryColor =
      getComputedStyle(
        document.documentElement
      )
        .getPropertyValue("--primary")
        .trim();

    if (primaryColor.startsWith("#")) {
      particleColor =
        parseHexColor(primaryColor);
    }
  }

  function createParticle() {
    return {
      x:
        Math.random() *
        canvasWidth,

      y:
        Math.random() *
        canvasHeight,

      radius:
        Math.random() * 2 + 0.6,

      velocityX:
        (Math.random() - 0.5) *
        0.25,

      velocityY:
        (Math.random() - 0.5) *
        0.25,

      alpha:
        Math.random() *
          0.25 +
        0.08,
    };
  }

  function resetParticles() {
    particles.length = 0;

    const calculatedCount =
      Math.floor(
        canvasWidth *
          canvasHeight /
          35000
      );

    const particleCount =
      Math.min(
        40,
        Math.max(
          18,
          calculatedCount
        )
      );

    for (
      let index = 0;
      index < particleCount;
      index += 1
    ) {
      particles.push(
        createParticle()
      );
    }
  }

  function resizeCanvas() {
    const ratio =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    canvasWidth =
      window.innerWidth;

    canvasHeight =
      window.innerHeight;

    canvas.width =
      Math.floor(
        canvasWidth * ratio
      );

    canvas.height =
      Math.floor(
        canvasHeight * ratio
      );

    canvas.style.width =
      `${canvasWidth}px`;

    canvas.style.height =
      `${canvasHeight}px`;

    context.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );

    resetParticles();
  }

  function moveParticle(particle) {
    particle.x +=
      particle.velocityX;

    particle.y +=
      particle.velocityY;

    if (particle.x < -10) {
      particle.x =
        canvasWidth + 10;
    }

    if (
      particle.x >
      canvasWidth + 10
    ) {
      particle.x = -10;
    }

    if (particle.y < -10) {
      particle.y =
        canvasHeight + 10;
    }

    if (
      particle.y >
      canvasHeight + 10
    ) {
      particle.y = -10;
    }
  }

  function drawParticle(particle) {
    context.beginPath();

    context.arc(
      particle.x,
      particle.y,
      particle.radius,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      `rgba(` +
      `${particleColor.red}, ` +
      `${particleColor.green}, ` +
      `${particleColor.blue}, ` +
      `${particle.alpha})`;

    context.fill();
  }

  function drawConnections() {
    const maximumDistance = 110;

    for (
      let firstIndex = 0;
      firstIndex <
      particles.length;
      firstIndex += 1
    ) {
      for (
        let secondIndex =
          firstIndex + 1;
        secondIndex <
        particles.length;
        secondIndex += 1
      ) {
        const first =
          particles[firstIndex];

        const second =
          particles[secondIndex];

        const distance =
          Math.hypot(
            first.x - second.x,
            first.y - second.y
          );

        if (
          distance >=
          maximumDistance
        ) {
          continue;
        }

        const alpha =
          (1 -
            distance /
              maximumDistance) *
          0.07;

        context.beginPath();

        context.moveTo(
          first.x,
          first.y
        );

        context.lineTo(
          second.x,
          second.y
        );

        context.strokeStyle =
          `rgba(` +
          `${particleColor.red}, ` +
          `${particleColor.green}, ` +
          `${particleColor.blue}, ` +
          `${alpha})`;

        context.lineWidth = 0.8;
        context.stroke();
      }
    }
  }

  function animateParticles() {
    context.clearRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    particles.forEach((particle) => {
      moveParticle(particle);
      drawParticle(particle);
    });

    drawConnections();

    window.requestAnimationFrame(
      animateParticles
    );
  }

  updateParticleColor();
  resizeCanvas();
  animateParticles();

  window.addEventListener(
    "resize",
    resizeCanvas
  );

  document.addEventListener(
    "napolnapol:themechange",
    updateParticleColor
  );
}

initializeParticles();


/* =========================================================
   인터랙티브 타임라인
   ========================================================= */

function initializeTimelineFilter() {
  const filterButtons = [
    ...document.querySelectorAll(
      "[data-timeline-filter]"
    ),
  ];

  const timelineItems = [
    ...document.querySelectorAll(
      "[data-timeline-category]"
    ),
  ];

  if (
    filterButtons.length === 0 ||
    timelineItems.length === 0
  ) {
    return;
  }

  function applyFilter(category) {
    timelineItems.forEach((item) => {
      const itemCategory =
        item.dataset.timelineCategory;

      const shouldShow =
        category === "all" ||
        category === itemCategory;

      item.classList.toggle(
        "is-filtered-out",
        !shouldShow
      );
    });

    filterButtons.forEach((button) => {
      const isActive =
        button.dataset
          .timelineFilter ===
        category;

      button.classList.toggle(
        "is-active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        const category =
          button.dataset
            .timelineFilter ||
          "all";

        applyFilter(category);
      }
    );
  });

  applyFilter("all");
}

initializeTimelineFilter();


/* =========================================================
   localStorage 방명록
   ========================================================= */

function createGuestbookId() {
  if (
    window.crypto &&
    typeof window.crypto
      .randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return (
    String(Date.now()) +
    "-" +
    Math.random()
      .toString(16)
      .slice(2)
  );
}

function initializeGuestbook() {
  const guestbookForm =
    document.querySelector(
      "[data-guestbook-form]"
    );

  const guestbookList =
    document.querySelector(
      "[data-guestbook-list]"
    );

  const emptyState =
    document.querySelector(
      "[data-guestbook-empty]"
    );

  const clearButton =
    document.querySelector(
      "[data-guestbook-clear]"
    );

  const messageCount =
    document.querySelector(
      "[data-message-count]"
    );

  if (
    !(
      guestbookForm instanceof
      HTMLFormElement
    ) ||
    !guestbookList
  ) {
    return;
  }

  const nameInput =
    guestbookForm.elements.namedItem(
      "name"
    );

  const messageInput =
    guestbookForm.elements.namedItem(
      "message"
    );

  if (
    !(
      nameInput instanceof
      HTMLInputElement
    ) ||
    !(
      messageInput instanceof
      HTMLTextAreaElement
    )
  ) {
    return;
  }

  let guestbookEntries = [];

  function loadEntries() {
    const savedEntries =
      getStoredValue(
        STORAGE_KEYS.guestbook
      );

    if (!savedEntries) {
      guestbookEntries = [];
      return;
    }

    try {
      const parsedEntries =
        JSON.parse(savedEntries);

      guestbookEntries =
        Array.isArray(
          parsedEntries
        )
          ? parsedEntries
          : [];
    } catch (error) {
      guestbookEntries = [];

      removeStoredValue(
        STORAGE_KEYS.guestbook
      );
    }
  }

  function saveEntries() {
    return setStoredValue(
      STORAGE_KEYS.guestbook,
      JSON.stringify(
        guestbookEntries
      )
    );
  }

  function formatDate(dateString) {
    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "ko-KR",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(date);
  }

  function deleteEntry(entryId) {
    guestbookEntries =
      guestbookEntries.filter(
        (entry) =>
          entry.id !== entryId
      );

    saveEntries();
    renderEntries();

    showToast(
      "방명록을 삭제했습니다."
    );
  }

  function createEntryElement(entry) {
    const item =
      document.createElement("li");

    const headerElement =
      document.createElement("div");

    const nameElement =
      document.createElement("strong");

    const timeElement =
      document.createElement("time");

    const messageElement =
      document.createElement("p");

    const deleteButton =
      document.createElement("button");

    item.className =
      "guestbook-item";

    headerElement.className =
      "guestbook-item-header";

    nameElement.textContent =
      entry.name;

    timeElement.dateTime =
      entry.createdAt;

    timeElement.textContent =
      formatDate(
        entry.createdAt
      );

    messageElement.textContent =
      entry.message;

    deleteButton.type = "button";

    deleteButton.className =
      "guestbook-item-delete";

    deleteButton.textContent =
      "삭제";

    deleteButton.setAttribute(
      "aria-label",
      `${entry.name}님의 방명록 삭제`
    );

    deleteButton.addEventListener(
      "click",
      () => {
        deleteEntry(entry.id);
      }
    );

    headerElement.append(
      nameElement,
      timeElement
    );

    item.append(
      headerElement,
      messageElement,
      deleteButton
    );

    return item;
  }

  function renderEntries() {
    guestbookList
      .querySelectorAll(
        ".guestbook-item"
      )
      .forEach((item) => {
        item.remove();
      });

    if (emptyState) {
      emptyState.hidden =
        guestbookEntries.length > 0;
    }

    guestbookEntries.forEach(
      (entry) => {
        guestbookList.appendChild(
          createEntryElement(entry)
        );
      }
    );

    if (clearButton) {
      clearButton.disabled =
        guestbookEntries.length === 0;
    }
  }

  function updateMessageCount() {
    if (!messageCount) return;

    messageCount.textContent =
      String(
        messageInput.value.length
      );
  }

  messageInput.addEventListener(
    "input",
    updateMessageCount
  );

  guestbookForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const name =
        nameInput.value.trim();

      const message =
        messageInput.value.trim();

      if (!name || !message) {
        showToast(
          "이름과 메시지를 모두 입력해 주세요."
        );

        return;
      }

      const entry = {
        id: createGuestbookId(),

        name:
          name.slice(0, 20),

        message:
          message.slice(0, 120),

        createdAt:
          new Date().toISOString(),
      };

      guestbookEntries.unshift(
        entry
      );

      guestbookEntries =
        guestbookEntries.slice(
          0,
          30
        );

      const saved =
        saveEntries();

      renderEntries();

      guestbookForm.reset();
      updateMessageCount();

      showToast(
        saved
          ? "방명록을 남겼습니다."
          : "브라우저에 저장하지 못했습니다."
      );
    }
  );

  if (clearButton) {
    clearButton.addEventListener(
      "click",
      () => {
        if (
          guestbookEntries.length === 0
        ) {
          return;
        }

        const shouldClear =
          window.confirm(
            "저장된 방명록을 모두 삭제하시겠습니까?"
          );

        if (!shouldClear) return;

        guestbookEntries = [];

        removeStoredValue(
          STORAGE_KEYS.guestbook
        );

        renderEntries();

        showToast(
          "방명록을 모두 삭제했습니다."
        );
      }
    );
  }

  loadEntries();
  renderEntries();
  updateMessageCount();
}

initializeGuestbook();


/* =========================================================
   나비 이스터에그
   ========================================================= */

function initializeEasterEgg() {
  const easterEggButton =
    document.querySelector(
      "[data-easter-egg]"
    );

  const easterEggPanel =
    document.querySelector(
      "[data-easter-egg-panel]"
    );

  const closeButton =
    document.querySelector(
      "[data-easter-egg-close]"
    );

  if (
    !easterEggButton ||
    !easterEggPanel
  ) {
    return;
  }

  function openPanel() {
    easterEggPanel.hidden = false;

    easterEggButton.setAttribute(
      "aria-expanded",
      "true"
    );

    setStoredValue(
      STORAGE_KEYS.easterEgg,
      "true"
    );

    showToast(
      "숨겨진 나폴나폴 나비를 찾았습니다!"
    );
  }

  function closePanel() {
    easterEggPanel.hidden = true;

    easterEggButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  easterEggButton.setAttribute(
    "aria-expanded",
    "false"
  );

  easterEggButton.addEventListener(
    "click",
    () => {
      if (easterEggPanel.hidden) {
        openPanel();
      } else {
        closePanel();
      }
    }
  );

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closePanel
    );
  }

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        !easterEggPanel.hidden
      ) {
        closePanel();
      }
    }
  );
}

initializeEasterEgg();


/* =========================================================
   주소가 비어 있는 링크 안내
   ========================================================= */

document
  .querySelectorAll('a[href="#"]')
  .forEach((link) => {
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();

        showToast(
          "해당 링크 주소를 입력해 주세요."
        );
      }
    );
  });