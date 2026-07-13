"use strict";

/* =========================================================
   나폴나폴 포트폴리오 공통 스크립트
   - MPA 현재 페이지 표시
   - 모바일 메뉴
   - 스크롤 UI
   - 다크/라이트 모드
   - index/projects/journey 전체 한·영 전환
   - 이메일 복사
   - 커스텀 커서
   - 배경 파티클
   - 인터랙티브 타임라인
   - localStorage 방명록
   - 이스터에그
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

const toast =
  document.querySelector(".toast");

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

const STORAGE_KEYS = {
  theme: "napolnapol-theme",
  language: "napolnapol-language",
  guestbook: "napolnapol-guestbook",
  easterEgg: "napolnapol-easter-egg",
};


/* =========================================================
   안전한 localStorage 처리
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

function getCurrentLanguage() {
  return document.documentElement.lang === "en"
    ? "en"
    : "ko";
}


/* =========================================================
   공통 UI 메시지 번역
   ========================================================= */

const UI_TEXT = {
  ko: {
    menuOpen: "메뉴 열기",
    menuClose: "메뉴 닫기",

    themeToLight: "라이트 모드로 변경",
    themeToDark: "다크 모드로 변경",

    changedToDark:
      "다크 모드로 변경했습니다.",

    changedToLight:
      "라이트 모드로 변경했습니다.",

    languageToKorean:
      "한국어로 보기",

    languageToEnglish:
      "영어로 보기",

    changedToKorean:
      "한국어로 변경했습니다.",

    changedToEnglish:
      "영어로 변경했습니다.",

    emailMissing:
      "복사할 이메일 주소가 없습니다.",

    emailCopied:
      "이메일 주소를 복사했습니다.",

    emailCopyFailed:
      "복사하지 못했습니다. 이메일을 직접 선택해 주세요.",

    copy: "복사",
    copied: "완료",

    guestbookRequired:
      "이름과 메시지를 모두 입력해 주세요.",

    guestbookAdded:
      "방명록을 남겼습니다.",

    guestbookSaveFailed:
      "브라우저에 저장하지 못했습니다.",

    guestbookDeleted:
      "방명록을 삭제했습니다.",

    guestbookClearConfirm:
      "저장된 방명록을 모두 삭제하시겠습니까?",

    guestbookCleared:
      "방명록을 모두 삭제했습니다.",

    guestbookDelete:
      "삭제",

    guestbookDeleteAria: (name) =>
      `${name}님의 방명록 삭제`,

    easterEggFound:
      "숨겨진 나폴나폴 나비를 찾았습니다!",

    emptyLink:
      "해당 링크 주소를 입력해 주세요.",
  },

  en: {
    menuOpen: "Open menu",
    menuClose: "Close menu",

    themeToLight:
      "Switch to light mode",

    themeToDark:
      "Switch to dark mode",

    changedToDark:
      "Dark mode is on.",

    changedToLight:
      "Light mode is on.",

    languageToKorean:
      "View in Korean",

    languageToEnglish:
      "View in English",

    changedToKorean:
      "Korean mode is on.",

    changedToEnglish:
      "English mode is on.",

    emailMissing:
      "There is no email address to copy.",

    emailCopied:
      "The email address has been copied.",

    emailCopyFailed:
      "The email could not be copied. Please select it manually.",

    copy: "Copy",
    copied: "Copied",

    guestbookRequired:
      "Please enter both your name and message.",

    guestbookAdded:
      "Your message has been added.",

    guestbookSaveFailed:
      "The message could not be saved in this browser.",

    guestbookDeleted:
      "The message has been deleted.",

    guestbookClearConfirm:
      "Delete all saved guestbook messages?",

    guestbookCleared:
      "All guestbook messages have been deleted.",

    guestbookDelete:
      "Delete",

    guestbookDeleteAria: (name) =>
      `Delete ${name}'s guestbook message`,

    easterEggFound:
      "You found the hidden Napolnapol butterfly!",

    emptyLink:
      "Please enter a valid link address.",
  },
};

function uiText(key, ...args) {
  const language = getCurrentLanguage();
  const value = UI_TEXT[language][key];

  return typeof value === "function"
    ? value(...args)
    : value;
}


/* =========================================================
   토스트
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
   MPA 현재 페이지 표시
   ========================================================= */

function getCurrentFileName() {
  const fileName =
    window.location.pathname
      .split("/")
      .pop();

  return fileName || "index.html";
}

function updateCurrentPageNavigation() {
  const currentFileName =
    getCurrentFileName();

  navLinks.forEach((link) => {
    const href =
      link.getAttribute("href");

    if (!href) return;

    const targetFileName = href
      .split("#")[0]
      .split("?")[0]
      .split("/")
      .pop();

    const isHtmlPage =
      targetFileName &&
      targetFileName.endsWith(".html");

    if (!isHtmlPage) return;

    const isCurrentPage =
      targetFileName === currentFileName;

    const isContactLink =
      href.includes("#contact");

    link.classList.toggle(
      "is-current",
      isCurrentPage && !isContactLink
    );

    if (
      isCurrentPage &&
      !isContactLink
    ) {
      link.setAttribute(
        "aria-current",
        "page"
      );
    } else {
      link.removeAttribute(
        "aria-current"
      );
    }
  });
}

updateCurrentPageNavigation();


/* =========================================================
   모바일 메뉴
   ========================================================= */

function updateMenuButtonLabel(isOpen) {
  if (!menuButton) return;

  menuButton.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  menuButton.setAttribute(
    "aria-label",
    isOpen
      ? uiText("menuClose")
      : uiText("menuOpen")
  );
}

function closeMenu() {
  if (!menuButton || !navigation) {
    return;
  }

  menuButton.classList.remove(
    "active"
  );

  navigation.classList.remove(
    "open"
  );

  document.body.classList.remove(
    "menu-open"
  );

  updateMenuButtonLabel(false);
}

if (menuButton && navigation) {
  menuButton.addEventListener(
    "click",
    () => {
      const isOpen =
        navigation.classList.toggle(
          "open"
        );

      menuButton.classList.toggle(
        "active",
        isOpen
      );

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );

      updateMenuButtonLabel(isOpen);
    }
  );
}

navLinks.forEach((link) => {
  link.addEventListener(
    "click",
    closeMenu
  );
});

window.addEventListener(
  "resize",
  () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  }
);

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  }
);


/* =========================================================
   스크롤 UI
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
      ? (
          window.scrollY /
          scrollableHeight
        ) * 100
      : 0;

  const safeProgress =
    Math.min(
      100,
      Math.max(0, progress)
    );

  scrollProgressBar.style.width =
    `${safeProgress}%`;

  scrollProgress.setAttribute(
    "aria-valuenow",
    String(
      Math.round(safeProgress)
    )
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
   스크롤 등장 효과
   ========================================================= */

