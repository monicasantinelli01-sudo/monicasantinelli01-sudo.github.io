const mapSection = document.querySelector('.map-section');

    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mapSection.classList.add('visible');
        } else {
          mapSection.classList.remove('visible');
        }
      });
    }, { threshold: 0.35 });

    mapObserver.observe(mapSection);

    const trendsSection = document.getElementById('district-trends');
    const singleFigureShell = document.getElementById('singleFigureShell');
    const singleFigureShell2 = document.getElementById('singleFigureShell2');
    const singleFigureImage = document.getElementById('singleFigureImage');
    const districtCopies = document.querySelectorAll('.district-copy');

    const closingScrollSection = document.getElementById('closing-scroll');
    const closingStages = document.querySelectorAll('.closing-stage');

    const detailImages = [
      "images/Southern_prostitution_trends.png",
      "images/Tenderloin_prostitution_trends.png",
      "images/Central_prostitution_trends.png",
      "images/Northern_prostitution_trends.png",
      "images/Mission_prostitution_trends.png"
    ];

    let currentDistrictStage = null;
    let imageSwapTimeout = null;
    let ticking = false;

    function showCopy(indexOrIntro) {
      districtCopies.forEach((copy) => {
        copy.classList.remove('active');
      });

      if (indexOrIntro === 'intro') {
        const intro = document.querySelector('.district-copy[data-copy="intro"]');
        if (intro) intro.classList.add('active');
        return;
      }

      const target = document.querySelector(`.district-copy[data-copy="${indexOrIntro}"]`);
      if (target) target.classList.add('active');
    }

    function switchDistrictState(nextStage) {
      if (nextStage === currentDistrictStage) return;
      currentDistrictStage = nextStage;

      if (nextStage === -1) {
        showCopy('intro');
        singleFigureShell2.style.opacity = '0';
        return;
      }

      showCopy(nextStage);
      singleFigureShell2.style.opacity = '1';

      if (imageSwapTimeout) clearTimeout(imageSwapTimeout);

      singleFigureImage.classList.add('is-fading');

      imageSwapTimeout = setTimeout(() => {
        singleFigureImage.src = detailImages[nextStage];
        singleFigureImage.alt = "District plot";
        singleFigureImage.classList.remove('is-fading');
      }, 180);
    }

    function updateScrollScene() {
      const sectionRect = trendsSection.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrollable = trendsSection.offsetHeight - viewportH;

      let progress = 0;
      if (scrollable > 0) {
        progress = Math.min(Math.max(-sectionRect.top / scrollable, 0), 1);
      }

      const introEnd = 0.16;
      let desiredStage = -1;

      if (progress >= introEnd) {
        const adjusted = (progress - introEnd) / (1 - introEnd);
        desiredStage = Math.min(4, Math.floor(adjusted * 5));
      }

      switchDistrictState(desiredStage);
    }

    let currentClosingStage = -1;
    let closingStageLocked = false;
    let pendingClosingStage = null;
    const CLOSING_STAGE_TRANSITION_MS = 1000;

    const closingStageOrder = ['question', 'p1'];

    function showClosingStageByIndex(index) {
      closingStages.forEach(stage => stage.classList.remove('active'));

      if (index < 0) return;

      const stageName = closingStageOrder[index];
      const target = document.querySelector(`.closing-stage[data-stage="${stageName}"]`);
      if (target) target.classList.add('active');
    }

    function goToClosingStage(targetStage) {
      if (targetStage === currentClosingStage) return;

      if (closingStageLocked) {
        pendingClosingStage = targetStage;
        return;
      }

      closingStageLocked = true;

      if (targetStage > currentClosingStage) {
        currentClosingStage += 1;
      } else {
        currentClosingStage -= 1;
      }

      showClosingStageByIndex(currentClosingStage);

      setTimeout(() => {
        closingStageLocked = false;

        if (pendingClosingStage !== null && pendingClosingStage !== currentClosingStage) {
          const next = pendingClosingStage;
          pendingClosingStage = null;
          goToClosingStage(next);
        } else {
          pendingClosingStage = null;
        }
      }, CLOSING_STAGE_TRANSITION_MS);
    }

    function updateClosingScene() {
      const sectionRect = closingScrollSection.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrollable = closingScrollSection.offsetHeight - viewportH;

      let progress = 0;
      if (scrollable > 0) {
        progress = Math.min(Math.max(-sectionRect.top / scrollable, 0), 1);
      }

      let desiredStage = -1;

      if (progress >= 0.04 && progress < 0.34) {
        desiredStage = 0;
      } else if (progress >= 0.34) {
        desiredStage = 1;
      }

      goToClosingStage(desiredStage);
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateScrollScene();
          updateClosingScene();
          ticking = false;
        });
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    window.addEventListener('load', requestTick);

    const trendsEntranceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          singleFigureShell.classList.add('revealed');
          singleFigureShell2.classList.add('revealed');
        } else {
          singleFigureShell.classList.remove('revealed');
          singleFigureShell2.classList.remove('revealed');
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "0px 0px -8% 0px"
    });

    trendsEntranceObserver.observe(trendsSection);

    const fadePair = document.querySelector('.fade-pair');
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.22
    });

    if (fadePair) {
      fadeObserver.observe(fadePair);
    }