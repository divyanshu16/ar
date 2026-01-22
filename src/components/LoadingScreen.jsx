import { motion } from 'framer-motion'

function LoadingScreen() {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-rings">
        <div className="loading-ring"></div>
        <div className="loading-ring"></div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          marginTop: '2rem',
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          color: 'var(--gold-dark)',
          fontStyle: 'italic'
        }}
      >
        Loading your invitation...
      </motion.p>
    </motion.div>
  )
}

export default LoadingScreen