function initializeRevealAnimation() {
  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );

  if (
    revealElements.length === 0
  ) {
    return;
  }

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (
    reducedMotion ||
    !(
      "IntersectionObserver"
      in window
    )
  ) {
    revealElements.forEach(
      (element) => {
        element.classList.add(
          "visible"
        );
      }
    );

    return;
  }

  const observer =
    new IntersectionObserver(
      (
        entries,
        revealObserver
      ) => {
        entries.forEach(
          (entry) => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            revealObserver.unobserve(
              entry.target
            );
          }
        );
      },
      {
        threshold: 0.14,
        rootMargin:
          "0px 0px -40px",
      }
    );

  revealElements.forEach(
    (element) => {
      observer.observe(element);
    }
  );
}

initializeRevealAnimation();


/* =========================================================
   같은 페이지 해시 메뉴 강조
   ========================================================= */

function updateActiveSectionNavigation() {
  if (!header) return;

  const hashLinks =
    navLinks.filter((link) => {
      const href =
        link.getAttribute("href");

      return (
        href &&
        href.startsWith("#") &&
        href !== "#"
      );
    });

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

    if (
      section &&
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
   다크/라이트 모드
   ========================================================= */

function getPreferredTheme() {
  const savedTheme =
    getStoredValue(
      STORAGE_KEYS.theme
    );

  if (
    savedTheme === "dark" ||
    savedTheme === "light"
  ) {
    return savedTheme;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
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
      ? uiText("themeToLight")
      : uiText("themeToDark")
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

  document.documentElement
    .dataset.theme = nextTheme;

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
          ? uiText(
              "changedToDark"
            )
          : uiText(
              "changedToLight"
            )
      );
    }
  );
}


/* =========================================================
   페이지 메타데이터
   ========================================================= */

const PAGE_META = {
  home: {
    ko: {
      title:
        "나폴나폴 | 고민균 포트폴리오",

      description:
        "소통은 부드럽게, 해결은 끝까지. SW 개발자 고민균의 포트폴리오입니다.",
    },

    en: {
      title:
        "Napolnapol | Min-Gyun Ko Portfolio",

      description:
        "Communicate with care, solve to the end. The portfolio of software developer Min-Gyun Ko.",
    },
  },

  projects: {
    ko: {
      title:
        "프로젝트 | 나폴나폴",

      description:
        "고민균의 대표 프론트엔드 프로젝트와 문제 해결 과정을 소개합니다.",
    },

    en: {
      title:
        "Projects | Napolnapol",

      description:
        "Featured frontend projects and problem-solving experiences by Min-Gyun Ko.",
    },
  },

  journey: {
    ko: {
      title:
        "여정 | 나폴나폴",

      description:
        "고민균의 학습, 프로젝트, 수상 경험을 타임라인으로 소개합니다.",
    },

    en: {
      title:
        "Journey | Napolnapol",

      description:
        "A timeline of Min-Gyun Ko's education, projects, research, and awards.",
    },
  },
};


/* =========================================================
   공통 번역
   ========================================================= */

const COMMON_TRANSLATIONS = [
  {
    selector: ".skip-link",
    ko: "본문으로 바로가기",
    en: "Skip to main content",
  },

  {
    selector:
      ".brand > span:last-child",

    ko: "나폴나폴",
    en: "Napolnapol",
  },

  {
    selector:
      '.primary-navigation a[href="index.html"]',

    ko: "홈",
    en: "Home",
  },

  {
    selector:
      '.primary-navigation a[href="projects.html"]',

    ko: "프로젝트",
    en: "Projects",
  },

  {
    selector:
      '.primary-navigation a[href="journey.html"]',

    ko: "여정",
    en: "Journey",
  },

  {
    selector:
      '.primary-navigation a[href="index.html#contact"]',

    ko: "연락",
    en: "Contact",
  },

  {
    selector:
      ".footer-inner > div:first-child > p",

    ko:
      "나비처럼 나의 매력을 나폴나폴 퍼트리는 포트폴리오",

    en:
      "A portfolio that gently spreads my strengths like a butterfly.",
  },

  {
    selector:
      ".footer-right > p",

    html: true,

    ko:
      '© <span id="current-year"></span> 고민균. All rights reserved.',

    en:
      '© <span id="current-year"></span> Min-Gyun Ko. All rights reserved.',
  },

  {
    selector:
      ".easter-egg-panel strong",

    ko:
      "나폴나폴 이스터에그 발견!",

    en:
      "Napolnapol Easter Egg Found!",
  },

  {
    selector:
      ".easter-egg-panel p",

    ko:
      "작은 문제도 그냥 지나치지 않는 관찰력을 확인했습니다.",

    en:
      "You noticed a small detail that could easily have been missed.",
  },

  {
    selector:
      "[data-easter-egg-close]",

    ko: "닫기",
    en: "Close",
  },

  {
    selector: ".toast",

    ko:
      "이메일 주소를 복사했습니다.",

    en:
      "The email address has been copied.",
  },

  {
    selector:
      ".scroll-progress",

    attribute: "aria-label",

    ko:
      "페이지 스크롤 진행률",

    en:
      "Page scroll progress",
  },

  {
    selector:
      ".primary-navigation",

    attribute: "aria-label",

    ko: "주요 메뉴",
    en: "Primary navigation",
  },

  {
    selector:
      ".navigation-actions",

    attribute: "aria-label",

    ko: "화면 설정",
    en: "Display settings",
  },

  {
    selector:
      ".back-to-top",

    attribute: "aria-label",

    ko: "맨 위로 이동",
    en: "Back to top",
  },

  {
    selector:
      "[data-easter-egg]",

    attribute: "aria-label",

    ko: "숨겨진 나비 찾기",
    en: "Find the hidden butterfly",
  },

  {
    selector:
      "[data-easter-egg]",

    attribute: "title",

    ko: "나비를 눌러 보세요",
    en: "Click the butterfly",
  },
];


/* =========================================================
   index.html 전체 번역
   ========================================================= */

const HOME_TRANSLATIONS = [
  {
    selector:
      ".hero .eyebrowhead",

    ko: "SW 개발자 고민균",

    en:
      "Software Developer Min-Gyun Ko",
  },

  {
    selector:
      ".hero h1 > span:first-child",

    ko:
      "소통은 부드럽게,",

    en:
      "Communicate with care,",
  },

  {
    selector:
      ".hero h1 .text-gradient",

    ko:
      "해결은 끝까지.",

    en:
      "solve to the end.",
  },

  {
    selector:
      ".hero-description",

    ko:
      "작은 문제도 그냥 넘기지 않고 여러 가능성을 검토하며, 개인의 경험을 팀의 가치로 확장합니다.",

    en:
      "I explore multiple possibilities, pursue root causes, and turn individual experience into shared team value.",
  },

  {
    selector:
      ".hero-actions .button-primary span:first-child",

    ko:
      "대표 프로젝트 보기",

    en:
      "View Projects",
  },

  {
    selector:
      ".hero-actions .button-secondary span",

    ko: "연락하기",
    en: "Contact Me",
  },

  {
    selector:
      ".code-card code b:nth-of-type(1)",

    ko:
      '"끝을 보는 집요함"',

    en:
      '"Persistence to the End"',
  },

  {
    selector:
      ".code-card code b:nth-of-type(2)",

    ko:
      '"근거 중심"',

    en:
      '"Evidence-Based Decisions"',
  },

  {
    selector:
      ".code-card code b:nth-of-type(3)",

    ko:
      '"가치를 나누는 협업"',

    en:
      '"Value-Sharing Teamwork"',
  },

  {
    selector:
      "#about .section-heading h2",

    html: true,

    ko:
      "30초 안에 이해되는<br />나만의 포트폴리오",

    en:
      "A Portfolio You Can Understand<br />in 30 Seconds",
  },

  {
    selector:
      "#about .section-heading > p:last-child",

    ko:
      "기술을 나열하기보다 어떤 문제를 발견했고, 어떤 근거로 해결했으며, 그 과정에서 팀에 어떤 가치를 남겼는지를 보여줍니다.",

    en:
      "Rather than simply listing technologies, I show what problems I found, how I solved them, and what value I created for the team.",
  },

  {
    selector:
      ".overview-card-large h3",

    html: true,

    ko:
      "부드러운 유연함과<br />집요한 책임감의 조화",

    en:
      "A Balance of Flexibility<br />and Persistent Responsibility",
  },

  {
    selector:
      ".overview-card-large > p",

    ko:
      "사용자 경험을 기준으로 문제를 정의하고, 서비스 규모가 커져도 유지할 수 있는 상태와 UI 구조를 고민합니다. 동료의 의견을 경청하면서도 작은 문제를 임시방편으로 덮지 않고 근본 원인을 찾을 때까지 파고듭니다.",

    en:
      "I define problems from the user's perspective and design state and UI structures that remain maintainable as services grow. I listen carefully to teammates while continuing to investigate until I find the root cause.",
  },

  {
    selector:
      ".profile-meta div:nth-child(1) span",

    ko: "희망 직무",
    en: "Target Role",
  },

  {
    selector:
      ".profile-meta div:nth-child(1) strong",

    ko: "SW 개발자",
    en: "Software Developer",
  },

  {
    selector:
      ".profile-meta div:nth-child(2) span",

    ko: "관심 분야",
    en: "Interests",
  },

  {
    selector:
      ".overview-card:nth-child(2) h3",

    ko: "문제 정의",
    en: "Define the Problem",
  },

  {
    selector:
      ".overview-card:nth-child(2) p",

    ko:
      "무엇을 고쳐야 하는지보다 왜 문제가 발생했는지 먼저 확인합니다.",

    en:
      "I first identify why a problem occurred rather than immediately deciding what to fix.",
  },

  {
    selector:
      ".overview-card:nth-child(3) h3",

    ko: "대안 검토",
    en: "Compare Alternatives",
  },

  {
    selector:
      ".overview-card:nth-child(3) p",

    ko:
      "조건과 제약을 기준으로 여러 해결 방법을 비교합니다.",

    en:
      "I compare multiple solutions based on the project's conditions and constraints.",
  },

  {
    selector:
      ".overview-card:nth-child(4) h3",

    ko: "해결과 기록",
    en: "Solve and Document",
  },

  {
    selector:
      ".overview-card:nth-child(4) p",

    ko:
      "해결한 경험이 팀의 다음 판단에 활용되도록 기록하고 공유합니다.",

    en:
      "I document and share solutions so the team can use them in future decisions.",
  },

  {
    selector:
      "#values .section-heading h2",

    ko:
      "제가 문제를 해결하는 방식",

    en:
      "How I Solve Problems",
  },

  {
    selector:
      "#values .value-card:nth-child(1) h3",

    ko:
      "끝을 보는 집요함",

    en:
      "Persistence to the End",
  },

  {
    selector:
      "#values .value-card:nth-child(1) p",

    ko:
      "오류의 표면만 수정하지 않고 로그, 흐름, 환경을 따라가며 문제의 근본 원인을 찾습니다.",

    en:
      "I follow logs, application flows, and environments to identify root causes instead of only fixing surface-level symptoms.",
  },

  {
    selector:
      "#values .value-card:nth-child(2) h3",

    ko:
      "반복적인 개선",

    en:
      "Continuous Improvement",
  },

  {
    selector:
      "#values .value-card:nth-child(2) p",

    ko:
      "한 번의 성공에 만족하지 않고 구조와 사용 흐름을 다시 점검해 더 나은 방식으로 개선합니다.",

    en:
      "I revisit structures and user flows after implementation and continuously improve them.",
  },

  {
    selector:
      "#values .value-card:nth-child(3) h3",

    ko:
      "근거 중심의 판단",

    en:
      "Evidence-Based Decisions",
  },

  {
    selector:
      "#values .value-card:nth-child(3) p",

    ko:
      "익숙함이나 유행보다 프로젝트의 조건과 대안을 비교해 기술 선택의 이유를 설명합니다.",

    en:
      "I compare project conditions and alternatives so I can clearly explain every technical decision.",
  },

  {
    selector:
      "#values .value-card:nth-child(4) h3",

    ko:
      "가치를 남기는 실행",

    en:
      "Action That Creates Value",
  },

  {
    selector:
      "#values .value-card:nth-child(4) p",

    ko:
      "발견한 문제를 직접 개선하고 트러블슈팅과 가이드로 남겨 팀의 반복 비용을 줄입니다.",

    en:
      "I improve identified problems and leave troubleshooting notes and guides that reduce repeated team effort.",
  },

  {
    selector:
      "#skills .section-heading h2",

    html: true,

    ko:
      "기술은 목적이 아니라<br />문제를 해결하는 도구입니다.",

    en:
      "Technology Is Not the Goal,<br />but a Tool for Solving Problems.",
  },

  {
    selector:
      "#skills .section-heading > p:last-child",

    ko:
      "React와 TypeScript를 중심으로 사용자 흐름과 상태를 구조화하고, 유지보수 가능한 UI 아키텍처와 안정적인 서비스 경험을 고민합니다.",

    en:
      "Using React and TypeScript, I structure user flows and application state while building maintainable UI architecture and reliable service experiences.",
  },

  {
    selector:
      "#project-preview .section-heading h2",

    html: true,

    ko:
      "프로젝트에서 확인하는<br />실제 문제 해결 과정",

    en:
      "See My Problem-Solving Process<br />Through Real Projects",
  },

  {
    selector:
      "#project-preview .section-heading > p:last-child",

    ko:
      "대표 프로젝트의 전체 내용은 프로젝트 페이지에서 확인할 수 있습니다.",

    en:
      "Visit the Projects page to see the complete details of each featured project.",
  },

  {
    selector:
      ".project-preview-card:nth-child(1) p",

    ko:
      "모노레포와 디자인 시스템으로 구성한 카페 리워드 서비스",

    en:
      "A café reward service built with a monorepo and reusable design system.",
  },

  {
    selector:
      ".project-preview-card:nth-child(2) h3",

    ko: "글다",
    en: "Geulda",
  },

  {
    selector:
      ".project-preview-card:nth-child(2) p",

    ko:
      "부천의 명소와 여행 엽서를 연결하는 AI 관광 플랫폼",

    en:
      "An AI tourism platform connecting Bucheon attractions with collectible travel postcards.",
  },

  {
    selector:
      ".project-preview-card:nth-child(3) p",

    ko:
      "카페 방문을 단골 루틴으로 연결하는 디지털 리워드 플랫폼",

    en:
      "A digital reward platform that turns café visits into a loyal customer routine.",
  },

  {
    selector:
      ".project-preview-card:nth-child(4) p",

    ko:
      "실시간 채팅 기반 대학생 택시 동승자 매칭 서비스",

    en:
      "A real-time chat service that matches university students for shared taxi rides.",
  },

  {
    selector:
      ".project-preview-card strong",

    ko: "자세히 보기 ↗",
    en: "View Details ↗",
  },

  {
    selector:
      ".section-more-action .button-primary",

    html: true,

    ko:
      '모든 프로젝트 보기 <span aria-hidden="true">↗</span>',

    en:
      'View All Projects <span aria-hidden="true">↗</span>',
  },

  {
    selector:
      "#more-about .section-heading h2",

    html: true,

    ko:
      "혼자 해결하는 것보다<br />함께 성장하는 방식을 선택합니다.",

    en:
      "I Choose to Grow Together<br />Rather Than Solve Everything Alone.",
  },

  {
    selector:
      "#more-about .quote-card > p",

    ko:
      "“문제를 해결한 경험은 개인의 기억으로 끝내지 않고, 다음 사람이 더 빠르게 판단할 수 있는 기록으로 남겨야 한다고 생각합니다.”",

    en:
      "“A solved problem should not remain only in one person's memory. It should become documentation that helps the next person make a faster decision.”",
  },

  {
    selector:
      "#more-about .quote-card span",

    ko:
      "협업 가치관",

    en:
      "Collaboration Principle",
  },

  {
    selector:
      "#contact .contact-intro h2",

    html: true,

    ko:
      "함께 새로운 가치를<br />나폴나폴 퍼트려 볼까요?",

    en:
      "Shall We Spread<br />New Value Together?",
  },

  {
    selector:
      "#contact .contact-intro > p:last-child",

    ko:
      "프로젝트와 기술에 관해 더 이야기하고 싶다면 편한 방법으로 연락해 주세요.",

    en:
      "Feel free to contact me through any convenient channel to discuss projects and technology.",
  },

  {
    selector:
      '#contact a[href^="tel:"] small',

    ko: "전화 걸기",
    en: "Call Me",
  },

  {
    selector:
      '#contact a[href*="linkedin.com"] small',

    ko:
      "경력과 활동 확인하기",

    en:
      "View My Experience",
  },

  {
    selector:
      "#contact .contact-info-item:nth-child(3) small",

    ko: "자택 연락처",
    en: "Home Contact",
  },

  {
    selector:
      "#contact .contact-actions .button-primary",

    html: true,

    ko:
      '이메일 보내기 <span aria-hidden="true">↗</span>',

    en:
      'Send Email <span aria-hidden="true">↗</span>',
  },

  {
    selector:
      "#contact .copy-email strong",

    ko: "복사",
    en: "Copy",
  },
];


