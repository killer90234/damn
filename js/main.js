/**
 * Sinusync Portfolio - Main JavaScript
 * Handles animations, interactions, and media controls
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    audioEnabled: localStorage.getItem('sinusync-audio-enabled') === 'true'
  };

  // State management
  const state = {
    swiper: null,
    audioEnabled: CONFIG.audioEnabled,
    activeVideos: new Set(),
    initialized: false
  };

  /**
   * Initialize the application
   */
  function init() {
    if (state.initialized) return;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize components based on page
    const page = getCurrentPage();
    
    switch(page) {
      case 'home':
        initHomePage();
        break;
      case 'links':
        initLinksPage();
        break;
      case 'portfolio':
        initPortfolioPage();
        break;
    }

    // Common initialization
    initKeyboardNavigation();
    initAccessibility();
    
    state.initialized = true;
  }

  /**
   * Get current page identifier
   */
  function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('links')) return 'links';
    if (path.includes('portfolio')) return 'portfolio';
    return 'home';
  }

  /**
   * Initialize home page features
   */
  function initHomePage() {
    initHeroAnimations();
    initParallaxEffect();
    initCardInteractions();
  }

  /**
   * Initialize hero animations with GSAP
   */
  function initHeroAnimations() {
    if (CONFIG.reducedMotion || typeof gsap === 'undefined') return;

    const tl = gsap.timeline();
    
    // Animate hero elements
    tl.from('.hero-title', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.5
    })
    .from('.hero-subtitle', {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    }, '-=0.5')
    .from('.logo-item', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      stagger: 0.2,
      ease: 'power2.out'
    }, '-=0.3');

    // Blueprint image subtle animation
    gsap.to('.blueprint-image', {
      duration: 20,
      rotation: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  /**
   * Initialize parallax effect for hero background
   */
  function initParallaxEffect() {
    if (CONFIG.reducedMotion) return;

    const blueprint = document.querySelector('.blueprint-image');
    if (!blueprint) return;

    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const heroHeight = window.innerHeight;
      const transform = scrolled * 0.5;
      
      if (scrolled < heroHeight) {
        blueprint.style.transform = `scale(1.1) translateY(${transform}px)`;
      }
      
      ticking = false;
    }

    function requestParallaxUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    // Mouse parallax effect
    document.addEventListener('mousemove', (e) => {
      if (CONFIG.reducedMotion) return;
      
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const moveX = (clientX - centerX) * 0.01;
      const moveY = (clientY - centerY) * 0.01;
      
      if (blueprint && window.pageYOffset < window.innerHeight) {
        blueprint.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
      }
    });

    // Scroll parallax effect
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  }

  /**
   * Initialize card hover interactions
   */
  function initCardInteractions() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (CONFIG.reducedMotion) return;
        
        const img = card.querySelector('.card-image img');
        if (img && typeof gsap !== 'undefined') {
          gsap.to(img, { duration: 0.3, scale: 1.05 });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (CONFIG.reducedMotion) return;
        
        const img = card.querySelector('.card-image img');
        if (img && typeof gsap !== 'undefined') {
          gsap.to(img, { duration: 0.3, scale: 1 });
        }
      });
    });
  }

  /**
   * Initialize links page functionality
   */
  function initLinksPage() {
    initCopyFunctionality();
    initLongPressDetection();
  }

  /**
   * Initialize copy-to-clipboard functionality
   */
  function initCopyFunctionality() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = button.dataset.url;
        
        try {
          await navigator.clipboard.writeText(url);
          showCopyFeedback(button);
        } catch (err) {
          // Fallback for older browsers
          fallbackCopy(url, button);
        }
      });
    });
  }

  /**
   * Show visual feedback for copy action
   */
  function showCopyFeedback(button) {
    const originalHtml = button.innerHTML;
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" stroke-width="2" fill="none"/>
      </svg>
    `;
    button.style.background = 'rgba(0, 255, 0, 0.2)';
    
    setTimeout(() => {
      button.innerHTML = originalHtml;
      button.style.background = '';
    }, 2000);
  }

  /**
   * Fallback copy method for older browsers
   */
  function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      showCopyFeedback(button);
    } catch (err) {
      console.warn('Copy fallback failed:', err);
    }
    
    document.body.removeChild(textArea);
  }

  /**
   * Initialize long-press detection for touch devices
   */
  function initLongPressDetection() {
    const socialLinks = document.querySelectorAll('.social-url');
    
    socialLinks.forEach(link => {
      let pressTimer;
      
      function startPressTimer() {
        pressTimer = setTimeout(() => {
          // Trigger copy on long press
          const url = link.href;
          navigator.clipboard?.writeText(url).then(() => {
            const feedback = document.createElement('div');
            feedback.textContent = 'Link copied!';
            feedback.style.cssText = `
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 1rem;
              border-radius: 0.5rem;
              z-index: 1000;
              animation: fadeInOut 2s ease-out forwards;
            `;
            
            document.body.appendChild(feedback);
            setTimeout(() => feedback.remove(), 2000);
          });
        }, 800);
      }
      
      function cancelPressTimer() {
        clearTimeout(pressTimer);
      }
      
      // Touch events
      link.addEventListener('touchstart', startPressTimer);
      link.addEventListener('touchend', cancelPressTimer);
      link.addEventListener('touchmove', cancelPressTimer);
      
      // Mouse events (for testing)
      link.addEventListener('mousedown', startPressTimer);
      link.addEventListener('mouseup', cancelPressTimer);
      link.addEventListener('mouseleave', cancelPressTimer);
    });
  }

  /**
   * Initialize portfolio page with Swiper
   */
  function initPortfolioPage() {
    // Wait for Swiper to load
    if (typeof Swiper === 'undefined') {
      setTimeout(initPortfolioPage, 100);
      return;
    }
    
    initSwiper();
    initAudioToggle();
    initVideoControls();
  }

  /**
   * Initialize Swiper slider
   */
  function initSwiper() {
    const swiperEl = document.querySelector('.portfolio-slider');
    if (!swiperEl) return;

    state.swiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 30,
      centeredSlides: true,
      loop: true,
      
      // Navigation
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      
      // Pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: (index, className) => {
          return `<span class="${className}" role="tab" aria-label="Go to slide ${index + 1}"></span>`;
        }
      },
      
      // Keyboard control
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      
      // Accessibility
      a11y: {
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        paginationBulletMessage: 'Go to slide {{index}}',
      },
      
      // Auto height
      autoHeight: false,
      
      // Events
      on: {
        slideChange: handleSlideChange,
        init: handleSwiperInit
      }
    });
  }

  /**
   * Handle Swiper initialization
   */
  function handleSwiperInit() {
    // Load first slide's video if needed
    setTimeout(() => {
      const activeSlide = document.querySelector('.swiper-slide-active');
      if (activeSlide) {
        loadSlideVideo(activeSlide);
      }
    }, 100);
  }

  /**
   * Handle slide change events
   */
  function handleSlideChange() {
    // Pause all videos
    state.activeVideos.forEach(video => {
      video.pause();
    });
    state.activeVideos.clear();
    
    // Load and potentially play new slide's video
    setTimeout(() => {
      const activeSlide = document.querySelector('.swiper-slide-active');
      if (activeSlide) {
        loadSlideVideo(activeSlide);
      }
    }, 100);
  }

  /**
   * Load video for a slide with lazy loading
   */
  function loadSlideVideo(slide) {
    const video = slide.querySelector('.slide-video');
    if (!video) return;
    
    const sources = video.querySelectorAll('source[data-src]');
    
    // Load video sources if not already loaded
    if (sources.length > 0) {
      sources.forEach(source => {
        if (source.dataset.src) {
          source.src = source.dataset.src;
          source.removeAttribute('data-src');
        }
      });
      
      video.load();
    }
    
    // Set up video for autoplay
    video.muted = !state.audioEnabled;
    
    // Attempt autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          state.activeVideos.add(video);
        })
        .catch(error => {
          // Autoplay failed - this is normal for audio-enabled videos
          if (state.audioEnabled) {
            showAudioPlayPrompt(video);
          }
        });
    }
  }

  /**
   * Show prompt to play audio when autoplay fails
   */
  function showAudioPlayPrompt(video) {
    const container = video.closest('.video-container');
    if (!container || container.querySelector('.audio-prompt')) return;
    
    const prompt = document.createElement('div');
    prompt.className = 'audio-prompt';
    prompt.innerHTML = `
      <button class="audio-play-button" aria-label="Play video with sound">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span>Play with Sound</span>
      </button>
    `;
    
    prompt.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      padding: 1rem;
      border-radius: 0.5rem;
      z-index: 10;
    `;
    
    container.appendChild(prompt);
    
    const playButton = prompt.querySelector('.audio-play-button');
    playButton.addEventListener('click', () => {
      video.muted = false;
      video.play().then(() => {
        state.activeVideos.add(video);
        prompt.remove();
      });
    });
    
    // Remove prompt after 5 seconds
    setTimeout(() => {
      if (prompt.parentNode) {
        prompt.remove();
      }
    }, 5000);
  }

  /**
   * Initialize audio toggle functionality
   */
  function initAudioToggle() {
    const audioToggle = document.getElementById('audio-toggle');
    if (!audioToggle) return;
    
    // Set initial state
    updateAudioToggleUI(audioToggle);
    
    audioToggle.addEventListener('click', () => {
      state.audioEnabled = !state.audioEnabled;
      localStorage.setItem('sinusync-audio-enabled', state.audioEnabled);
      updateAudioToggleUI(audioToggle);
      
      // Update all active videos
      state.activeVideos.forEach(video => {
        video.muted = !state.audioEnabled;
      });
    });
  }

  /**
   * Update audio toggle button UI
   */
  function updateAudioToggleUI(button) {
    const icon = button.querySelector('.audio-icon');
    const text = button.querySelector('.audio-text');
    
    button.setAttribute('aria-pressed', state.audioEnabled);
    
    if (state.audioEnabled) {
      icon.textContent = '🔊';
      text.textContent = 'Disable Audio';
    } else {
      icon.textContent = '🔇';
      text.textContent = 'Enable Audio';
    }
  }

  /**
   * Initialize video controls
   */
  function initVideoControls() {
    const videos = document.querySelectorAll('.slide-video');
    
    videos.forEach(video => {
      const container = video.closest('.video-container');
      if (!container) return;
      
      const playPauseBtn = container.querySelector('.video-play-pause');
      const muteBtn = container.querySelector('.video-mute');
      
      if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => toggleVideoPlayback(video));
      }
      
      if (muteBtn) {
        muteBtn.addEventListener('click', () => toggleVideoMute(video));
      }
      
      // Update UI when video state changes
      video.addEventListener('play', () => updateVideoControlsUI(video));
      video.addEventListener('pause', () => updateVideoControlsUI(video));
      video.addEventListener('volumechange', () => updateVideoControlsUI(video));
    });
  }

  /**
   * Toggle video playback
   */
  function toggleVideoPlayback(video) {
    if (video.paused) {
      video.play().then(() => {
        state.activeVideos.add(video);
      });
    } else {
      video.pause();
      state.activeVideos.delete(video);
    }
  }

  /**
   * Toggle video mute
   */
  function toggleVideoMute(video) {
    video.muted = !video.muted;
  }

  /**
   * Update video controls UI
   */
  function updateVideoControlsUI(video) {
    const container = video.closest('.video-container');
    if (!container) return;
    
    const playIcon = container.querySelector('.play-icon');
    const pauseIcon = container.querySelector('.pause-icon');
    const muteIcon = container.querySelector('.mute-icon');
    const unmuteIcon = container.querySelector('.unmute-icon');
    
    // Update play/pause icons
    if (playIcon && pauseIcon) {
      if (video.paused) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      } else {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      }
    }
    
    // Update mute/unmute icons
    if (muteIcon && unmuteIcon) {
      if (video.muted) {
        muteIcon.style.display = 'block';
        unmuteIcon.style.display = 'none';
      } else {
        muteIcon.style.display = 'none';
        unmuteIcon.style.display = 'block';
      }
    }
  }

  /**
   * Initialize keyboard navigation enhancements
   */
  function initKeyboardNavigation() {
    // Enhanced focus management
    document.addEventListener('keydown', (e) => {
      // Portfolio slider keyboard shortcuts
      if (state.swiper && document.querySelector('.portfolio-slider')) {
        if (e.key === 'ArrowLeft' && !e.target.matches('input, textarea')) {
          e.preventDefault();
          state.swiper.slidePrev();
        }
        if (e.key === 'ArrowRight' && !e.target.matches('input, textarea')) {
          e.preventDefault();
          state.swiper.slideNext();
        }
      }
      
      // Space bar for video control
      if (e.key === ' ' && e.target.closest('.video-container')) {
        e.preventDefault();
        const video = e.target.closest('.video-container').querySelector('video');
        if (video) toggleVideoPlayback(video);
      }
    });
  }

  /**
   * Initialize accessibility features
   */
  function initAccessibility() {
    // Add dynamic ARIA labels
    updateAriaLabels();
    
    // Handle reduced motion preferences
    if (CONFIG.reducedMotion) {
      document.body.classList.add('reduce-motion');
    }
    
    // Monitor for changes in motion preferences
    window.matchMedia('(prefers-reduced-motion: reduce)').addListener((mq) => {
      CONFIG.reducedMotion = mq.matches;
      if (mq.matches) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }
    });
  }

  /**
   * Update ARIA labels dynamically
   */
  function updateAriaLabels() {
    // Update video containers
    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach(container => {
      const video = container.querySelector('video');
      if (video) {
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Video player with controls');
      }
    });
  }

  /**
   * Handle visibility change (pause videos when tab not active)
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      state.activeVideos.forEach(video => {
        video.pause();
      });
    }
  }

  // Event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Add CSS animation for copy feedback
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    .reduce-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);

  // Initialize when script loads
  init();

})();