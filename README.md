# OmniAssist OS — Cross-Platform AI Assistant & Developer Console

> **Unified AI operating system designed for Windows, Android, and Web.**  
> Manages daily life tasks, schedules deep work, automates developer workflows with **GitHub, Supabase & Vercel**, runs an autonomous **E-Commerce** business, monitors **Social Media**, orchestrates **Mini-Agent Swarms**, acquires new skills via GitHub, and offers local machine control via Ollama.

---

## 🚀 Live Preview Links

- **Development URL**: [https://ais-dev-ppjonhhg62y25dwh7fhn2e-775511866980.asia-northeast1.run.app](https://ais-dev-ppjonhhg62y25dwh7fhn2e-775511866980.asia-northeast1.run.app)
- **Shared Production Preview**: [https://ais-pre-ppjonhhg62y25dwh7fhn2e-775511866980.asia-northeast1.run.app](https://ais-pre-ppjonhhg62y25dwh7fhn2e-775511866980.asia-northeast1.run.app)

---

## 📦 What Was Built

| Module | Features & Capabilities |
| :--- | :--- |
| **Cross-Platform Modes** | Switch seamlessly between **Windows Desktop** (window frame, minimize/maximize buttons, multi-column workspace) and **Android Mobile** (smartphone status bar, notch, touch navigation pill). |
| **AI Copilot & Voice** | Powered by Gemini 3.8 Flash, local **Ollama** (`localhost:11434`), or free **Groq** API. Includes Web Speech voice input and voice readback. |
| **Tasks & Life Hub** | Kanban board & List views with subtask checklists, priorities (`Urgent`, `High`, `Medium`, `Low`), category filters (`Dev`, `Personal`, `Health`), and CSV exports. |
| **Agenda & Pomodoro** | 24-hour chronological timeline, real-time current time tracker, and synthesized Web Audio Pomodoro focus timer (25m / 50m / 5m). |
| **Code Vault & Sandbox** | Searchable snippets for TypeScript, Supabase SQL, Vercel Edge, and GitHub Actions with an **interactive in-browser JavaScript sandbox runner**. |
| **Integrations Hub** | Direct dashboards for **Vercel** (deployments & logs), **Supabase** (SQL query runner & RLS audit), and **GitHub** (PRs & Action workflows). |
| **ERP Architect** | Generates full-stack multi-module ERP architectures (*Inventory, Billing, CRM, Auth*) with an **interactive visual ERD schema diagram** and SQL exports. |
| **Social Media Radar** | Multi-channel monitor for Twitter/X, LinkedIn, Reddit, and GitHub with sentiment analysis and AI viral post generator. |
| **Autonomous E-Commerce** | Live storefront catalog (*Keyboards, Headphones, Cyberdecks*), simulated customer checkout, order fulfillment, AI support desk, and restock POs. |
| **Mini-Agent Swarm** | Decomposes high-level missions across 4 specialized agents: **Planner Alpha**, **Coder Beta**, **DevOps Gamma**, and **Doctor Omega**. |
| **Skill Store & Web Search** | Dynamically imports open-source GitHub repositories as agent tools, includes a live internet browser search engine, and a 1-click self-healing doctor. |
| **Local Machine Bridge** | 1-click launcher scripts for Windows (`.bat`) and Android (`.sh`) providing machine telemetry, terminal commands, and local Ollama routing on port 39100. |

---

## 🛠️ Prerequisites & Requirements

Before running or hosting:
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **bun** or **pnpm**
- **Google Gemini API Key**: [Get a free key from Google AI Studio](https://aistudio.google.com/)

---

## 💻 How to Run Locally (Windows / Mac / Linux / Android)

### 1. Clone & Install Dependencies
\`\`\`bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
\`\`\`

### 2. Configure Environment Variables
Create a \`.env\` file in the project root:
\`\`\`env
# Required for Gemini AI assistant and ERP/code synthesis
GEMINI_API_KEY="your-gemini-api-key-here"

# Port (Defaults to 3000)
PORT=3000
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
Open your browser at **\`http://localhost:3000\`**.

### 4. (Optional) Run the Local Machine Agent Daemon
If you want the assistant to execute local terminal commands or connect to your local Ollama instance on Windows/Android:
- On Windows: Double-click \`start-omni-agent.bat\` (or click **Download Windows Launcher** inside the Machine tab).
- On Android (Termux) / Linux: Run \`bash start-omni-agent.sh\`.
- Or run with node: \`node omni-agent-daemon.js\`.

---

## 🌐 How to Host & Deploy

### Option A: Deploy to Vercel (Recommended for Frontend & Serverless)

1. Push your code to your GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set the Build and Output settings:
   - **Framework Preset**: Vite
   - **Build Command**: \`npm run build\`
   - **Output Directory**: \`dist\`
5. In **Environment Variables**, add:
   - \`GEMINI_API_KEY\` = \`your_gemini_api_key\`
6. Click **Deploy**. Vercel will give you a live production URL (e.g. \`https://omniassist.vercel.app\`).

---

### Option B: Deploy to Railway / Render / Cloud Run (Full-Stack Node Server)

Because the app includes a full Express server in \`server.ts\` that serves both the API endpoints and the built frontend:

1. In Railway or Render, create a new **Web Service** from your GitHub repo.
2. Configure:
   - **Build Command**: \`npm run build\`
   - **Start Command**: \`npm run start\` (or \`npx tsx server.ts\`)
3. Add the \`GEMINI_API_KEY\` environment variable.
4. Deploy! Your full-stack assistant will be live with all backend API endpoints.

---

### Option C: Run on Android (via Termux)

1. Install **Termux** from F-Droid.
2. Install Node.js & Git:
   \`\`\`bash
   pkg update && pkg install nodejs git
   \`\`\`
3. Clone and run:
   \`\`\`bash
   git clone <your-repo-url>
   cd <your-repo-name>
   npm install
   npm run build
   node server.ts
   \`\`\`
4. Open Chrome on Android at \`http://localhost:3000\`, tap the 3 dots, and tap **"Install App"** / **"Add to Home Screen"** to use it as a native Android PWA!
