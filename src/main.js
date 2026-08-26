class SlidePresentation {
  constructor() {
    this.slides = [...document.querySelectorAll('.slide')];
    this.currentSlide = 0;
    this.currentBuild = 0;
    this.stage = document.getElementById('deckStage');
    this.counter = document.getElementById('slideCounter');
    this.progress = document.getElementById('progressBar');
    this.overview = document.getElementById('overview');
    this.overviewGrid = document.getElementById('overviewGrid');
    this.buildIndicator = document.getElementById('buildIndicator');
    this.wheelLocked = false;
    this.touchStartX = 0;
    this.touchStartY = 0;

    this.setupStageScale();
    this.setupControls();
    this.setupKeyboard();
    this.setupWheel();
    this.setupTouch();
    this.buildOverview();
    this.showSlide(this.hashIndex(), false);
  }

  setupStageScale() {
    const scale = () => {
      const factor = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      const x = (window.innerWidth - 1920 * factor) / 2;
      const y = (window.innerHeight - 1080 * factor) / 2;
      this.stage.style.transform = `translate(${x}px, ${y}px) scale(${factor})`;
    };
    scale();
    window.addEventListener('resize', scale);
  }

  setupControls() {
    document.getElementById('prevButton').addEventListener('click', () => this.previous());
    document.getElementById('nextButton').addEventListener('click', () => this.next());
    document.getElementById('overviewButton').addEventListener('click', () => this.toggleOverview());
    document.getElementById('fullscreenButton').addEventListener('click', () => this.toggleFullscreen());
  }

  setupKeyboard() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.overview.classList.contains('open')) {
        event.preventDefault(); this.toggleOverview(false); return;
      }
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(event.key)) {
        event.preventDefault(); this.next();
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault(); this.previous();
      } else if (event.key === 'Home') {
        event.preventDefault(); this.showSlide(0);
      } else if (event.key === 'End') {
        event.preventDefault(); this.showSlide(this.slides.length - 1);
      } else if (event.key.toLowerCase() === 'o') {
        event.preventDefault(); this.toggleOverview();
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault(); this.toggleFullscreen();
      }
    });
  }

  setupWheel() {
    document.addEventListener('wheel', (event) => {
      if (this.overview.classList.contains('open') || this.wheelLocked || Math.abs(event.deltaY) < 25) return;
      this.wheelLocked = true;
      event.deltaY > 0 ? this.next() : this.previous();
      window.setTimeout(() => { this.wheelLocked = false; }, 650);
    }, { passive: true });
  }

  setupTouch() {
    document.addEventListener('touchstart', (event) => {
      this.touchStartX = event.changedTouches[0].screenX;
      this.touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });
    document.addEventListener('touchend', (event) => {
      const dx = event.changedTouches[0].screenX - this.touchStartX;
      const dy = event.changedTouches[0].screenY - this.touchStartY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return;
      (Math.abs(dx) > Math.abs(dy) ? dx < 0 : dy < 0) ? this.next() : this.previous();
    }, { passive: true });
  }

  buildOverview() {
    this.slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.innerHTML = `<b>${String(index + 1).padStart(2, '0')}</b><span>${slide.dataset.title}</span>`;
      button.addEventListener('click', () => { this.showSlide(index); this.toggleOverview(false); });
      this.overviewGrid.appendChild(button);
    });
  }

  hashIndex() {
    const value = Number.parseInt(location.hash.replace('#', ''), 10);
    return Number.isFinite(value) ? Math.min(Math.max(value - 1, 0), this.slides.length - 1) : 0;
  }

  maxBuild() {
    return Number(this.slides[this.currentSlide].querySelector('.build-root')?.dataset.builds || 1) - 1;
  }

  applyBuild() {
    const slide = this.slides[this.currentSlide];
    slide.querySelectorAll('[data-build]').forEach((node) => {
      node.classList.toggle('shown', Number(node.dataset.build) <= this.currentBuild);
    });
    const max = this.maxBuild();
    this.buildIndicator.innerHTML = max > 0
      ? Array.from({ length: max + 1 }, (_, i) => `<i class="${i <= this.currentBuild ? 'on' : ''}"></i>`).join('')
      : '';
  }

  showSlide(index, updateHash = true) {
    this.currentSlide = Math.min(Math.max(index, 0), this.slides.length - 1);
    this.currentBuild = 0;
    this.slides.forEach((slide, i) => {
      const active = i === this.currentSlide;
      slide.classList.toggle('active', active);
      slide.classList.toggle('visible', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    this.applyBuild();
    const number = String(this.currentSlide + 1).padStart(2, '0');
    this.counter.textContent = `${number} / ${String(this.slides.length).padStart(2, '0')}`;
    this.progress.style.width = `${((this.currentSlide + 1) / this.slides.length) * 100}%`;
    if (updateHash) history.replaceState(null, '', `#${this.currentSlide + 1}`);
  }

  next() {
    if (this.overview.classList.contains('open')) return;
    if (this.currentBuild < this.maxBuild()) { this.currentBuild += 1; this.applyBuild(); return; }
    if (this.currentSlide < this.slides.length - 1) this.showSlide(this.currentSlide + 1);
  }

  previous() {
    if (this.overview.classList.contains('open')) return;
    if (this.currentBuild > 0) { this.currentBuild -= 1; this.applyBuild(); return; }
    if (this.currentSlide > 0) {
      this.showSlide(this.currentSlide - 1);
      this.currentBuild = this.maxBuild();
      this.applyBuild();
    }
  }

  toggleOverview(force) {
    const open = typeof force === 'boolean' ? force : !this.overview.classList.contains('open');
    this.overview.classList.toggle('open', open);
    this.overview.setAttribute('aria-hidden', String(!open));
    this.overviewGrid.children[this.currentSlide]?.classList.toggle('current', open);
  }

  async toggleFullscreen() {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  }
}

new SlidePresentation();
