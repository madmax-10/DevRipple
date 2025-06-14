import { useState } from 'react'
import './Preview.css'

const Preview = ({url}) => {
  const [previewMode, setPreviewMode] = useState('desktop')

  return (
    <div className="preview">
      <div className="preview-header">
        <h3>Preview</h3>
        <div className="preview-controls">
          <button
            className={`control-btn ${previewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setPreviewMode('mobile')}
          >
            📱
          </button>
          <button
            className={`control-btn ${previewMode === 'tablet' ? 'active' : ''}`}
            onClick={() => setPreviewMode('tablet')}
          >
            📱
          </button>
          <button
            className={`control-btn ${previewMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setPreviewMode('desktop')}
          >
            💻
          </button>
          <button className="control-btn">🔄</button>
        </div>
      </div>
      
      <div className="preview-content">
        <div className={`preview-frame ${previewMode}`}>
          <div className="mock-browser">
            <div className="browser-bar">
              <div className="browser-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="browser-url">localhost:3000</div>
            </div>
            
            <div className="app-preview">
            {url ? (
              // If `url` exists, render the iframe
              <iframe
                src={url}
                title="Live Preview"
                className="preview-iframe"
                width={"100%"} height={"100%"}
              />
            ) : (
              // Otherwise, render the placeholder
              <div className="placeholder-content">
                <h2>Starting server...</h2>
                <p>The preview will appear here once the server is ready.</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview