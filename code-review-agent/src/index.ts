import { openrouter } from "@openrouter/ai-sdk-provider";
import { ToolLoopAgent } from "ai";
import { tools } from "./tools-registry";
import { hasReviewComment } from "./utils/agent-utils";
import type { UserInputQuery } from "./types/agent-types";



export const codingAgent = new ToolLoopAgent({
    model: openrouter(""),
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
    stopWhen: hasReviewComment
})

// usage

// const parsedInput = AgentInputSchema.parse(userInput);
// const result = await codeReviewAgent.run({
//   input: parsedInput
// });

// ----------------

/*  we dont need to send all the files in the embedding pipeline,
instead we should create a sub-agent that will
take the whole repo tree structure and it will decide and return the imp file paths */

// obvious skips are: node_modules, dist, lockfiles, staic assests, .agent, .claude, .cursor, .claude_code, like this.
//  but dont skip .github as ci/cd files can be present there

// get data to create embeddings
// repo --> all files --> file path --> single file --> content data 
