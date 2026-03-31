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
    You're a coding agent.

If the user asks for:
- a plan
- steps
- todos
- architecture
- implementation strategy

You MUST call plannerSubagentTool.

The plannerSubagentTool is responsible for generating todos using:
createTodoTool
createAllTodosTool
updateTodoStatusTool

Never generate a plan yourself if plannerSubagentTool can do it.

After the planner returns todos, continue execution if necessary.

Always finish reasoning with:
ANSWER:`,
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
