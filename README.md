# Ijeoma & Kenechi Wedding Invitation Website

## 🎉 Setup Instructions

### 1. Add Your Media Files

Place your files in the following directories:

- **Intro Video**: `videos/intro.mp4`
  - This is the video that plays when users first tap on the website
  - Recommended format: MP4, H.264 codec for best compatibility
  - Keep file size optimized for fast loading (under 10MB recommended)

- **Hero Background Image**: `images/hero-bg.jpg`
  - This is the main background image for the hero section
  - Recommended size: 1920x1080px or larger
  - Format: JPG or WebP for optimal performance

- **Photo Gallery Images**: `images/gallery/photo1.jpg` through `photo6.jpg`
  - Add your couple photos here
  - Recommended size: 800x800px minimum
  - You can add more photos by duplicating gallery items in index.html

- **Background Music** (Optional): `audio/wedding-music.mp3`
  - Background music for the invitation
  - Users can toggle on/off with the music button
  - Recommended format: MP3, keep under 5MB

### 2. Google Maps API Key

To enable the interactive map feature:

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Maps JavaScript API
3. Replace `YOUR_API_KEY` in `index.html` (line 232) with your actual API key:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap" async defer></script>
   ```

**Note**: The map will only be revealed after guests submit the RSVP form.

### 3. Customize Content

Edit `index.html` to customize:
- Couple names (already set to Ijeoma & Kenechi)
- Wedding date (already set to July 25th, 2026)
- Venue details (already set to Catholic Church of Transfiguration VGC)
- Love story text in the Story section
- Form fields if needed

### 4. Color Scheme

The website uses these colors as requested:
- **Main Color**: Tan (#D2B48C)
- **Secondary Colors**: 
  - Burnt Orange (#CC5500)
  - Brown (#6F4E37)
  - Green (#228B22) for greenery sections
- **Accents**: Gold (#FFD700) and Silver (#C0C0C0) for confetti and scratch card

### 5. Features Included

✅ Intro video overlay (tap to begin)
✅ Day/Night theme toggle
✅ Music toggle button
✅ Countdown timer to wedding date
✅ Scratch card to reveal date (gold shimmer hearts)
✅ Photo gallery with hover effects
✅ RSVP form (exactly as requested)
✅ Interactive Google Maps (revealed after form submission)
✅ Gold and silver confetti animation
✅ Smooth scroll animations
✅ Mobile responsive design
✅ Fast loading optimized

### 6. Testing Locally

You can test the website locally using any of these methods:

**Option 1: Using Python**
```bash
cd /workspace
python3 -m http.server 8000
```
Then visit: http://localhost:8000

**Option 2: Using Node.js (if installed)**
```bash
npx serve /workspace
```

**Option 3: Open directly in browser**
Simply open `index.html` in your web browser (some features like maps may require a server).

### 7. Deployment

Deploy to your preferred hosting platform:
- **Vercel**: Connect your GitHub repo and deploy
- **Netlify**: Drag and drop the folder or connect Git
- **GitHub Pages**: Push to GitHub and enable Pages
- **Any static hosting**: Upload all files

### 8. File Structure

```
/workspace/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # All JavaScript functionality
├── images/
│   ├── hero-bg.jpg     # Hero background image
│   └── gallery/
│       ├── photo1.jpg
│       ├── photo2.jpg
│       ├── photo3.jpg
│       ├── photo4.jpg
│       ├── photo5.jpg
│       └── photo6.jpg
├── videos/
│   └── intro.mp4       # Intro video
└── audio/
    └── wedding-music.mp3  # Background music (optional)
```

### 9. Important Notes

- The envelope feature has been removed as requested
- Date and location only appear in the scratch card section (not in hero)
- Map is hidden until RSVP form is submitted
- All animations are smooth and modern
- Website is fully responsive for mobile devices
- Confetti is gold and silver as requested
- Scratch card uses gold shimmer with heart patterns

### 10. Browser Compatibility

Tested and works on:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

Enjoy your beautiful wedding invitation website! 💕
