import { ToolLoopAgent } from "ai";
import { tools } from "./tools-registry";
import { hasReviewComment } from "./utils/agent-utils";
import { selectModel } from "./utils/select-model";

const { chatModel, modelId } = await selectModel();

console.debug("using model:", modelId)

export const codingAgent = new ToolLoopAgent({
    model: chatModel,
    instructions: "You are a helpful coding assistant.",
    tools,
    onStepFinish({ toolCalls, toolResults, usage, warnings, sources, stepNumber, finishReason }) {
        console.log("\n========== Step", stepNumber, "==========");

        // --- Token Usage ---
        console.log("Input tokens:        ", usage.inputTokens);
        console.log("Output tokens:       ", usage.outputTokens);
        console.log("Total tokens:        ", usage.totalTokens);

        // --- Input token breakdown (context details) ---
        console.log("  Non-cached tokens: ", usage.inputTokenDetails?.noCacheTokens);
        console.log("  Cache read tokens: ", usage.inputTokenDetails?.cacheReadTokens);
        console.log("  Cache write tokens:", usage.inputTokenDetails?.cacheWriteTokens);

        // --- Output token breakdown ---
        console.log("  Text tokens:       ", usage.outputTokenDetails?.textTokens);
        console.log("  Reasoning tokens:  ", usage.outputTokenDetails?.reasoningTokens);

        // --- Raw provider usage (provider-specific, e.g. Anthropic/OpenAI) ---
        console.log("Raw usage:           ", usage.raw);

        // --- Step metadata ---
        console.log("Finish reason:       ", finishReason);
        console.log("Tool calls:          ", toolCalls);
        console.log("Tool results:        ", toolResults);
        console.log("Warnings:            ", warnings);
        console.log("Sources:             ", sources);
    },
    stopWhen: hasReviewComment,
})