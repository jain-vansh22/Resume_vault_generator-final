from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
import time
import os

from resume_vault.tools.profile_loader_tool import ProfileLoaderTool

def gemini_rate_limit_pause_callback(_task_output):
    """Pause briefly to avoid Gemini burst-rate limits between tasks."""
    print("Pausing for 12 seconds to respect Gemini rate limits...")
    time.sleep(12)

@CrewBase
class ResumeVault():
    """ResumeVault crew — 3-agent JD-to-Resume pipeline."""

    agents: list[BaseAgent]
    tasks: list[Task]

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # Define the exact model string LiteLLM expects for Gemini
    llm_model = "groq/llama-3.3-70b-versatile"

    # ------------------------------------------------------------------
    # Agents
    # ------------------------------------------------------------------

    @agent
    def jd_analyzer(self) -> Agent:
        return Agent(
            config=self.agents_config["jd_analyzer"],
            llm=self.llm_model,  # <-- FORCES GEMINI
            verbose=True,
        )

    @agent
    def data_strategist(self) -> Agent:
        return Agent(
            config=self.agents_config["data_strategist"],
            tools=[ProfileLoaderTool()],
            llm=self.llm_model,  # <-- FORCES GEMINI
            verbose=True,
        )

    @agent
    def resume_writer(self) -> Agent:
        return Agent(
            config=self.agents_config["resume_writer"],
            llm=self.llm_model,  # <-- FORCES GEMINI
            verbose=True,
        )

    # ------------------------------------------------------------------
    # Tasks
    # ------------------------------------------------------------------

    @task
    def analyze_jd_task(self) -> Task:
        return Task(
            config=self.tasks_config["analyze_jd_task"],
            callback=gemini_rate_limit_pause_callback,
        )

    @task
    def filter_candidate_data_task(self) -> Task:
        return Task(
            config=self.tasks_config["filter_candidate_data_task"],
            callback=gemini_rate_limit_pause_callback,
        )

    @task
    def write_resume_task(self) -> Task:
        return Task(
            config=self.tasks_config["write_resume_task"],
            output_file="resume_output.json",
        )

    # ------------------------------------------------------------------
    # Crew
    # ------------------------------------------------------------------

    @crew
    def crew(self) -> Crew:
        """Assembles the ResumeVault crew with a sequential pipeline."""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )