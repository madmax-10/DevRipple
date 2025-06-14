import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = () => {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim()) {
      navigate('/editor', { state: { prompt } })
    }
  }

  const examplePrompts = [
    "Build a todo app with React and local storage",
    "Create a weather dashboard with API integration",
    "Design a portfolio website with dark mode",
    "Build a chat application with real-time messaging"
  ]

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Bolt</span>
          </div>
          <nav className="nav">
            <a href="#" className="nav-link">Docs</a>
            <a href="#" className="nav-link">Examples</a>
            <a href="#" className="nav-link">Sign In</a>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="hero">
          <div className="container">
            <div className="hero-content animate-fade-in">
              <h1 className="hero-title">
                Prompt, run, edit & deploy
                <span className="gradient-text"> full-stack web apps</span>
              </h1>
              <p className="hero-description">
                Build production-ready web applications from simple text prompts. 
                No complex setup, no configuration - just describe what you want to build.
              </p>

              <form className="prompt-form" onSubmit={handleSubmit}>
                <div className="input-container">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the app you want to build..."
                    className="prompt-input"
                  />
                  <button type="submit" className="submit-btn" disabled={!prompt.trim()}>
                    <span>Build</span>
                    <span className="arrow">→</span>
                  </button>
                </div>
              </form>

              <div className="examples">
                <p className="examples-title">Try these examples:</p>
                <div className="examples-grid">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      className="example-btn"
                      onClick={() => setPrompt(example)}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="features">
          <div className="container">
            <div className="features-grid">
              <div className="feature animate-slide-in">
                <div className="feature-icon">🚀</div>
                <h3>Instant Setup</h3>
                <p>No configuration needed. Start building immediately with AI-powered code generation.</p>
              </div>
              <div className="feature animate-slide-in">
                <div className="feature-icon">⚡</div>
                <h3>Lightning Fast</h3>
                <p>Generate, preview, and iterate on your applications in real-time.</p>
              </div>
              <div className="feature animate-slide-in">
                <div className="feature-icon">🎨</div>
                <h3>Full-Stack</h3>
                <p>Frontend, backend, database - build complete applications with a single prompt.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage