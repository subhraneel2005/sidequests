
process.on("unhandledRejection", () => { });

import { LoadAPIKeyError, type ErrorHandler } from "ai";
import { codingAgent } from "..";
import type { UserInputQuery } from "../types/agent-types";
import readline from "readline"
import type { EditFileInput, EditFileOutput } from "../types/tool-types";
import { askUser } from "../utils/ask-user";
import { editFile } from "../tools/edit-file";
import { printDiff } from "../utils/print-diff";

type EditFileResultWithInput = EditFileOutput & { _input: EditFileInput }

async function runAgent({ query }: UserInputQuery) {

    const editToolResults: EditFileResultWithInput[] = []


    try {
        const result = await codingAgent.stream({
            prompt: `Assist with user query ${query} and respond with ANSWER: [your answer]`
        })

        console.debug("model using: ",)

        for await (const chunk of result.fullStream) {
            switch (chunk.type) {
                case "text-delta":
                    process.stdout.write(chunk.text);
                    break;

                case "tool-result": {

                    if (chunk.toolName === "edit_file") {
                        editToolResults.push({
                            ...chunk.output as EditFileOutput,
                            _input: chunk.input as EditFileInput
                        })
                    }

                }
            }
        }

        process.stdout.write("\n")

        for (const output of editToolResults) {
            if (output.success && output.needsApproval) {
                printDiff(output.preview!)
                const answer = await askUser("Apply changes? (y/n): ")
                if (answer === "y" || answer === "yy") {
                    await editFile({ ...output._input, isApproved: true })  // use stored input
                    console.log("✅ Changes applied")
                } else {
                    console.log("❌ Changes cancelled")
                }
            }
        }

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

