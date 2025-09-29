# Sinusync Portfolio Website

A professional, minimal black-and-white portfolio website for VFX artist Sinusync, built with vanilla HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Accessibility First**: WCAG compliant with screen reader support, keyboard navigation, and focus management
- **Motion Preferences**: Respects `prefers-reduced-motion` for accessibility
- **Performance Optimized**: Lazy loading, minimal dependencies, optimized assets
- **Progressive Enhancement**: Works without JavaScript with graceful fallbacks

### Pages

1. **Home (index.html)**: Hero section with architectural blueprint background, software logos, and preview cards
2. **Links (links.html)**: Social media links with copy-to-clipboard functionality  
3. **Portfolio (portfolio.html)**: Full-screen image/video slider with audio controls

### Key Technologies

- **Animations**: GSAP for smooth entrance animations and parallax effects
- **Slider**: Swiper.js for the portfolio carousel with keyboard and touch support
- **Video Handling**: Smart autoplay with muted fallback and audio toggle
- **Styling**: Modern CSS with Grid, Flexbox, and custom properties

## Getting Started

### Option 1: Simple File Opening
Open `index.html` directly in your web browser.

### Option 2: Local Server (Recommended)
Use a local server to avoid CORS issues with videos and assets:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Project Structure

```
├── index.html              # Home page
├── links.html              # Social links page  
├── portfolio.html          # Portfolio slider page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── main.js            # Main JavaScript functionality
├── assets/
│   ├── placeholder-1.webp  # Blueprint background image
│   ├── placeholder-2.webp  # Portfolio image 1
│   ├── placeholder-3.webp  # Portfolio image 2  
│   ├── placeholder-4.webp  # Portfolio image 3
│   ├── video-1.webm       # Portfolio video 1
│   └── video-2.webm       # Portfolio video 2
└── README.md              # This file
```

## Browser Autoplay Policy

Modern browsers restrict autoplay with audio to prevent unwanted sound. This site handles this gracefully:

- **Default Behavior**: Videos autoplay muted by default
- **Audio Toggle**: Users can enable audio via the toggle button
- **Smart Fallback**: If autoplay with audio fails, shows a play button prompt
- **User Preference**: Audio preference is saved to localStorage

## Accessibility Features

- **Skip Links**: Jump to main content
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Motion Sensitivity**: Respects `prefers-reduced-motion` preference
- **High Contrast**: Enhanced visibility for high contrast mode
- **Alternative Text**: Descriptive alt text for all images

## Performance Optimizations

- **Lazy Loading**: Images and videos load only when needed
- **Minimal Dependencies**: Only essential libraries (GSAP, Swiper)
- **Optimized Assets**: WebP images and WebM videos for smaller file sizes
- **Efficient Animations**: Hardware-accelerated CSS transforms
- **Preloading**: Critical assets preloaded for faster initial render

## Deployment

### Recommended Hosting Platforms

- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect your Git repository  
- **GitHub Pages**: Push to a GitHub repository and enable Pages

### CORS Considerations

When hosting videos, ensure your server sends appropriate CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
```

### Content Security Policy

If using CSP headers, allow:
- GSAP from cdnjs.cloudflare.com
- Swiper from cdn.jsdelivr.net
- Inline styles and scripts

## Customization

### Colors
Update CSS custom properties in `styles.css`:

```css
:root {
  --color-bg: #0a0a0a;          /* Background */
  --color-text: #ffffff;         /* Primary text */
  --color-text-secondary: #bfbfbf; /* Secondary text */
  /* ... */
}
```

### Fonts
The site uses a system font stack. To use custom fonts:

1. Add font files to `assets/fonts/`
2. Update CSS font variables
3. Add `@font-face` declarations

### Content
- Replace placeholder images in `assets/`
- Update text content in HTML files
- Modify social links in `links.html`
- Update meta tags for SEO

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Core Features**: Works in IE11 with graceful degradation
- **JavaScript**: ES2017+ features with fallbacks

## Development

### Code Style
- Semantic HTML5 elements
- BEM-inspired CSS class naming
- Modular JavaScript with IIFE pattern
- Mobile-first responsive design

### Testing Checklist
- [ ] All pages load correctly
- [ ] Navigation works via keyboard
- [ ] Videos play/pause correctly  
- [ ] Audio toggle functions properly
- [ ] Copy links functionality works
- [ ] Responsive design on all screen sizes
- [ ] Accessibility with screen reader
- [ ] Reduced motion preference respected

## License

This project is for portfolio demonstration purposes. Please replace with appropriate license for your use case.

---

**Built with ❤️ for Sinusync's professional portfolio**