import { motion } from 'framer-motion'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="footer-label">Don't forget to tag your posts</p>
          <p className="footer-hashtag">#CodemeetsClause</p>

          <a
            href="https://instagram.com/Manyu.yadav"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-instagram"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            @Manyu.yadav
          </a>
        </motion.div>
      </div>

      <style>{`
        .site-footer {
          padding: var(--space-xl) 0;
          background: linear-gradient(
            135deg,
            var(--cream-dark) 0%,
            var(--gold-light) 100%
          );
          text-align: center;
          border-top: 1px solid var(--gold-light);
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
        }

        .footer-label {
          color: var(--warm-gray);
          font-size: 0.95rem;
          margin: 0 0 var(--space-xs);
        }

        .footer-hashtag {
          font-family: var(--font-display);
          font-size: 2.5rem;
          margin: 0;
          color: var(--gold-dark);
        }

        .footer-instagram {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--warm-gray);
          text-decoration: none;
          font-size: 1.25rem;
          transition: color var(--transition-fast);
        }

        .footer-instagram:hover {
          color: var(--gold-dark);
        }

        .footer-instagram svg {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .footer-hashtag {
            font-size: 2rem;
          }

          .footer-instagram {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