/* =========================================================
   projects.html 전체 번역
   ========================================================= */

const PROJECT_TRANSLATIONS = [
  {
    selector:
      ".subpage-hero h1",

    html: true,

    ko:
      '결과보다 과정에서 드러나는<br /><span class="text-gradient">문제 해결의 방식</span>',

    en:
      'A Problem-Solving Approach<br /><span class="text-gradient">Revealed Through the Process</span>',
  },

  {
    selector:
      ".subpage-hero-inner > p:last-of-type",

    ko:
      "서비스의 목적, 프론트엔드 역할, 구조와 핵심 구현을 중심으로 프로젝트를 정리했습니다.",

    en:
      "Each project is organized around its purpose, my frontend role, architecture, and key implementation decisions.",
  },

  {
    selector:
      '.page-anchor-navigation a[href="#geulda"]',

    ko: "글다",
    en: "Geulda",
  },

  {
    selector:
      ".page-anchor-navigation",

    attribute: "aria-label",

    ko:
      "프로젝트 바로가기",

    en:
      "Project shortcuts",
  },

  {
    selector:
      "#compasser .project-summary",

    ko:
      "카페별 랜덤박스 결제와 QR 기반 적립 기능을 제공하는 서비스의 프론트엔드 아키텍처를 모노레포로 구성한 프로젝트입니다.",

    en:
      "A project that structures the frontend architecture of a café random-box payment and QR reward service as a monorepo.",
  },

  {
    selector:
      "#compasser .project-detail-list div:nth-child(1) dt",

    ko: "구조",
    en: "Structure",
  },

  {
    selector:
      "#compasser .project-detail-list div:nth-child(1) dd",

    ko:
      "도메인 기반 모노레포를 적용해 여러 앱과 공통 패키지를 분리했습니다.",

    en:
      "Applied a domain-based monorepo to separate multiple applications and shared packages.",
  },

  {
    selector:
      "#compasser .project-detail-list div:nth-child(2) dt",

    ko: "공통화",
    en: "Reuse",
  },

  {
    selector:
      "#compasser .project-detail-list div:nth-child(2) dd",

    ko:
      "디자인 시스템을 별도 패키지로 구축해 UI 일관성과 재사용성을 높였습니다.",

    en:
      "Built the design system as a separate package to improve UI consistency and reusability.",
  },

  {
    selector:
      "#compasser .project-detail-list div:nth-child(3) dt",

    ko: "기능",
    en: "Features",
  },

  {
    selector:
      "#compasser .project-detail-list div:nth-child(3) dd",

    ko:
      "카페별 랜덤박스 결제와 QR 기반 적립 사용자 흐름을 제공합니다.",

    en:
      "Provides user flows for café-specific random-box payments and QR-based rewards.",
  },

  {
    selector:
      ".map-label strong",

    ko:
      "AI 추천 여행 코스",

    en:
      "AI Travel Course",
  },

  {
    selector:
      ".postcard-content strong",

    ko:
      "오늘의 여행 엽서",

    en:
      "Today's Travel Postcard",
  },

  {
    selector:
      ".postcard-content small",

    ko:
      "여행의 순간을 기록하고 수집해요",

    en:
      "Record and collect moments from your trip",
  },

  {
    selector:
      ".postcard-small strong",

    ko:
      "명소 · 문화 · 행사",

    en:
      "Attractions · Culture · Events",
  },

  {
    selector:
      ".postcard-small small",

    ko:
      "부천의 새로운 장소를 발견해요",

    en:
      "Discover new places in Bucheon",
  },

  {
    selector:
      ".tourism-ai-badge small",

    ko:
      "맞춤 여행 코스 추천",

    en:
      "Personalized travel course suggestions",
  },

  {
    selector:
      "#geulda .project-content h2",

    ko: "글다",
    en: "Geulda",
  },

  {
    selector:
      "#geulda .project-summary",

    ko:
      "부천의 명소와 행사, 추천 코스를 한 번에 탐색하고 여행지 엽서를 수집할 수 있는 AI 기반 관광 플랫폼입니다.",

    en:
      "An AI tourism platform for exploring Bucheon attractions, events, and recommended courses while collecting travel postcards.",
  },

  {
    selector:
      "#geulda .project-detail-list div:nth-child(1) dt",

    ko: "역할",
    en: "Role",
  },

  {
    selector:
      "#geulda .project-detail-list div:nth-child(1) dd",

    ko:
      "3인 프론트엔드 팀의 일원으로 서비스 화면과 사용자 흐름 구현에 참여했습니다.",

    en:
      "Worked as one of three frontend developers to implement service screens and user flows.",
  },

  {
    selector:
      "#geulda .project-detail-list div:nth-child(2) dt",

    ko: "구조",
    en: "Structure",
  },

  {
    selector:
      "#geulda .project-detail-list div:nth-child(2) dd",

    ko:
      "Next.js Page Router와 TypeScript를 사용하고 src 기반 FSD 구조를 적용했습니다.",

    en:
      "Used Next.js Page Router and TypeScript with an src-based Feature-Sliced Design structure.",
  },

  {
    selector:
      "#geulda .project-detail-list div:nth-child(3) dt",

    ko: "안정성",
    en: "Reliability",
  },

  {
    selector:
      "#geulda .project-detail-list div:nth-child(3) dd",

    ko:
      "Axios 공통 인스턴스와 401 토큰 재발급, 중복 요청 Race Condition 방지 구조를 사용했습니다.",

    en:
      "Used a shared Axios instance, 401 token refresh flow, and safeguards against duplicate-request race conditions.",
  },

  {
    selector:
      ".loopy-title-card small",

    ko:
      "방문이 단골 루틴으로 이어지도록",

    en:
      "Turn visits into a loyal routine",
  },

  {
    selector:
      ".stamp-card-header strong",

    ko:
      "오늘도 한 잔 적립",

    en:
      "Earn a Stamp Today",
  },

  {
    selector:
      ".stamp-card > small",

    ko:
      "2개의 스탬프를 더 모으면 리워드를 받을 수 있어요.",

    en:
      "Collect two more stamps to receive a reward.",
  },

  {
    selector:
      ".loopy-qr-card strong",

    ko: "QR 적립",
    en: "QR Rewards",
  },

  {
    selector:
      ".loopy-qr-card small",

    ko:
      "스캔하고 바로 적립",

    en:
      "Scan and earn instantly",
  },

  {
    selector:
      ".loopy-notification strong",

    ko:
      "이벤트 알림",

    en:
      "Event Alert",
  },

  {
    selector:
      ".loopy-notification small",

    ko:
      "자주 가는 카페의 새 소식",

    en:
      "News from your favorite cafés",
  },

  {
    selector:
      "#loopy .project-summary",

    ko:
      "종이 스탬프를 디지털로 통합하고 카페와 고객을 연결해 우연한 방문을 단골 루틴으로 바꾸는 디지털 리워드 플랫폼입니다.",

    en:
      "A digital reward platform that replaces paper stamps and connects cafés with customers to turn occasional visits into loyal routines.",
  },

  {
    selector:
      "#loopy .project-detail-list div:nth-child(1) dt",

    ko: "역할",
    en: "Role",
  },

  {
    selector:
      "#loopy .project-detail-list div:nth-child(1) dd",

    ko:
      "프론트엔드 팀원으로 고객 앱과 사장님 웹의 사용자 경험 구현에 참여했습니다.",

    en:
      "Contributed as a frontend developer to the customer application and owner web experience.",
  },

  {
    selector:
      "#loopy .project-detail-list div:nth-child(2) dt",

    ko: "기능",
    en: "Features",
  },

  {
    selector:
      "#loopy .project-detail-list div:nth-child(2) dd",

    ko:
      "QR 스탬프 적립, 카카오맵 탐색, FCM 이벤트 알림, 회원 인증 흐름을 제공합니다.",

    en:
      "Provides QR stamp rewards, Kakao Map exploration, FCM event notifications, and authentication flows.",
  },

  {
    selector:
      "#loopy .project-detail-list div:nth-child(3) dt",

    ko: "구조",
    en: "Structure",
  },

  {
    selector:
      "#loopy .project-detail-list div:nth-child(3) dd",

    ko:
      "고객·사장님별 UI를 분리하고 PWA 설치와 반응형 화면을 지원하도록 구성했습니다.",

    en:
      "Separated customer and owner interfaces while supporting PWA installation and responsive layouts.",
  },

  {
    selector:
      ".chat-header strong",

    ko:
      "택시 동승 채팅",

    en:
      "Shared Taxi Chat",
  },

  {
    selector:
      ".chat-header small",

    ko:
      "3명이 참여 중입니다.",

    en:
      "3 participants are online.",
  },

  {
    selector:
      ".catxi-location-card span:nth-of-type(1)",

    ko: "출발",
    en: "FROM",
  },

  {
    selector:
      ".catxi-location-card strong:nth-of-type(1)",

    ko: "숭실대학교",
    en: "Soongsil University",
  },

  {
    selector:
      ".catxi-location-card span:nth-of-type(2)",

    ko: "도착",
    en: "TO",
  },

  {
    selector:
      ".catxi-location-card strong:nth-of-type(2)",

    ko: "서울역",
    en: "Seoul Station",
  },

  {
    selector:
      ".catxi-status-badge",

    html: true,

    ko:
      "<span></span>실시간 연결 중",

    en:
      "<span></span>Connected in Real Time",
  },

  {
    selector:
      "#catxi .project-summary",

    ko:
      "대학생이 택시 동승자를 찾고 실시간으로 소통할 수 있도록 만든 모바일 중심 택시 동승자 매칭 서비스입니다.",

    en:
      "A mobile-first service that helps university students find shared taxi partners and communicate in real time.",
  },

  {
    selector:
      "#catxi .project-detail-list div:nth-child(1) dt",

    ko: "문제",
    en: "Problem",
  },

  {
    selector:
      "#catxi .project-detail-list div:nth-child(1) dd",

    ko:
      "STOMP WebSocket 연결과 인증 헤더 처리 과정에서 403 오류가 발생했습니다.",

    en:
      "A 403 error occurred during the STOMP WebSocket connection and authentication-header process.",
  },

  {
    selector:
      "#catxi .project-detail-list div:nth-child(2) dt",

    ko: "해결",
    en: "Solution",
  },

  {
    selector:
      "#catxi .project-detail-list div:nth-child(2) dd",

    ko:
      "CONNECT·SUBSCRIBE 단계의 인증 흐름과 연결 수명주기를 재정리했습니다.",

    en:
      "Reorganized the authentication flow and connection lifecycle for the CONNECT and SUBSCRIBE stages.",
  },

  {
    selector:
      "#catxi .project-detail-list div:nth-child(3) dt",

    ko: "구현",
    en: "Implementation",
  },

  {
    selector:
      "#catxi .project-detail-list div:nth-child(3) dd",

    ko:
      "채팅 UI, 메시지 상태 관리, 히스토리 조회, PWA 기반 모바일 화면을 구현했습니다.",

    en:
      "Implemented the chat UI, message state management, history retrieval, and a PWA-based mobile interface.",
  },

  {
    selector:
      ".project-card .text-link",

    html: true,

    ko:
      'GitHub에서 살펴보기 <span aria-hidden="true">↗</span>',

    en:
      'View on GitHub <span aria-hidden="true">↗</span>',
  },

  {
    selector:
      ".page-next-card h2",

    ko:
      "프로젝트 이후의 성장 과정도 확인해 보세요.",

    en:
      "Explore the growth journey behind these projects.",
  },

  {
    selector:
      ".page-next-card .button-primary",

    html: true,

    ko:
      '여정 페이지로 이동 <span aria-hidden="true">↗</span>',

    en:
      'Go to Journey <span aria-hidden="true">↗</span>',
  },
];


