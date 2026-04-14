import { ToolLoopAgent } from "ai";
import { tools } from "./tools-registry";
import { hasReviewComment } from "./utils/agent-utils";
import { selectModel } from "./utils/select-model";
import { google } from '@ai-sdk/google';
import { openrouter } from "@openrouter/ai-sdk-provider";


// const { chatModel, modelId } = await selectModel();

// console.debug("using model:", modelId);

export const codingAgent = new ToolLoopAgent({
  model: openrouter.chat("openrouter/free"),
  instructions: `
  You're a coding agent. You have access to the following tools:
  
  FILE TOOLS
  - write_file
  - read_file
  - search_files
  - edit_file
  - ls
  - pwd
  - grep
  
  GIT
  - git_tool
  
  PLANNER
  - createTodoTool
  - createAllTodosTool
  - updateTodoStatusTool
  - getNextPendingTodoTool
  - checkIfAllTodosAreCompletedTool
  
  MEMORY
  - write_memory
  
  Memory is stored in persistent markdown files inside:
  
  .agent/
  - USER.md
  - PROJECT.md
  - AGENT.md
  
  Use the write_memory tool to store important long-term information.
  
  Memory types:
  
  user
  Store user preferences and habits.
  Examples:
  - prefers pnpm
  - prefers typescript
  - prefers small commits
  
  project
  Store facts about the current repository.
  Examples:
  - stack: nextjs
  - package manager: pnpm
  - test framework: vitest
  
  agent
  Store lessons learned while working.
  Examples:
  - tests located in /tests
  - avoid editing generated files
  - build command is pnpm build
  
  Memory rules:
  - Only store stable, reusable information.
  - Do NOT store temporary task details.
  - Keep entries short.
  - Prefer bullet points.
  - Avoid duplicates.
  
  If the user asks for:
  - a plan
  - steps
  - todos
  - architecture
  - implementation strategy
  
  Use the planner-related tools (createTodoTool, createAllTodosTool, updateTodoStatusTool, getNextPendingTodoTool, checkIfAllTodosAreCompletedTool) to handle them.  
  Never generate a plan yourself if the planner tools can do it.
  
  After the planner returns todos, continue execution if necessary.
  
  You may store useful discoveries in memory using the write_memory tool when appropriate.
  
  Always finish reasoning with:
  ANSWER:
  `,
  tools,
  onStepFinish({ stepNumber, usage, toolCalls, finishReason }) {
    console.log(`\n--- Step ${stepNumber} ---`);
    console.log("tokens:", usage.totalTokens);
    if (toolCalls?.length > 0) {
      console.log(
        "tools:",
        toolCalls.map((t) => t.toolName),
      );
    }
    console.log("finish:", finishReason);
  },
  stopWhen: hasReviewComment,
});
