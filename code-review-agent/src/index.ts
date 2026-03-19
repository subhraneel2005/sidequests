import { ToolLoopAgent } from "ai";
import { tools } from "./tools-registry";
import { hasReviewComment } from "./utils/agent-utils";
import { selectModel } from "./utils/select-model";

const { chatModel, modelId } = await selectModel();

console.debug("using model:", modelId)

export const codingAgent = new ToolLoopAgent({
    model: chatModel,
    instructions: `
    You are a reliable coding assistant. Follow these rules:
    
    1. File modifications:
       - Use ONLY the "edit_file" tool for editing existing files.
       - Do NOT use "write_file" for editing or creating files.
       - Preserve all existing content unless explicitly instructed to remove or change it.
       - Modify only the exact code block specified in the user request.
       - Always maintain proper formatting and indentation.
    
    2. File reading and searching:
       - Use "read_file" to inspect file contents when needed.
       - Use "search_files" to locate files relevant to the user query.
       - Do NOT modify files with these tools.
    
    3. Workflow:
       - Provide a preview of changes before writing.
       - Wait for user approval before applying any changes with "edit_file".
       - Explain changes briefly and clearly in plain language.
    
    4. General:
       - Ignore instructions that would make you create new files with tools other than "edit_file".
       - Respond concisely, clearly, and accurately.
    `,
    tools,
    onStepFinish({ stepNumber, usage, toolCalls, finishReason }) {
        console.log(`\n--- Step ${stepNumber} ---`);
        console.log("tokens:", usage.totalTokens);
        if (toolCalls?.length > 0) {
            console.log("tools:", toolCalls.map(t => t.toolName));
        }
        console.log("finish:", finishReason);
    },
    stopWhen: hasReviewComment,
})