/* =========================================================
   journey.html 전체 번역
   ========================================================= */

const JOURNEY_TRANSLATIONS = [
  {
    selector:
      ".subpage-hero h1",

    html: true,

    ko:
      '경험을 지나치지 않고<br /><span class="text-gradient">다음 성장의 근거로</span>',

    en:
      'Turning Every Experience<br /><span class="text-gradient">into Evidence for Growth</span>',
  },

  {
    selector:
      ".subpage-hero-inner > p:last-child",

    ko:
      "프로젝트, 연구, 수상과 학업 경험을 시간의 흐름에 따라 정리했습니다.",

    en:
      "My projects, research, awards, and education are organized along a chronological journey.",
  },

  {
    selector:
      "#experience .section-heading h2",

    html: true,

    ko:
      "프로젝트와 도전을 통해<br />경험의 범위를 넓혀 왔습니다.",

    en:
      "I Expanded My Experience<br />Through Projects and Challenges.",
  },

  {
    selector:
      "#experience .section-heading > p:last-of-type",

    ko:
      "버튼을 선택하면 유형에 맞는 경험만 모아볼 수 있습니다.",

    en:
      "Select a filter to view experiences by category.",
  },

  {
    selector:
      '.timeline-filter [data-timeline-filter="all"]',

    ko: "전체",
    en: "All",
  },

  {
    selector:
      '.timeline-filter [data-timeline-filter="education"]',

    ko: "학업",
    en: "Education",
  },

  {
    selector:
      '.timeline-filter [data-timeline-filter="project"]',

    ko: "프로젝트",
    en: "Projects",
  },

  {
    selector:
      '.timeline-filter [data-timeline-filter="award"]',

    ko: "수상",
    en: "Awards",
  },

  {
    selector:
      ".timeline-filter",

    attribute: "aria-label",

    ko:
      "타임라인 유형 필터",

    en:
      "Timeline category filter",
  },

  {
    selector:
      '.timeline-item[data-timeline-category="education"] h3',

    ko:
      "컴퓨터정보공학부 학사 졸업 예정",

    en:
      "Expected B.S. in Computer Science and Information Engineering",
  },

  {
    selector:
      '.timeline-item[data-timeline-category="education"] p',

    ko:
      "가톨릭대학교 컴퓨터정보공학부에서 컴퓨터공학 전공 과정을 이수하고 있습니다.",

    en:
      "Completing the computer science curriculum in the Department of Computer Science and Information Engineering at The Catholic University of Korea.",
  },

  {
    selector:
      '.timeline-item[data-timeline-category="project"]:nth-of-type(2) h3',

    ko:
      "실시간 모바일 웹 CATXI",

    en:
      "CATXI Real-Time Mobile Web",
  },

  {
    selector:
      '.timeline-item[data-timeline-category="project"]:nth-of-type(2) p',

    ko:
      "WebSocket 기반 채팅과 모바일 사용자 흐름을 구현하고 인증 및 연결 수명주기 문제를 해결했습니다.",

    en:
      "Implemented WebSocket-based chat and mobile user flows while resolving authentication and connection-lifecycle issues.",
  },

  {
    selector:
      '.timeline-item[data-timeline-category="award"]:nth-of-type(3) h3',

    ko:
      "컴퓨터정보공학부 학술제 최우수상",

    en:
      "Grand Prize, Department Academic Festival",
  },

  {
    selector:
      '.timeline-item[data-timeline-category="award"]:nth-of-type(3) p',

    ko:
      "생성형 AI 기술을 서비스에 적용하는 방식과 사용자 활용 시나리오를 설계한 프로젝트로 학술제 최우수상을 수상했습니다.",

    en:
      "Received the grand prize for a project that designed service applications and user scenarios for generative AI technology.",
  },

  {
    selector:
      '.timeline-item[data-timeline-category="project"]:nth-of-type(4) h3',

    ko:
      "AI 생성 코드 판별 실험",

    en:
      "AI-Generated Code Detection Experiment",
  },

  {
    selector:
      '.timeline-item[data-timeline-category="project"]:nth-of-type(4) p',

    ko:
      "코드 정적 특징과 CodeBERT 임베딩을 결합하고, PCA와 SVM을 활용한 머신러닝 분류 실험을 진행했습니다.",

    en:
      "Conducted a machine-learning classification experiment combining static code features with CodeBERT embeddings using PCA and SVM.",
  },

  {
    selector:
      '.timeline-item[data-timeline-category="award"]:nth-of-type(5) h3',

    ko:
      "가톨릭대학교 해커톤 최우수상",

    en:
      "Grand Prize, CUK Hackathon",
  },

  {
    selector:
      '.timeline-item[data-timeline-category="award"]:nth-of-type(5) p',

    ko:
      "IT 대학생 대상 해커톤에서 기획의 구체성과 기술 구현의 완성도를 인정받아 최우수상을 수상했습니다.",

    en:
      "Received the grand prize at a university IT hackathon for detailed planning and technical implementation quality.",
  },

  {
    selector:
      "#principles .section-heading h2",

    html: true,

    ko:
      "경험을 쌓으며 만든<br />나만의 작업 원칙",

    en:
      "Working Principles Built<br />Through Experience",
  },

  {
    selector:
      "#principles .value-card:nth-child(1) h3",

    ko:
      "먼저 문제를 정의합니다.",

    en:
      "Define the Problem First.",
  },

  {
    selector:
      "#principles .value-card:nth-child(1) p",

    ko:
      "구현을 시작하기 전에 사용자가 겪는 불편과 기술적인 원인을 분리해서 살펴봅니다.",

    en:
      "Before implementation, I separate the user's pain points from the underlying technical causes.",
  },

  {
    selector:
      "#principles .value-card:nth-child(2) h3",

    ko:
      "선택의 이유를 남깁니다.",

    en:
      "Document the Reason for Every Choice.",
  },

  {
    selector:
      "#principles .value-card:nth-child(2) p",

    ko:
      "기술과 구조를 선택할 때 프로젝트의 조건과 대안을 함께 기록합니다.",

    en:
      "When selecting technologies and structures, I record the project conditions and alternatives considered.",
  },

  {
    selector:
      "#principles .value-card:nth-child(3) h3",

    ko:
      "팀이 다시 쓸 수 있게 만듭니다.",

    en:
      "Make Solutions Reusable by the Team.",
  },

  {
    selector:
      "#principles .value-card:nth-child(3) p",

    ko:
      "해결 경험을 문서, 공통 컴포넌트, 가이드의 형태로 확장합니다.",

    en:
      "I turn solutions into documentation, shared components, and reusable guides.",
  },

  {
    selector:
      "#principles .value-card:nth-child(4) h3",

    ko:
      "결과를 다시 점검합니다.",

    en:
      "Review the Result Again.",
  },

  {
    selector:
      "#principles .value-card:nth-child(4) p",

    ko:
      "구현 후에도 사용 흐름과 유지보수성을 기준으로 반복해서 개선합니다.",

    en:
      "After implementation, I continue improving based on user flow and maintainability.",
  },

  {
    selector:
      "#guestbook .section-heading h2",

    html: true,

    ko:
      "짧은 메시지를<br />나폴나폴 남겨주세요.",

    en:
      "Leave a Short Message<br />for Napolnapol.",
  },

  {
    selector:
      "#guestbook .section-heading > p:last-child",

    ko:
      "입력한 메시지는 브라우저의 localStorage에 저장되며 현재 기기에서만 확인할 수 있습니다.",

    en:
      "Messages are stored in your browser's localStorage and can only be viewed on this device.",
  },

  {
    selector:
      'label[for="guest-name"]',

    ko: "이름",
    en: "Name",
  },

  {
    selector:
      "#guest-name",

    attribute: "placeholder",

    ko:
      "이름 또는 닉네임",

    en:
      "Name or nickname",
  },

  {
    selector:
      'label[for="guest-message"]',

    ko: "메시지",
    en: "Message",
  },

  {
    selector:
      "#guest-message",

    attribute: "placeholder",

    ko:
      "응원이나 피드백을 남겨주세요.",

    en:
      "Leave encouragement or feedback.",
  },

  {
    selector:
      ".guestbook-form .button-primary",

    ko:
      "방명록 남기기",

    en:
      "Add Message",
  },

  {
    selector:
      ".guestbook-list-header h3",

    ko:
      "남겨진 메시지",

    en:
      "Guest Messages",
  },

  {
    selector:
      "[data-guestbook-clear]",

    ko:
      "전체 삭제",

    en:
      "Delete All",
  },

  {
    selector:
      "[data-guestbook-empty]",

    ko:
      "아직 남겨진 메시지가 없습니다.",

    en:
      "No messages have been added yet.",
  },

  {
    selector:
      ".page-next-card h2",

    ko:
      "포트폴리오의 첫 화면으로 돌아가시겠어요?",

    en:
      "Would you like to return to the portfolio home page?",
  },

  {
    selector:
      ".page-next-card .button-primary",

    html: true,

    ko:
      '홈으로 이동 <span aria-hidden="true">↗</span>',

    en:
      'Go Home <span aria-hidden="true">↗</span>',
  },
];


