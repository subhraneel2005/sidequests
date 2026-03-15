
process.on("unhandledRejection", () => { });

import { LoadAPIKeyError, type ErrorHandler } from "ai";
import { codingAgent } from "..";
import type { UserInputQuery } from "../types/agent-types";
import readline from "readline"

async function runAgent({ query }: UserInputQuery) {

    try {
        const result = await codingAgent.stream({
            prompt: `Assist with user query ${query} and respond with ANSWER: [your answer]`
        })

        for await (const chunk of result.fullStream) {
            switch (chunk.type) {
                case "text-delta":
                    process.stdout.write(chunk.text);
                    break;

                case "error":
                    handleError(chunk.error)
                    return;
            }
        }

        process.stdout.write("\n")
    } catch (error) {
        handleError(error);
    }

}

function handleError(error: unknown) {
    if (
        LoadAPIKeyError.isInstance(error) ||
        (error instanceof Error && error.name === "AI_LoadAPIKeyError")
    ) {
        console.error("❌ OpenRouter API key not found.");
        console.error("Set it with:");
        console.error("export OPENROUTER_API_KEY=your_key");
        return;
    }

    console.error("❌ Agent failed:", (error as Error).message);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question(">>", async (query: string) => {
    await runAgent({ query });
    rl.close();
});