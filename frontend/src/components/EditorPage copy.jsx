import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FileExplorer from './FileExplorer'
import CodeEditor from './CodeEditor'
import Preview from './Preview'
import './EditorPage.css'
import axios from 'axios'
import useWebContainer from '../hooks/useWebContainer'

const EditorPage = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const [prompt] = useState(location.state?.prompt || '')
  const [selectedFile, setSelectedFile] = useState('src/App.jsx')
  const [isGenerating, setIsGenerating] = useState(true)
  const [fileTree,setFileTree] = useState(null)
  const [files,setFiles] = useState(null)
  const [additional_code,setAdditionalCode] = useState('')

  const [previewUrl, setPreviewUrl] = useState(null)

  const webcontainerInstance = useWebContainer()

  let installProcess;
  let devServerProcess;

  const installDependencies = async () => {
      if (!webcontainerInstance) {
          console.error('WebContainer not booted yet!');
          return;
      }
      console.log('Installing dependencies...');

      // Spawn npm install process
      installProcess = await webcontainerInstance.spawn('npm', ['install']);

      // Pipe stdout/stderr to a visible terminal (e.g., a textarea or div)
      const installStream = new WritableStream({
          write(chunk) {
              // Append chunk to your terminal UI element
              // For example: document.getElementById('terminal').innerText += chunk;
              console.log('Install Output:', chunk);
          },
      });

      installProcess.output.pipeTo(installStream);

      // Wait for the process to exit
      const exitCode = await installProcess.exit;

      if (exitCode !== 0) {
          console.error(`npm install failed with exit code ${exitCode}`);
          // Handle error in UI
          return;
      }
      console.log('Dependencies installed successfully!');
  }

  const startDevServer = async() => {
      if (!webcontainerInstance) {
          console.error('WebContainer not booted yet!');
          return;
      }
      console.log('Starting development server...');

      // Spawn the start script defined in package.json
      devServerProcess = await webcontainerInstance.spawn('npm', ['run', 'dev']);

      // Pipe server output to your terminal UI
      const serverStream = new WritableStream({
          write(chunk) {
              console.log('Server Output:', chunk);
          },
      });
      devServerProcess.output.pipeTo(serverStream);

      // Don't await devServerProcess.exit if it's a long-running server!
      // Instead, listen for 'server-ready' event.
  }

  const getCode = (UITemplate,enhancedPrompt) => async () => {

    const res = await axios.post("http://127.0.0.1:8000/api/chat/", {
      "enhanced_prompt": enhancedPrompt,
      "platform_prompt": UITemplate,
    });
    const response = res.data
    if (!response) {
      console.error("Error from server:", response.error);
      return response.error
    }
    else {
      const additionalCode = response.additionalCode
      setAdditionalCode(additionalCode)
      console.log("Additional code received:", additionalCode); 
      return additionalCode   
    }
  }

  const parseArtifact = (boltString) => {

    const files = {};
    const regex = /<boltAction.*?filePath="([^"]+)"[^>]*>([\s\S]*?)<\/boltAction>/g;

    let match;
    while ((match = regex.exec(boltString)) !== null) {
      const filePath = match[1];
      const fileContent = match[2].trim();
      
      if (filePath) {
        files[filePath] = fileContent;
      }
    }
    
    // setFiles(files)
    console.log("Parsed files from artifact:", files);

    return files;

  }

  const parseUITemplate = (projectFilesString) => {
    const files = {};
    const lines = projectFilesString.split('\n');

    let currentFile = '';
    let collectingContent = false;
    let fileContentLines = [];

    for (const line of lines) {

      if (line.startsWith('<project_files>') || line.startsWith('</project_files>') ||
          line.startsWith('The following is a list of all project files') ||
          line.startsWith('IMPORTANT:') ||
          line.startsWith('Here is a list of files that exist on the file system but are not being shown to you:') ||
          line.trim().startsWith('- ')) {
        continue;
      }

      if (line.trim().startsWith('```')) {
        if (!collectingContent) {
          collectingContent = true;
        } else {
          collectingContent = false;
          if (currentFile) {
            files[currentFile] = fileContentLines.join('\n').trim();
            currentFile = ''; // Reset current file
            fileContentLines = []; // Clear content for the next file
          }
        }
      } else if (collectingContent) {
        fileContentLines.push(line);

      } else if (line.trim().endsWith(':') && line.trim().length > 1) {
        currentFile = line.trim().slice(0, -1);
        fileContentLines = []; // Clear content for the new file
      }
    }

    if (currentFile && fileContentLines.length > 0) {
      files[currentFile] = fileContentLines.join('\n').trim();
    }

    // setFiles(files);

    console.log("Parsed files:", files);

    return files;

  }
    
  const parseFiles = (files) =>{

    const fileTree = {};

    for (const path in files) {
      const parts = path.split('/');
      let currentLevel = fileTree;

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;

        if (isFile) {
          currentLevel[part] = 'file';
        } else {
          if (!currentLevel[part]) {
            currentLevel[part] = {
              type: 'folder',
              children: {}
            };
          }
          currentLevel = currentLevel[part].children;
        }
      });
    }

    setFileTree(fileTree);
    console.log("Parsed file structure:", fileTree);

  }

  const webContainerformat = (flatFiles) => {

    const result = {};

    for (const path in flatFiles) {
      if (Object.hasOwnProperty.call(flatFiles, path)) {
        const parts = path.split('/');
        let currentLevel = result;

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];

          if (i === parts.length - 1) {
            // This is the file itself
            currentLevel[part] = {
              file: {
                contents: flatFiles[path],
              },
            };
          } else {
            // This is a directory
            if (!currentLevel[part]) {
              currentLevel[part] = {
                directory: {},
              };
            }
            currentLevel = currentLevel[part].directory;
          }
        }
      }
    }
    return result;

  }

  const setUpFiles = (projectFiles) => async() => {
    if (!webcontainerInstance) {
      console.error('WebContainer not booted yet!');
      return;
    }
    console.log('Mounting project files...');
    await webcontainerInstance.mount(projectFiles);
    console.log('Files mounted successfully!');
  }

       
  useEffect(() => { // No 'async' here

    if (!prompt) {
      navigate('/')
      return
  }

    if (!webcontainerInstance) {
      return;
    }

    const fetchData = async () => { // Define the async function inside
    // const fetchData = () => { // Use useCallback to memoize the function
        if (!prompt) {
            navigate('/')
            return
        }
        if (isGenerating){
        // setIsGenerating(true) // Set generating before the async operation starts
          try {
              const res = await axios.post("http://127.0.0.1:8000/api/template/", {
                  message: prompt,
              })
              const responseData = res.data; // Use a distinct variable name

              if (responseData.error) { // Check for server-defined error
                  console.error("Error from server:", responseData.error);
                  
              } else {
                  console.log("Response from server:", responseData);
                  
                  // For now, assuming they are accessible in the scope
                  const UIPrompt = responseData.filesTemplate; // Assuming this is the UI template string

                  const enhancedPrompt = responseData.prompt
                  
                  const add = await getCode(UIPrompt, prompt)() // Call the function to get additional code

                  const a = parseUITemplate(UIPrompt) // Parse the UI template to get files

                  // const a =  parseUITemplate(prompt) // Parse the UI template to get files

                  // console.log("Parsed UI Template:", a);
                  
                  // parseFiles(a)

                  // parseFiles(add)

                  
                  const b = parseArtifact(add) // Parse the additional code to get files
                  
                  // const b = parseArtifact(additional_code) // Parse the additional code to get files
                  
                  // console.log("Parsed Additional Code:", b);
                  const mergedFiles = {...a, ...b} // Merge the two file object

                  for (const filePath in mergedFiles) {
                    if (typeof mergedFiles[filePath] !== 'string') continue;
  
                    // 1. Globally fix escaped quotes for ALL file types.
                    mergedFiles[filePath] = mergedFiles[filePath].replace(/\\"/g, '"');
  
                    // 2. Perform additional, specific cleaning ONLY for JSON files.
                    if (filePath.endsWith('.json')) {
                        try {
                            let jsonString = mergedFiles[filePath];
                            // Remove comments
                            jsonString = jsonString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
                            const jsonObject = JSON.parse(jsonString);
                            // Re-stringify to ensure perfect formatting
                            mergedFiles[filePath] = JSON.stringify(jsonObject, null, 2);
                        } catch (e) {
                            throw new Error(`Failed to parse and fix ${filePath}. Original error: ${e.message}`);
                        }
                    }
                  }

                  console.log("Merged Files:", mergedFiles);

                  setFiles(mergedFiles) // Set the files state with merged files
                  
                  parseFiles(mergedFiles) // Parse the files again after merging
                  setIsGenerating(false) // Set generating to false after the async operation completes
                  
                  const c = webContainerformat(mergedFiles) // Format the files for WebContainer

                  console.log("Formatted files for WebContainer:", c);

                  await setUpFiles(c)() // Set up the files in WebContainer

                  await installDependencies() // Install dependencies in WebContainer

                  await startDevServer() // Start the development server in WebContainer

                  webcontainerInstance.on('server-ready', (port, url) => {
                    // 1. The `url` (like 'http://localhost:5173') is captured
                    setPreviewUrl(url); 
                    
                    // 2. The status is set to 'ready'
                    // setStatus('ready'); 
                  });

              }
          } catch (error) {
              console.error("Error occurred during API call: " + error.message);
              if (error.response) {
                  
                  console.error("Server responded with error status:", error.response.status);
                  console.error("Server error data:", error.response.data);
              } else if (error.request) {
                  // The request was made but no response was received
                  console.error("No response received from server:", error.request);
              } else {
                  // Something happened in setting up the request that triggered an Error
                  console.error("Axios config error:", error.message);
              }
          }
        }
    };

    fetchData(); // Call the async function immediately

}, [prompt,webcontainerInstance]); // Dependencies remain the same

if (isGenerating) {
  return (
    <div className="editor-page">
      <div className="generating-overlay">
        <div className="generating-content">
          <div className="spinner"></div>
          <h2>Generating your application...</h2>
          <p>Analyzing your prompt: "{prompt}"</p>
          <div className="progress-steps">
            <div className="step active">Setting up project structure</div>
            <div className="step">Generating components</div>
            <div className="step">Configuring dependencies</div>
            <div className="step">Building preview</div>
          </div>
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="editor-page">
      <header className="editor-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Bolt
          </button>
          <div className="project-info">
            <h1 className="project-title">My Application</h1>
            <p className="project-prompt">"{prompt}"</p>
          </div>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary">Save</button>
          <button className="btn btn-primary">Deploy</button>
        </div>
      </header>

      <div className="editor-layout">
        <aside className="sidebar">
          <FileExplorer selectedFile={selectedFile} onFileSelect={setSelectedFile} fileStructure={fileTree} />
        </aside>
        
        <main className="main-content">
          <div className="editor-container">
            <CodeEditor selectedFile={selectedFile} fileContents={files} />
          </div>
        </main>

        <aside className="preview-panel">
          <Preview url={previewUrl}/>
        </aside>
      </div>
    </div>
  )
}

export default EditorPage