/* =========================================================
   번역 적용
   ========================================================= */

function applyTranslationRule(
  rule,
  language
) {
  const elements =
    document.querySelectorAll(
      rule.selector
    );

  const value =
    rule[language];

  elements.forEach((element) => {
    if (rule.attribute) {
      element.setAttribute(
        rule.attribute,
        value
      );

      return;
    }

    if (rule.html) {
      element.innerHTML = value;

      return;
    }

    element.textContent = value;
  });
}

function updatePageMeta(
  page,
  language
) {
  const meta =
    PAGE_META[page]?.[language];

  if (!meta) return;

  document.title =
    meta.title;

  const description =
    document.querySelector(
      'meta[name="description"]'
    );

  const ogTitle =
    document.querySelector(
      'meta[property="og:title"]'
    );

  const ogDescription =
    document.querySelector(
      'meta[property="og:description"]'
    );

  if (description) {
    description.setAttribute(
      "content",
      meta.description
    );
  }

  if (ogTitle) {
    ogTitle.setAttribute(
      "content",
      meta.title
    );
  }

  if (ogDescription) {
    ogDescription.setAttribute(
      "content",
      meta.description
    );
  }
}

function updateLanguageButton(
  language
) {
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
      ? UI_TEXT.en.languageToKorean
      : UI_TEXT.ko.languageToEnglish
  );
}

