import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Suspense, lazy } from 'react'
import Navigation from './components/Navigation'
import LoadingScreen from './components/LoadingScreen'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const OurStory = lazy(() => import('./pages/OurStory'))
const Events = lazy(() => import('./pages/Events'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Quiz = lazy(() => import('./pages/Quiz'))

function App() {
  const location = useLocation()

  return (
    <div className="app">
      <Navigation />
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  )
}

export default App
