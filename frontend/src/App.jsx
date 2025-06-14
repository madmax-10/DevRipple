import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import EditorPage from './components/EditorPage'
import './App.css'
import EditorPage2 from './components/EditorPage2'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage2 />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App