function getPreferredLanguage() {
  return getStoredValue(
    STORAGE_KEYS.language
  ) === "en"
    ? "en"
    : "ko";
}

function applyLanguage(
  language,
  save = true
) {
  const nextLanguage =
    language === "en"
      ? "en"
      : "ko";

  const currentPage =
    document.body.dataset.page ||
    "home";

  document.documentElement.lang =
    nextLanguage;

  COMMON_TRANSLATIONS.forEach(
    (rule) => {
      applyTranslationRule(
        rule,
        nextLanguage
      );
    }
  );

  if (currentPage === "home") {
    HOME_TRANSLATIONS.forEach(
      (rule) => {
        applyTranslationRule(
          rule,
          nextLanguage
        );
      }
    );
  }

  if (currentPage === "projects") {
    PROJECT_TRANSLATIONS.forEach(
      (rule) => {
        applyTranslationRule(
          rule,
          nextLanguage
        );
      }
    );
  }

  if (currentPage === "journey") {
    JOURNEY_TRANSLATIONS.forEach(
      (rule) => {
        applyTranslationRule(
          rule,
          nextLanguage
        );
      }
    );
  }

  updatePageMeta(
    currentPage,
    nextLanguage
  );

  updateLanguageButton(
    nextLanguage
  );

  updateMenuButtonLabel(
    navigation?.classList.contains(
      "open"
    ) ?? false
  );

  updateThemeButton(
    document.documentElement
      .dataset.theme ||
      "light"
  );

  const refreshedYear =
    document.querySelector(
      "#current-year"
    );

  if (refreshedYear) {
    refreshedYear.textContent =
      String(
        new Date().getFullYear()
      );
  }

  if (save) {
    setStoredValue(
      STORAGE_KEYS.language,
      nextLanguage
    );
  }

  document.dispatchEvent(
    new CustomEvent(
      "napolnapol:languagechange",
      {
        detail: {
          language: nextLanguage,
        },
      }
    )
  );
}

