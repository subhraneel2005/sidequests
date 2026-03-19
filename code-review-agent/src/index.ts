import { ToolLoopAgent } from "ai";
import { tools } from "./tools-registry";
import { hasReviewComment } from "./utils/agent-utils";
import { selectModel } from "./utils/select-model";

const { chatModel, modelId } = await selectModel();

console.debug("using model:", modelId)

export const codingAgent = new ToolLoopAgent({
    model: chatModel,
    instructions: "You're a helpful coding agent.",

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