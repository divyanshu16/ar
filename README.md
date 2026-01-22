# Akshay & Tripti Wedding Website

A beautiful, immersive 3D wedding website built with React and Three.js for Akshay & Tripti's wedding celebration in Alwar, Rajasthan.

## Features

- **3D Wedding Rings**: Interactive floating wedding rings on the homepage
- **Love Story Timeline**: Animated journey through the couple's relationship
- **Events Page**: Complete schedule for all ceremonies (Mehendi, Sangeet, Haldi, Wedding)
- **3D Photo Gallery**: Interactive gallery with grid and 3D viewing modes
- **Fun Quiz**: "How well do you know the couple?" with confetti effects
- **Elegant Design**: Gold & cream theme with Rajasthani design elements (paisley, mandala, marigolds)

## Wedding Schedule

### Day One - February 7, 2026
- **Mehendi** - 2:00 PM (Dress: Shades of Green and Olive)
- **Sangeet** - 7:30 PM (Dress: Disco Affair)

### Day Two - February 8, 2026
- **Haldi** - 10:00 AM (Dress: Shades of Yellow and Pink)
- **Wedding** - 7:00 PM (Dress: Traditional - skip red/maroon)

**Venue**: Alwar Motel and Resorts, Alwar, Rajasthan

## Tech Stack

- **React 18** - UI Framework
- **Three.js** with **React Three Fiber** - 3D Graphics
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Vite** - Build Tool
- **Canvas Confetti** - Celebration Effects

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
src/
├── components/
│   ├── 3d/
│   │   ├── WeddingRings.jsx    # 3D wedding rings component
│   │   └── FloatingElements.jsx # Decorative 3D elements
│   ├── Navigation.jsx           # Site navigation
│   └── LoadingScreen.jsx        # Loading animation
├── pages/
│   ├── Home.jsx                 # Landing page with countdown
│   ├── OurStory.jsx             # Love story timeline
│   ├── Events.jsx               # Wedding ceremonies schedule
│   ├── Gallery.jsx              # Photo gallery
│   └── Quiz.jsx                 # Couple quiz
├── data/
│   └── weddingData.js           # Wedding information & content
└── styles/
    └── index.css                # Global styles & design system
```

## Customization

1. Update couple names and dates in `src/data/weddingData.js`
2. Modify events, timeline milestones, and quiz questions
3. Add photos to `public/images/` and update gallery data
4. Adjust theme colors in `src/styles/index.css`

## Hashtag

Share your moments: **#AkshayWedsTripti**
