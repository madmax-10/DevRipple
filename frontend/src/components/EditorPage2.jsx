import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FileExplorer from './FileExplorer'
import CodeEditor from './CodeEditor'
import Preview from './Preview'
import './EditorPage.css'
import axios from 'axios'
import useWebContainer from '../hooks/useWebContainer'

const EditorPage2 = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const [prompt] = useState(location.state?.prompt || '')
  const [selectedFile, setSelectedFile] = useState('src/App.jsx')
  const [isGenerating, setIsGenerating] = useState(true)
  const [fileTree,setFileTree] = useState(null)
  const [files,setFiles] = useState(null)
  const [additional_code,setAdditionalCode] = useState(`I'll create a beautiful, production-ready todo app with all the requested features. Here's the implementation:

<boltArtifact id="todo-app-implementation" title="Todo App Implementation">
<boltAction type="file" filePath="src/types.ts">
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}
</boltAction>

<boltAction type="file" filePath="src/components/TodoItem.tsx">
import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Circle, Edit, Trash, X, Save } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center flex-1">
        <button 
          onClick={() => onToggle(todo.id)}
          className="mr-3 text-gray-400 hover:text-green-500 transition-colors"
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <Circle size={20} />
          )}
        </button>
        
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEdit}
            className="flex-1 px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        ) : (
          <span 
            className={\`flex-1 \${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}\`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.text}
          </span>
        )}
      </div>
      
      <div className="flex space-x-2 ml-3">
        {!isEditing ? (
          <>
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
              aria-label="Edit todo"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => onDelete(todo.id)}
              className="p-1 text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Delete todo"
            >
              <Trash size={18} />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={handleEdit}
              className="p-1 text-gray-500 hover:text-green-500 transition-colors"
              aria-label="Save changes"
            >
              <Save size={18} />
            </button>
            <button 
              onClick={() => {
                setEditText(todo.text);
                setIsEditing(false);
              }}
              className="p-1 text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Cancel edit"
            >
              <X size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
</boltAction>

<boltAction type="file" filePath="src/components/AddTodoForm.tsx">
import React, { useState, useRef } from 'react';
import { Plus } from 'lucide-react';

interface AddTodoFormProps {
  onAdd: (text: string) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Todo cannot be empty');
      inputRef.current?.focus();
      return;
    }
    
    onAdd(text);
    setText('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          placeholder="Add a new todo..."
          className={\`flex-1 px-4 py-3 rounded-l-lg border \${
            error ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500\`}
          aria-invalid={!!error}
          aria-describedby={error ? "todo-error" : undefined}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-r-lg flex items-center transition-colors"
          aria-label="Add todo"
        >
          <Plus size={20} />
        </button>
      </div>
      {error && (
        <p id="todo-error" className="mt-2 text-red-500 text-sm">
          {error}
        </p>
      )}
    </form>
  );
};

export default AddTodoForm;
</boltAction>

<boltAction type="file" filePath="src/components/EmptyState.tsx">
import React from 'react';
import { ClipboardList } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ClipboardList className="text-gray-300 mb-4" size={48} />
      <h3 className="text-xl font-medium text-gray-500 mb-2">No todos yet</h3>
      <p className="text-gray-400 max-w-md">
        Add your first todo to get started! Your tasks will appear here once you create them.
      </p>
    </div>
  );
};

export default EmptyState;
</boltAction>

<boltAction type="file" filePath="src/components/StorageError.tsx">
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface StorageErrorProps {
  message: string;
}

const StorageError: React.FC<StorageErrorProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
      <div className="flex items-center">
        <AlertTriangle className="text-red-500 mr-3" size={20} />
        <div>
          <p className="text-red-700 font-medium">Storage Error</p>
          <p className="text-red-600 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default StorageError;
</boltAction>

<boltAction type="file" filePath="src/components/TodoList.tsx">
import React from 'react';
import TodoItem from './TodoItem';
import EmptyState from './EmptyState';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onEdit }) => {
  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TodoList;
</boltAction>

<boltAction type="file" filePath="src/hooks/useLocalStorage.ts">
import { useState, useEffect } from 'react';
import { Todo } from '../types';

const useLocalStorage = (key: string, initialValue: Todo[]) => {
  const [storedValue, setStoredValue] = useState<Todo[]>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      setError(null);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      setError('Failed to save todos. Your changes may not be persisted.');
    }
  }, [key, storedValue]);

  return { todos: storedValue, setTodos: setStoredValue, error };
};

export default useLocalStorage;
</boltAction>

<boltAction type="file" filePath="src/App.tsx">
import React, { useCallback } from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import StorageError from './components/StorageError';
import useLocalStorage from './hooks/useLocalStorage';
import { Todo } from './types';

const App: React.FC = () => {
  const { todos, setTodos, error: storageError } = useLocalStorage('todos', []);

  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
  }, [setTodos]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, [setTodos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, [setTodos]);

  const editTodo = useCallback((id: string, newText: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  }, [setTodos]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Todo App</h1>
          <p className="text-gray-500">Manage your tasks efficiently</p>
        </div>

        {storageError && <StorageError message={storageError} />}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <AddTodoForm onAdd={addTodo} />
          <TodoList 
            todos={todos} 
            onToggle={toggleTodo} 
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>{todos.length} {todos.length === 1 ? 'task' : 'tasks'}</p>
          <p className="mt-1">Double-click a todo to edit it</p>
        </div>
      </div>
    </div>
  );
};

export default App;
</boltAction>
</boltArtifact>`)

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

