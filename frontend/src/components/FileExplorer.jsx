import { useState } from 'react'
import './FileExplorer.css'

const FileExplorer = ({ selectedFile, onFileSelect, fileStructure }) => {
  const [expandedFolders, setExpandedFolders] = useState(['src', 'public'])

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => 
      prev.includes(folderPath) 
        ? prev.filter(path => path !== folderPath)
        : [...prev, folderPath]
    )
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()
    switch (extension) {
      case 'jsx': return '⚛️'
      case 'js': return '📄'
      case 'css': return '🎨'
      case 'html': return '🌐'
      case 'json': return '📋'
      case 'svg': return '🖼️'
      case 'ico': return '🔷'
      default: return '📄'
    }
  }

  const renderFileTree = (structure, basePath = '') => {
    // if (!structure) {
    //   return null; // or return a loading indicator, or an empty div
    // }
    return Object.entries(structure).map(([name, content]) => {
      const fullPath = basePath ? `${basePath}/${name}` : name
      
      if (content === 'file') {
        return (
          <div
            key={fullPath}
            className={`file-item ${selectedFile === fullPath ? 'selected' : ''}`}
            onClick={() => onFileSelect(fullPath)}
          >
            <span className="file-icon">{getFileIcon(name)}</span>
            <span className="file-name">{name}</span>
          </div>
        )
      }

      if (content.type === 'folder') {
        const isExpanded = expandedFolders.includes(fullPath)
        return (
          <div key={fullPath} className="folder-item">
            <div
              className="folder-header"
              onClick={() => toggleFolder(fullPath)}
            >
              <span className={`folder-arrow ${isExpanded ? 'expanded' : ''}`}>▶</span>
              <span className="folder-icon">📁</span>
              <span className="folder-name">{name}</span>
            </div>
            {isExpanded && (
              <div className="folder-children">
                {renderFileTree(content.children, fullPath)}
              </div>
            )}
          </div>
        )
      }

      return null
    })
  }

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <h3>Explorer</h3>
      </div>
      <div className="file-tree">
        {renderFileTree(fileStructure)}
      </div>
    </div>
  )
}

export default FileExplorer