applyLanguage(
  getPreferredLanguage(),
  false
);

if (languageToggle) {
  languageToggle.addEventListener(
    "click",
    () => {
      const nextLanguage =
        getCurrentLanguage() === "en"
          ? "ko"
          : "en";

      applyLanguage(nextLanguage);

      showToast(
        nextLanguage === "en"
          ? UI_TEXT.en.changedToEnglish
          : UI_TEXT.ko.changedToKorean
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
    document.createElement(
      "textarea"
    );

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
    throw new Error(
      "Copy failed"
    );
  }
}

if (copyEmailButton) {
  copyEmailButton.addEventListener(
    "click",
    async () => {
      const email =
        copyEmailButton.dataset.email;

      const copyTextElement =
        copyEmailButton.querySelector(
          "strong"
        );

      if (!email) {
        showToast(
          uiText("emailMissing")
        );

        return;
      }

      try {
        await copyToClipboard(email);

        if (copyTextElement) {
          copyTextElement.textContent =
            uiText("copied");
        }

        showToast(
          uiText("emailCopied")
        );

        window.setTimeout(() => {
          if (copyTextElement) {
            copyTextElement.textContent =
              uiText("copy");
          }
        }, 1800);
      } catch (error) {
        showToast(
          uiText(
            "emailCopyFailed"
          )
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
        Boolean(
          interactiveElement
        )
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
    !(
      canvas instanceof
      HTMLCanvasElement
    )
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

  function parseHexColor(
    hexColor
  ) {
    const hex = hexColor
      .replace("#", "")
      .trim();

    if (hex.length !== 6) {
      return particleColor;
    }

    return {
      red:
        Number.parseInt(
          hex.slice(0, 2),
          16
        ),

      green:
        Number.parseInt(
          hex.slice(2, 4),
          16
        ),

      blue:
        Number.parseInt(
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
        .getPropertyValue(
          "--primary"
        )
        .trim();

    if (
      primaryColor.startsWith("#")
    ) {
      particleColor =
        parseHexColor(
          primaryColor
        );
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
        Math.random() * 2 +
        0.6,

      velocityX:
        (
          Math.random() -
          0.5
        ) * 0.25,

      velocityY:
        (
          Math.random() -
          0.5
        ) * 0.25,

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
        (
          canvasWidth *
          canvasHeight
        ) /
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
        window.devicePixelRatio ||
          1,
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

  function moveParticle(
    particle
  ) {
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

  function drawParticle(
    particle
  ) {
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
          (
            1 -
            distance /
              maximumDistance
          ) *
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

    particles.forEach(
      (particle) => {
        moveParticle(particle);
        drawParticle(particle);
      }
    );

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
    timelineItems.forEach(
      (item) => {
        const shouldShow =
          category === "all" ||
          category ===
            item.dataset
              .timelineCategory;

        item.classList.toggle(
          "is-filtered-out",
          !shouldShow
        );
      }
    );

    filterButtons.forEach(
      (button) => {
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
      }
    );
  }

  filterButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          applyFilter(
            button.dataset
              .timelineFilter ||
              "all"
          );
        }
      );
    }
  );

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
    return window.crypto
      .randomUUID();
  }

  return (
    `${Date.now()}-` +
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
    guestbookForm
      .elements
      .namedItem("name");

  const messageInput =
    guestbookForm
      .elements
      .namedItem("message");

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

  function formatDate(
    dateString
  ) {
    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    const locale =
      getCurrentLanguage() === "en"
        ? "en-US"
        : "ko-KR";

    return new Intl.DateTimeFormat(
      locale,
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
      uiText(
        "guestbookDeleted"
      )
    );
  }

  function createEntryElement(
    entry
  ) {
    const item =
      document.createElement("li");

    const headerElement =
      document.createElement(
        "div"
      );

    const nameElement =
      document.createElement(
        "strong"
      );

    const timeElement =
      document.createElement(
        "time"
      );

    const messageElement =
      document.createElement("p");

    const deleteButton =
      document.createElement(
        "button"
      );

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
      uiText(
        "guestbookDelete"
      );

    deleteButton.setAttribute(
      "aria-label",
      uiText(
        "guestbookDeleteAria",
        entry.name
      )
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
        guestbookEntries.length >
        0;
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
        guestbookEntries.length ===
        0;
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
          uiText(
            "guestbookRequired"
          )
        );

        return;
      }

      guestbookEntries.unshift({
        id:
          createGuestbookId(),

        name:
          name.slice(0, 20),

        message:
          message.slice(0, 120),

        createdAt:
          new Date()
            .toISOString(),
      });

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
          ? uiText(
              "guestbookAdded"
            )
          : uiText(
              "guestbookSaveFailed"
            )
      );
    }
  );

  if (clearButton) {
    clearButton.addEventListener(
      "click",
      () => {
        if (
          guestbookEntries.length ===
          0
        ) {
          return;
        }

        const shouldClear =
          window.confirm(
            uiText(
              "guestbookClearConfirm"
            )
          );

        if (!shouldClear) return;

        guestbookEntries = [];

        removeStoredValue(
          STORAGE_KEYS.guestbook
        );

        renderEntries();

        showToast(
          uiText(
            "guestbookCleared"
          )
        );
      }
    );
  }

  document.addEventListener(
    "napolnapol:languagechange",
    renderEntries
  );

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
    easterEggPanel.hidden =
      false;

    easterEggButton.setAttribute(
      "aria-expanded",
      "true"
    );

    setStoredValue(
      STORAGE_KEYS.easterEgg,
      "true"
    );

    showToast(
      uiText(
        "easterEggFound"
      )
    );
  }

  function closePanel() {
    easterEggPanel.hidden =
      true;

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
      if (
        easterEggPanel.hidden
      ) {
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
  .querySelectorAll(
    'a[href="#"]'
  )
  .forEach((link) => {
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();

        showToast(
          uiText("emptyLink")
        );
      }
    );
  });