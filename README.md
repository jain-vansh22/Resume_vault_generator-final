# Resume Vault Generator

An AI-powered resume builder and dynamic portfolio application. This project automates the extraction and structuring of candidate profiles into optimized resumes using AI agents, and serves the output through an interactive, highly aesthetic Next.js frontend featuring 3D visualizations and glassmorphism design.

## Architecture

This project is split into two distinct environments: an AI-driven backend engine and a modern web frontend.

### 1. AI Engine (`/src/resume_vault/`)
Built with Python, utilizing an agent-based framework to process candidate data.
*   **Agent Logic:** Configured via `agents.yaml` and `tasks.yaml`.
*   **Execution:** `crew.py` orchestrates the agents to parse data using custom tools (`profile_loader_tool.py`).
*   **Output:** Generates structured JSON files (`resume_output.json`, `candidate_profile.json`) to be consumed by the frontend.

### 2. Frontend (`/resume_frontend/`)
A responsive, interactive web application built to display the generated resumes and portfolio data.
*   **Framework:** Next.js (TypeScript) with Tailwind CSS.
*   **UI/UX:** Features interactive 3D elements (`TiltCard.tsx`), animated backgrounds (`TechBackground.tsx`), and a dark/moody color palette optimized for modern web standards.
*   **Styling:** PostCSS and custom global CSS handling layout and theme toggling.

## Project Structure

```text
Resume_vault_generator-final/
│
├── resume_frontend/                 # Next.js Application
│   ├── src/app/                     # Page routing (portfolio, presentation, standards)
│   ├── src/components/              # Reusable UI components (TiltCard, TechBackground)
│   ├── package.json                 # Node dependencies
│   └── tailwind.config.js           # Utility styling configurations
│
├── src/resume_vault/                # Python AI Processing Engine
│   ├── config/                      # Agent and task definitions
│   ├── tools/                       # Custom AI processing tools
│   ├── crew.py                      # Main agent orchestration
│   └── main.py                      # Execution entry point
│
├── knowledge/                       # User preference and prompt context
├── pyproject.toml                   # Python dependencies
└── README.md
