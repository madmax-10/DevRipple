import { useState, useEffect,memo } from 'react'
import './CodeEditor.css'

const CodeEditor = ({selectedFile, fileContents}) => {
  const [code, setCode] = useState('')

  useEffect(() => {
    setCode(fileContents[selectedFile] || '// File content will appear here')
  }, [selectedFile])

  const handleCodeChange = (e) => {
    setCode(e.target.value)
  }

  return (
    <div className="code-editor">
      <div className="editor-header">
        <div className="file-tabs">
          <div className="file-tab active">
            <span className="tab-icon">⚛️</span>
            <span className="tab-name">{selectedFile.split('/').pop()}</span>
            <button className="tab-close">×</button>
          </div>
        </div>
      </div>
      
      <div className="editor-content">
        <div className="line-numbers">
          {code.split('\n').map((_, index) => (
            <div key={index} className="line-number">
              {index + 1}
            </div>
          ))}
        </div>
        
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="code-textarea"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  )
}

export default memo(CodeEditor)