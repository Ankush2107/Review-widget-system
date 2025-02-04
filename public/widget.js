(function () {
  class ReviewWidget {
    constructor(containerId, widgetId) {
      this.containerId = containerId;
      this.widgetId = widgetId;
      this.container = document.getElementById(containerId);
      this.init();
    }

    async init() {
      try {
        // Fetch widget data and reviews
        const response = await fetch(
          `${window.location.origin}/api/widgets/${this.widgetId}/data`
        );
        const { widget, reviews } = await response.json();

        // Add required styles
        this.addStyles();

        // Render the widget
        this.render(widget, reviews);
      } catch (error) {
        console.error("Error loading widget:", error);
        this.container.innerHTML = "Error loading reviews";
      }
    }

    addStyles() {
      const styleTag = document.createElement("style");
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
          /* Add more styles based on your widget types */
        `;
      document.head.appendChild(styleTag);
    }

    renderStars(rating) {
      return Array(5)
        .fill(0)
        .map(
          (_, i) => `
          <svg class="${i < rating ? "review-star" : "review-star-empty"}"
            width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        `
        )
        .join("");
    }

    render(widget, reviews) {
      const theme =
        widget.settings.theme === "dark"
          ? { bg: "#1F2937", text: "#FFFFFF" }
          : { bg: "#FFFFFF", text: "#111827" };

      // Basic widget container
      this.container.innerHTML = `
          <div class="review-widget" style="background: ${theme.bg}; color: ${
        theme.text
      }; padding: 1rem; border-radius: 0.5rem;">
            ${this.renderReviews(reviews, widget.settings)}
          </div>
        `;
    }

    renderReviews(reviews, settings) {
      // Render based on widget type
      switch (settings.type) {
        case "slider":
          return this.renderSlider(reviews, settings);
        case "grid":
          return this.renderGrid(reviews, settings);
        case "list":
          return this.renderList(reviews, settings);
        default:
          return "Unsupported widget type";
      }
    }

    renderSlider(reviews, settings) {
      // Implementation for slider
    }

    renderGrid(reviews, settings) {
      // Implementation for grid
    }

    renderList(reviews, settings) {
      // Implementation for list
    }
    async trackAnalytics(eventType) {
      try {
        await fetch(
          `${window.location.origin}/api/analytics/${this.widgetId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventType,
              referrer: document.referrer,
            }),
          }
        );
      } catch (error) {
        console.error("Error tracking analytics:", error);
      }
    }
    async init() {
      try {
        await this.trackAnalytics("view");
        // ... rest of init code
        await this.trackAnalytics("load");
      } catch (error) {
        await this.trackAnalytics("error");
        console.error("Error loading widget:", error);
        this.container.innerHTML = "Error loading reviews";
      }
    }
    async trackImpression() {
      try {
        await fetch(`${window.location.origin}/api/analytics/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            widgetId: this.widgetId,
            type: "impression",
            domain: window.location.hostname,
            referrer: document.referrer,
          }),
        });
      } catch (error) {
        console.error("Error tracking impression:", error);
      }
    }
    async trackView() {
      try {
        await fetch(`${window.location.origin}/api/analytics/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            widgetId: this.widgetId,
            type: "view",
            domain: window.location.hostname,
            referrer: document.referrer,
          }),
        });
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    }
  }

  // Initialize widget
  const scripts = document.getElementsByTagName("script");
  const currentScript = scripts[scripts.length - 1];
  const containerId = currentScript.parentElement.id;
  const widgetId = currentScript.dataset.widgetId;

  new ReviewWidget(containerId, widgetId);
})();