// Overall flow:
// bootWebContainer()
//   .then(setupFiles)
//   .then(installDependencies)
//   .then(startDevServer)
//   .catch(err => console.error('Overall setup failed:', err));

  // const getCode = (UITemplate,enhancedPrompt) => async () => {

  //   const res = await axios.post("http://127.0.0.1:8000/api/chat/", {
  //     "enhanced_prompt": enhancedPrompt,
  //     "platform_prompt": UITemplate,
  //   });
  //   const response = res.data
  //   if (!response) {
  //     console.error("Error from server:", response.error);
  //     return response.error
  //   }
  //   else {
  //     const additionalCode = response.additionalCode
  //     setAdditionalCode(additionalCode)
  //     console.log("Additional code received:", additionalCode); 
  //     return additionalCode   
  //   }
  // }

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

  const mergedFiles =(newFiles) => {
    const merged = {...files, ...newFiles}; // Merge existing files with new ones
    setFiles(merged); // Update state with merged files
    parseFiles(merged); // Parse the updated file structure
    console.log("Merged files:", merged);
    return merged
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
        

        

        // setIsGenerating(true) // Set generating before the async operation starts
        try {
            // const res = await axios.post("http://127.0.0.1:8000/api/template/", {
            //     message: prompt,
            // })
            // const responseData = res.data; // Use a distinct variable name

            // if (responseData.error) { // Check for server-defined error
            //     console.error("Error from server:", responseData.error);
                
            // } else {
            //     console.log("Response from server:", responseData);
                
            //     // For now, assuming they are accessible in the scope
            //     const UIPrompt = responseData.filesTemplate; // Assuming this is the UI template string

            //     const enhancedPrompt = responseData.prompt
                
                // const add = await getCode(UIPrompt, enhancedPrompt)() // Call the function to get additional code

                // const a = parseUITemplate(UIPrompt) // Parse the UI template to get files

                const formattedPrompt = prompt.replace(/\\n/g, '\n');

                // Now, pass the correctly formatted string to your parser.
                const a = parseUITemplate(formattedPrompt);

                // console.log("Parsed UI Template:", a);
                
                // parseFiles(a)

                
                // const b = parseArtifact(add) // Parse the additional code to get files
                
                const b = parseArtifact(additional_code) // Parse the additional code to get files
                
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
                
                console.log("Merged files:", mergedFiles);
                
                setFiles(mergedFiles) // Set the files state with the merged files
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
            // }
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
          {/* <p>Analyzing your prompt: "{prompt}"</p> */}
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
            {/* <p className="project-prompt">"{prompt}"</p> */}
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
          <Preview url={previewUrl} />
        </aside>
      </div>
    </div>
  )
}

export default EditorPage2