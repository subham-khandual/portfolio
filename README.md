# 🌟 Portfolio

A modern, responsive personal portfolio website built with vanilla JavaScript, HTML, and CSS. Showcase your projects, skills, and experience in an elegant and interactive way.

---

## ✨ Features

- 🎨 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Smooth Animations** - Engaging CSS animations and transitions for better UX
- 🎯 **Interactive Elements** - Dynamic sections with hover effects and smooth scrolling
- 📱 **Mobile Optimized** - Touch-friendly interface and optimized performance
- 🌙 **Modern Styling** - Clean, contemporary design with custom CSS
- 🚀 **Fast Loading** - Lightweight vanilla JS with no heavy dependencies
- ♿ **Accessible** - Semantic HTML and keyboard navigation support

---

## 🚀 Live Demo

Visit your portfolio: [Portfolio Demo](https://portfolio-nine-alpha-8nkzp7nnk6.vercel.app/)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **JavaScript** | 62.4% - Interactive features and DOM manipulation |
| **CSS** | 34.4% - Styling, animations, and responsive layout |
| **HTML** | 3.2% - Semantic markup and structure |

---

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── css/
│   ├── style.css       # Main stylesheet
│   ├── responsive.css  # Media queries for responsiveness
│   └── animations.css  # Animation definitions
├── js/
│   ├── main.js         # Main JavaScript logic
│   ├── scroll.js       # Smooth scroll functionality
│   └── nav.js          # Navigation interactions
├── assets/
│   ├── images/         # Project and profile images
│   ├── icons/          # SVG icons and logos
│   └── projects/       # Project screenshots
└── README.md           # This file
```

---

## 🎯 Key Sections

### 1. **Hero Section**
- Eye-catching welcome banner
- Call-to-action buttons
- Brief introduction

### 2. **About Me**
- Personal background
- Skills overview
- Career highlights

### 3. **Projects**
- Featured project showcase
- Project descriptions and links
- Live demos and GitHub repos

### 4. **Skills**
- Technical skills with proficiency levels
- Tools and technologies
- Languages and frameworks

### 5. **Contact**
- Contact form
- Social media links
- Email and phone information

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)
- Git (optional, for cloning)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SubhamKhandual007/portfolio.git
   cd portfolio
   ```

2. **Open the project**
   ```bash
   # Using VS Code
   code .
   
   # Or open directly in browser
   open index.html
   ```

3. **Start a local server** (recommended)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

4. **Visit in browser**
   ```
   http://localhost:8000
   ```

---

## 🎨 Customization Guide

### Update Personal Information

1. **Edit `index.html`**
   - Replace name with your name
   - Update email and phone
   - Add your social media links
   - Update project details

2. **Modify Styling**
   - Edit `css/style.css` to change colors and fonts
   - Update primary and accent colors
   - Adjust spacing and layout

3. **Add Your Content**
   - Replace profile image in `assets/images/`
   - Add project screenshots
   - Update project descriptions
   - Add your resume/CV

### Color Scheme
Update the CSS variables in `style.css`:
```css
:root {
  --primary-color: #6366f1;      /* Main color */
  --secondary-color: #ec4899;    /* Accent color */
  --dark-bg: #0f172a;            /* Dark background */
  --light-text: #f1f5f9;         /* Light text */
}
```

---

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest 2 versions |
| Firefox | ✅ Latest 2 versions |
| Safari | ✅ Latest 2 versions |
| Edge | ✅ Latest 2 versions |
| Mobile Safari | ✅ iOS 12+ |
| Chrome Mobile | ✅ Android 8+ |

---

## 🔧 JavaScript Features

### Smooth Scrolling
- Scroll to sections with smooth animation
- Active navigation highlighting
- Back-to-top button functionality

### Interactive Elements
- Hover animations on project cards
- Smooth transitions between sections
- Form validation
- Dynamic content loading

### Performance Optimization
- Lazy loading for images
- CSS animations for smooth 60fps performance
- Minimal JavaScript footprint
- Optimized CSS media queries

---

## 📈 Performance Tips

- ⚡ Optimize images (compress PNG/JPG)
- 🚀 Minify CSS and JavaScript for production
- 📦 Use CSS instead of JS for animations
- 🖼️ Implement lazy loading for images
- 🔄 Minimize HTTP requests
- 💾 Enable browser caching

---

## 🔐 Security

- No sensitive information hardcoded
- Use environment variables for contact forms
- Validate all user inputs
- Implement CSRF protection for forms

---

## 📝 Adding a Contact Form

To add backend support for contact form:

1. **Use a service like:**
   - Formspree
   - EmailJS
   - Netlify Forms
   - AWS Lambda

2. **Example with Formspree:**
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
     <input type="email" name="email" required>
     <textarea name="message" required></textarea>
     <button type="submit">Send</button>
   </form>
   ```

---

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to GitHub Pages
```bash
# Push to gh-pages branch
git push origin main:gh-pages
```

---

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript Info](https://javascript.info/)
- [Web.dev](https://web.dev/)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License. Feel free to use it as inspiration for your own portfolio!

---

## 📞 Contact & Connect

- 📧 **Email:** [your-email@example.com](mailto:your-email@example.com)
- 💼 **LinkedIn:** [SubhamKhandual007](https://linkedin.com/in/SubhamKhandual007)
- 🐙 **GitHub:** [@SubhamKhandual007](https://github.com/SubhamKhandual007)
- 🐦 **Twitter:** [@SubhamKhandual](https://twitter.com/SubhamKhandual)

---

## ⭐ Support

If you found this portfolio helpful, please consider:
- ⭐ Giving this repo a star
- 🍴 Forking it for your own use
- 💬 Sharing feedback and suggestions

---

**Made with ❤️ by [Subham Khandual](https://github.com/SubhamKhandual007)**

Last updated: May 2026
