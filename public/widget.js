(function() {
  class ReviewWidget {
    constructor(containerId, widgetId) {
      this.containerId = containerId;
      this.widgetId = widgetId;
      this.container = document.getElementById(containerId);
      this.baseUrl = document.currentScript.src.split('/widget.js')[0];
      this.init();
    }

    async init() {
      try {
        // Track impression
        await this.trackAnalytics('impression');
        
        // Fetch widget data
        const response = await fetch(`${this.baseUrl}/api/widgets/${this.widgetId}/data`);
        const { widget, reviews } = await response.json();

        if (!response.ok) throw new Error('Failed to load widget');

        // Add required styles
        this.addStyles();

        // Render widget
        this.render(widget, reviews);

        // Track view
        await this.trackAnalytics('view');
      } catch (error) {
        console.error('Error initializing widget:', error);
        this.container.innerHTML = 'Error loading reviews';
      }
    }

    async trackAnalytics(type) {
      try {
        await fetch(`${this.baseUrl}/api/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            widgetId: this.widgetId,
            type,
            domain: window.location.hostname,
            referrer: document.referrer
          }),
        });
      } catch (error) {
        console.error('Error tracking analytics:', error);
      }
    }

    addStyles() {
      const styleTag = document.createElement('style');
      styleTag.textContent = `
        .review-widget {
          font-family: system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
        }
        .review-widget * {
          box-sizing: border-box;
        }
        .review-star {
          color: #FBBF24;
        }
        .review-star-empty {
          color: #D1D5DB;
        }
        .review-widget-dark {
          background-color: #1F2937;
          color: #F9FAFB;
        }
        .review-widget-light {
          background-color: #FFFFFF;
          color: #111827;
        }
      `;
      document.head.appendChild(styleTag);
    }

    renderStars(rating) {
      return Array(5).fill(0).map((_, i) => `
        <svg class="${i < rating ? 'review-star' : 'review-star-empty'}"
          width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      `).join('');
    }

    render(widget, reviews) {
      const theme = widget.settings.theme || 'light';
      
      switch (widget.settings.type) {
        case 'slider':
          this.renderSlider(widget, reviews);
          break;
        case 'grid':
          this.renderGrid(widget, reviews);
          break;
        case 'list':
          this.renderList(widget, reviews);
          break;
        case 'masonry':
          this.renderMasonry(widget, reviews);
          break;
        case 'badge':
          this.renderBadge(widget, reviews);
          break;
        default:
          this.container.innerHTML = 'Invalid widget type';
      }
    }

    // Implement rendering functions for each widget type
    renderSlider(widget, reviews) {
      let currentIndex = 0;
      const { settings } = widget;
    
      const container = document.createElement('div');
      container.className = `review-widget review-widget-${settings.theme}`;
      container.style.cssText = `
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 8px;
      `;
    
      // Create slider container
      const sliderContainer = document.createElement('div');
      sliderContainer.style.cssText = 'position: relative; overflow: hidden;';
      
      const updateSlide = () => {
        const oldSlide = sliderContainer.querySelector('.slide');
        const newSlide = this.createReviewSlide(reviews[currentIndex], settings);
        
        if (oldSlide) {
          oldSlide.style.opacity = '0';
          oldSlide.style.transform = 'translateX(-100%)';
          
          setTimeout(() => {
            sliderContainer.removeChild(oldSlide);
            newSlide.classList.add('slide-transition');
            sliderContainer.appendChild(newSlide);
            
            // Trigger reflow
            newSlide.offsetHeight;
            
            newSlide.style.opacity = '1';
            newSlide.style.transform = 'translateX(0)';
          }, 500);
        } else {
          newSlide.classList.add('slide-transition');
          sliderContainer.appendChild(newSlide);
        }
      };
    
      // Create navigation buttons
      const prevButton = document.createElement('button');
      prevButton.innerHTML = '←';
      prevButton.className = 'slider-nav prev';
      prevButton.style.cssText = `
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.9);
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        z-index: 2;
      `;
    
      const nextButton = document.createElement('button');
      nextButton.innerHTML = '→';
      nextButton.className = 'slider-nav next';
      nextButton.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.9);
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        z-index: 2;
      `;
    
      prevButton.onclick = () => {
        currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
        updateSlide();
      };
    
      nextButton.onclick = () => {
        currentIndex = (currentIndex + 1) % reviews.length;
        updateSlide();
      };
    
      // Add autoplay if enabled
      if (settings.autoplay) {
        setInterval(() => {
          currentIndex = (currentIndex + 1) % reviews.length;
          updateSlide();
        }, settings.interval || 5000);
      }
    
      container.appendChild(sliderContainer);
      container.appendChild(prevButton);
      container.appendChild(nextButton);
      
      updateSlide();
      this.container.appendChild(container);
    }
    

    renderGrid(widget, reviews) {
      const { settings } = widget;
      const itemsPerRow = settings.itemsPerPage || 3;
    
      const container = document.createElement('div');
      container.className = `review-widget review-widget-${settings.theme}`;
      container.style.cssText = `
        width: 100%;
        padding: 20px;
        border-radius: 8px;
      `;
    
      const grid = document.createElement('div');
      grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${itemsPerRow}, 1fr);
        gap: 20px;
        @media (max-width: 768px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 480px) {
          grid-template-columns: 1fr;
        }
      `;
    
      reviews.forEach(review => {
        const card = this.createReviewCard(review, settings);
        grid.appendChild(card);
      });
    
      container.appendChild(grid);
      this.container.appendChild(container);
    }
    

    renderList(widget, reviews) {
      const { settings } = widget;
    
      const container = document.createElement('div');
      container.className = `review-widget review-widget-${settings.theme}`;
      container.style.cssText = `
        width: 100%;
        padding: 20px;
        border-radius: 8px;
      `;
    
      const list = document.createElement('div');
      list.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';
    
      reviews.forEach(review => {
        const item = this.createReviewListItem(review, settings);
        list.appendChild(item);
      });
    
      container.appendChild(list);
      this.container.appendChild(container);
    }

    renderMasonry(widget, reviews) {
      const { settings } = widget;
      const columnCount = settings.itemsPerPage || 3;
    
      const container = document.createElement('div');
      container.className = `review-widget review-widget-${settings.theme}`;
      container.style.cssText = `
        width: 100%;
        padding: 20px;
        border-radius: 8px;
      `;
    
      const masonryContainer = document.createElement('div');
      masonryContainer.style.cssText = `
        column-count: ${columnCount};
        column-gap: 20px;
        @media (max-width: 768px) {
          column-count: 2;
        }
        @media (max-width: 480px) {
          column-count: 1;
        }
      `;
    
      let delay = 0;
      reviews.forEach(review => {
        const card = this.createMasonryCard(review, settings);
        card.style.animationDelay = `${delay}ms`;
        delay += 100; 
        masonryContainer.appendChild(card);
      });
    
      container.appendChild(masonryContainer);
      this.container.appendChild(container);
    }

    renderBadge(widget, reviews) {
      const { settings } = widget;
      
      // Calculate average rating
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      const container = document.createElement('div');
      container.className = `review-widget review-widget-${settings.theme}`;
      container.style.cssText = `
        display: inline-flex;
        align-items: center;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `;
    
      // Rating section
      const ratingSection = document.createElement('div');
      ratingSection.style.cssText = 'text-align: center; margin-right: 16px;';
    
      const ratingNumber = document.createElement('div');
      ratingNumber.textContent = averageRating.toFixed(1);
      ratingNumber.style.cssText = 'font-size: 24px; font-weight: bold; margin-bottom: 4px;';
    
      const stars = document.createElement('div');
      stars.innerHTML = this.renderStars(Math.round(averageRating));
      stars.style.cssText = 'display: flex; gap: 2px;';
    
      const totalReviews = document.createElement('div');
      totalReviews.textContent = `${reviews.length} reviews`;
      totalReviews.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
    
      ratingSection.appendChild(ratingNumber);
      ratingSection.appendChild(stars);
      ratingSection.appendChild(totalReviews);
    
      // Sources section (if enabled)
      if (settings.showSource) {
        const sourcesSection = document.createElement('div');
        sourcesSection.style.cssText = 'border-left: 1px solid #eee; padding-left: 16px; margin-left: 16px;';
    
        const sources = {
          google: reviews.filter(r => r.source === 'google').length,
          facebook: reviews.filter(r => r.source === 'facebook').length
        };
    
        Object.entries(sources).forEach(([source, count]) => {
          if (count > 0) {
            const sourceRow = document.createElement('div');
            sourceRow.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 4px;';
    
            const icon = document.createElement('img');
            icon.src = `${this.baseUrl}/${source}-icon.png`;
            icon.style.cssText = 'width: 16px; height: 16px;';
    
            const countText = document.createElement('span');
            countText.textContent = count;
            countText.style.cssText = 'font-size: 14px;';
    
            sourceRow.appendChild(icon);
            sourceRow.appendChild(countText);
            sourcesSection.appendChild(sourceRow);
          }
        });
    
        container.appendChild(sourcesSection);
      }
    
      container.appendChild(ratingSection);
      this.container.appendChild(container);
    }

    createMasonryCard(review, settings) {
      const card = document.createElement('div');
      card.style.cssText = `
        break-inside: avoid;
        background: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `;
    
      // Review header
      const header = document.createElement('div');
      header.style.cssText = 'display: flex; align-items: center; margin-bottom: 12px;';
    
      if (settings.showSource) {
        const source = document.createElement('img');
        source.src = `${this.baseUrl}/${review.source}-icon.png`;
        source.style.cssText = 'width: 20px; height: 20px; margin-right: 8px;';
        header.appendChild(source);
      }
    
      const authorSection = document.createElement('div');
    
      const author = document.createElement('div');
      author.textContent = review.author;
      author.style.cssText = 'font-weight: 500;';
      authorSection.appendChild(author);
    
      if (settings.showRating) {
        const stars = document.createElement('div');
        stars.innerHTML = this.renderStars(review.rating);
        stars.style.cssText = 'display: flex; gap: 2px;';
        authorSection.appendChild(stars);
      }
    
      header.appendChild(authorSection);
      card.appendChild(header);
    
      // Review content
      const content = document.createElement('div');
      content.textContent = review.content;
      content.style.cssText = 'margin-bottom: 12px; line-height: 1.5;';
      card.appendChild(content);
    
      // Review date
      const date = document.createElement('div');
      date.textContent = new Date(review.date).toLocaleDateString();
      date.style.cssText = 'color: #666; font-size: 0.875rem;';
      card.appendChild(date);
    
      return card;
    }

    createReviewSlide(review, settings) {
      const slide = document.createElement('div');
      slide.className = 'review-slide';
      slide.style.cssText = `
        padding: 20px;
        text-align: center;
      `;
    
      // Review header
      const header = document.createElement('div');
      header.style.cssText = 'margin-bottom: 16px;';
      
      if (settings.showSource) {
        const source = document.createElement('img');
        source.src = `${this.baseUrl}/${review.source}-icon.png`;
        source.style.cssText = 'width: 24px; height: 24px; margin-right: 8px;';
        header.appendChild(source);
      }
    
      const author = document.createElement('div');
      author.textContent = review.author;
      author.style.cssText = 'font-weight: 500; margin-bottom: 4px;';
      header.appendChild(author);
    
      if (settings.showRating) {
        const stars = document.createElement('div');
        stars.innerHTML = this.renderStars(review.rating);
        stars.style.cssText = 'display: flex; justify-content: center; gap: 2px;';
        header.appendChild(stars);
      }
    
      // Review content
      const content = document.createElement('div');
      content.textContent = review.content;
      content.style.cssText = 'margin-bottom: 16px; line-height: 1.5;';
    
      // Review date
      const date = document.createElement('div');
      date.textContent = new Date(review.date).toLocaleDateString();
      date.style.cssText = 'color: #666; font-size: 0.875rem;';
    
      slide.appendChild(header);
      slide.appendChild(content);
      slide.appendChild(date);
    
      return slide;
    }

    createReviewCard(review, settings) {
      const card = document.createElement('div');
      card.className = 'review-card';
      // ... existing card styles ...
    
      // Add animation class
      card.classList.add('scale-in');
      
      // Setup intersection observer
      this.setupIntersectionObserver().observe(card);
    
      return card;
    }

    createNavigationButton(direction) {
      const button = document.createElement('button');
      button.className = `slider-nav ${direction}`;
      button.innerHTML = direction === 'prev' ? '←' : '→';
      button.style.cssText = `
        position: absolute;
        ${direction === 'prev' ? 'left' : 'right'}: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        z-index: 2;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
      `;
    
      button.onmouseover = () => {
        button.style.opacity = '1';
        button.style.transform = 'translateY(-50%) scale(1.1)';
      };
    
      button.onmouseout = () => {
        button.style.opacity = '0.7';
        button.style.transform = 'translateY(-50%) scale(1)';
      };
    
      return button;
    }
    
  }

  // Initialize widget
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  const containerId = currentScript.parentElement.id;
  const widgetId = currentScript.dataset.widgetId;

  new ReviewWidget(containerId, widgetId);
})();