# DevRipple

## Inspiration

The inspiration for DevRipple came from the desire to streamline the initial, often repetitive, stages of web development. We wanted to empower developers and creators to bring their ideas to life faster than ever before by leveraging the power of generative AI. The goal was to create a tool that could transform a simple text prompt into a functional, production-ready, full-stack web application, eliminating the need for boilerplate setup and configuration.

## What it does

DevRipple is a prompt-driven web application builder. A user starts by describing the application they want to build on the landing page (e.g., "Build a todo app with React and local storage"). DevRipple then takes this prompt and:

* **Generates a project structure**: It intelligently selects a suitable template (React.js, Node.js, or Next.js) based on the prompt.
* **Creates the code**: It uses a sophisticated AI model to generate the necessary code for components, pages, and server-side logic.
* **Provides a live development environment**: The generated project is loaded into an in-browser editor, complete with a file explorer, a code editor, and a live preview.
* **Installs dependencies and runs the app**: DevRipple automatically installs the required dependencies and starts the development server within a WebContainer, allowing the user to see their application running in real-time.

## How we built it

DevRipple is a full-stack application that seamlessly integrates a React frontend with a Django backend, powered by generative AI.

* **Frontend**: The user interface is built with **React**. We used `react-router-dom` for navigation between the landing page and the editor. The editor page features a `FileExplorer`, a `CodeEditor`, and a `Preview` component.
* **Backend**: The backend is built with **Django** and the **Django REST Framework**. It exposes API endpoints to handle prompt processing and AI-powered code generation.
* **AI & Code Generation**: We utilize the `deepseek/deepseek-r1-0528:free` model via the **OpenRouter API** for our AI capabilities. The backend has a two-step process: first, it enhances the user's initial prompt and determines the appropriate platform (React, Node, or Next.js). Then, it uses this enhanced prompt to generate the application code.
* **In-Browser Environment**: The real-time editing and preview functionality is made possible by **WebContainers**. The `EditorPage.jsx` component is responsible for mounting the generated files, installing dependencies with `npm`, and running the development server, all within the user's browser.
* **Communication**: **Axios** is used for asynchronous communication between the React frontend and the Django backend.

## Challenges we ran into

One of the primary challenges was **prompt engineering**. Crafting the perfect prompts to guide the AI model to generate accurate, functional, and well-structured code required significant experimentation. We needed to provide enough context and constraints without stifling the AI's creativity.

Another challenge was the **integration of the various components**. Getting the React frontend, Django backend, the AI API, and the WebContainer to communicate flawlessly and manage the application state effectively was a complex undertaking. Specifically, parsing the AI's output and ensuring the file structure was correctly understood by the WebContainer required careful handling of data formats.

## Accomplishments that we're proud of

We are incredibly proud of creating a functional proof-of-concept that demonstrates the power of AI in web development. The ability to go from a single text prompt to a running web application with a live preview in a matter of moments is a significant achievement.

The seamless user experience, from entering a prompt on the landing page to interacting with the live application in the editor, is another accomplishment we're proud of. The "generating" screen, which provides feedback on the application's creation process, adds a nice touch to the user journey.

## What we learned

This project was a deep dive into the practical applications of large language models in software development. We learned a great deal about prompt engineering and the nuances of interacting with AI APIs to achieve specific, structured outputs.

We also gained valuable experience with in-browser development environments. Working with WebContainers taught us a lot about virtualized environments and the intricacies of running server-side processes directly in the browser.

## What's next for DevRipple

We have a number of exciting features planned for the future of DevRipple:

* **Deployment**: A key feature on our roadmap is the ability to deploy the generated application to a cloud provider with a single click.
* **Expanded Tech Stack**: We plan to add support for more frameworks and technologies, such as Vue.js, Svelte, and different backend languages like Python and Go.
* **Interactive AI**: We envision a more interactive experience where users can "chat" with the AI to iterate on their application, asking for changes and new features in a conversational manner.
* **Saving and Versioning**: Allowing users to save their projects and have a history of their changes is another feature we plan to implement.
* **Enhanced UI/UX**: We will continue to refine the user interface, including adding more features to the code editor and improving the overall aesthetic of the application.

Of course, here are the steps to run the application in a Markdown format with code blocks.

## How to Run DevRipple

To get your local development environment set up and running, please follow the steps below. You will need to have two terminal windows open, one for the backend and one for the frontend.

### 1. Backend Setup

First, let's get the Django backend server started.

```bash
# Navigate to the backend directory
cd backend

# Install the required Python packages
# (Assuming you have a requirements.txt file)
pip install -r requirements.txt

# Start the Django development server
python manage.py runserver
```

You should see output indicating that the server is running, typically on `http://127.0.0.1:8000/`.

### 2. Frontend Setup

In your second terminal, you will set up and start the React frontend.

```bash
# Navigate to the frontend directory
cd frontend

# Install the necessary Node.js packages
npm install

# Start the frontend development server
npm run dev
```

This command will start the React development server, usually on `http://localhost:5173/` or another available port. Once both servers are running, you can open your browser to the frontend URL to start using DevRipple.
