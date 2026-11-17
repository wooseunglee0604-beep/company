/**
 * 하이글로벌컴퍼니 (웹디자인개발기능사 실기 F-4형)
 * 순수 Vanilla JavaScript (Zero React / Vanilla DOM Manipulation)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ========================================================
     1. GNB 내비게이션 & 전체 너비 서브메뉴 드롭다운
  ======================================================== */
  const header = document.getElementById('header');
  const gnbItems = document.querySelectorAll('.gnb-menu > li');
  const submenuBg = document.querySelector('.submenu-full-bg');

  let submenuTimer = null;

  function showSubmenu() {
    if (submenuTimer) clearTimeout(submenuTimer);
    submenuBg.classList.add('show');
  }

  function hideSubmenu() {
    submenuTimer = setTimeout(() => {
      submenuBg.classList.remove('show');
      gnbItems.forEach((li) => li.classList.remove('active'));
    }, 150);
  }

  gnbItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      showSubmenu();
      gnbItems.forEach((li) => li.classList.remove('active'));
      item.classList.add('active');
    });

    item.addEventListener('focusin', () => {
      showSubmenu();
      gnbItems.forEach((li) => li.classList.remove('active'));
      item.classList.add('active');
    });
  });

  if (submenuBg) {
    submenuBg.addEventListener('mouseenter', () => {
      showSubmenu();
    });

    submenuBg.addEventListener('mouseleave', () => {
      hideSubmenu();
    });
  }

  if (header) {
    header.addEventListener('mouseleave', () => {
      hideSubmenu();
    });

    header.addEventListener('focusout', (e) => {
      if (!header.contains(e.relatedTarget)) {
        hideSubmenu();
      }
    });
  }

  /* ========================================================
     2. 메인 비주얼 슬라이드 (아래에서 위로 세로 이동, 3초 주기)
  ======================================================== */
  const slideTrack = document.querySelector('.slide-track');
  const slideItems = document.querySelectorAll('.slide-item');
  const dots = document.querySelectorAll('.slide-indicator-dot');
  const totalSlides = slideItems.length;
  let currentIndex = 0;
  let slideInterval = null;

  function getSlideHeight() {
    const slideSection = document.getElementById('slide-section');
    return slideSection ? slideSection.offsetHeight : 350;
  }

  function goToSlide(index) {
    currentIndex = index;
    if (currentIndex >= totalSlides) currentIndex = 0;
    if (currentIndex < 0) currentIndex = totalSlides - 1;

    const height = getSlideHeight();
    const offset = currentIndex * height;

    if (slideTrack) {
      slideTrack.style.transform = `translateY(-${offset}px)`;
    }

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 3000);
  }

  function stopSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (totalSlides > 0) {
    startSlideShow();

    const slideSection = document.getElementById('slide-section');
    if (slideSection) {
      slideSection.addEventListener('mouseenter', stopSlideShow);
      slideSection.addEventListener('mouseleave', startSlideShow);
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
        goToSlide(targetIndex);
      });
    });

    // Window resize compensation
    window.addEventListener('resize', () => {
      goToSlide(currentIndex);
    });
  }

  /* ========================================================
     3. 공지사항 첫 번째 콘텐츠 클릭 시 모달 레이어 팝업 오픈
  ======================================================== */
  const noticeFirstRow = document.querySelector('.notice-first-row');
  const modalLayer = document.getElementById('modalPopup');
  const modalCloseBtns = document.querySelectorAll('.js-modal-close');

  function openModal(e) {
    if (e) e.preventDefault();
    if (modalLayer) {
      modalLayer.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Focus close button for accessibility
      const closeBtn = modalLayer.querySelector('.modal-btn-close');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeModal() {
    if (modalLayer) {
      modalLayer.classList.remove('active');
      document.body.style.overflow = '';
      if (noticeFirstRow) noticeFirstRow.focus();
    }
  }

  if (noticeFirstRow) {
    noticeFirstRow.addEventListener('click', openModal);
    noticeFirstRow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  }

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  // Close modal on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalLayer && modalLayer.classList.contains('active')) {
      closeModal();
    }
  });

  /* ========================================================
     4. 모바일 네비게이션 드로어 (< 1024px)
  ======================================================== */
  const mobileToggleBtn = document.querySelector('.btn-mobile-toggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtns = document.querySelectorAll('.js-drawer-close');

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openDrawer);
  }

  drawerCloseBtns.forEach((btn) => {
    btn.addEventListener('click', closeDrawer);
  });

  /* ========================================================
     5. 패밀리 사이트 드롭다운 바로가기
  ======================================================== */
  const familySelect = document.getElementById('familySiteSelect');
  if (familySelect) {
    familySelect.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      if (selectedValue && selectedValue !== '#') {
        // Open selected family site
        window.open(selectedValue, '_blank', 'noopener,noreferrer');
        // Reset select to default
        e.target.selectedIndex = 0;
      }
    });
  }

  /* ========================================================
     6. 모든 임시 링크(#) 부드러운 스크롤 또는 기본동작 방지
  ======================================================== */
  const dummyLinks = document.querySelectorAll('a[href="#"]');
  dummyLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!link.classList.contains('notice-first-row')) {
        e.preventDefault();
      }
    });
  });
});
