import { ToolLoopAgent } from "ai";
import { tools } from "./tools-registry";
import { hasReviewComment } from "./utils/agent-utils";
import { selectModel } from "./utils/select-model";

const { chatModel, modelId } = await selectModel();

console.debug("using model:", modelId);

export const codingAgent = new ToolLoopAgent({
  model: chatModel,
  instructions: `
    You're a helpful coding agent.
    You have access to tools: write_file, read_file, edit_file, ls_tool, pwd_tool, search_files.
    Use these tools whenever you need to interact with files or the filesystem.
    Always call a tool if it will help complete the task. 
    Do not answer without using the tools when appropriate.
    Always finish your reasoning with a line starting with "ANSWER:".
    Do not stop until you write "ANSWER:".`,
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
