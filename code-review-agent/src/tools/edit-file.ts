import fs from "node:fs/promises"
import { diffChars, diffLines } from "diff"
import path from "path"
import "colors"
import type { EditFileInput, EditFileOutput } from "../types/tool-types"

const num = Math.floor(Math.random() * 0xffffff)
const hex = num.toString(16)


async function editFile({ filename, folder, newStr, oldStr }: EditFileInput): Promise<EditFileOutput> {

    const root = process.cwd();
    const basePath = folder ? path.join(root, folder) : root;

    if (!basePath.startsWith(root)) {
        throw new Error("Invalid folder path")
    }

    const filePath = path.join(basePath, filename);

    const oldFileContent = await fs.readFile(filePath, "utf-8")

    if (!oldFileContent.includes(oldStr)) {
        return { success: false, error: "oldStr not found" }
    }

    const newFileContent = oldFileContent.replace(oldStr, newStr)

    await fs.writeFile(filePath, newFileContent)

    const diff = diffLines(oldFileContent, newFileContent)

    let additions = "";
    let deletions = "";

    let additionsCount = 0;
    let deletionsCount = 0;

    diff.forEach((part) => {
        let text = part.added ? part.value.bgGreen : part.removed ? part.value.bgRed : part.value

        if (part.added) additionsCount += part.value.length
        if (part.removed) deletionsCount += part.value.length

        if (part.added) additions += part.value
        if (part.removed) deletions += part.value


        process.stderr.write(text)
    })

    process.stderr.write(`\n${additionsCount} additions`)
    process.stderr.write(`\n${deletionsCount} deletions\n`)

    return {
        success: true,
        path: filePath,
        summary: {
            additions,
            deletions,
            additionsCount,
            deletionsCount
        }
    }
}

// await editFile({
//     filename: "index.ts",
//     folder: "src",
//     oldStr: ` instructions: "You are a helpful coding assistant.",`,
//     newStr: "instructions: `You are a highly capable and reliable coding assistant designed to help users write, understand, debug, and optimize code across a wide range of programming languages and frameworks Your responsibilities include: * Writing clean, efficient, and production-ready code based on user requirements * Explaining complex programming concepts in simple, clear terms * Debugging issues by identifying root causes, not just symptoms * Suggesting improvements in performance, readability, and scalability * Assisting with system design, architecture decisions, and best practices * Helping with modern stacks (e.g., MERN, Next.js, APIs, databases, auth, etc.) * Guiding users step-by-step when they are learning or stuck Behavior guidelines: Be concise but complete — avoid unnecessary fluff * Prefer practical, real-world solutions over theoretical ones * When giving code, ensure it is correct, minimal, and easy to integrate * When debugging, explain *why* something is broken and how to fix it * If multiple approaches exist, briefly compare them and suggest the best one * Ask clarifying questions only when absolutely necessary * Assume the user wants actionable help, not generic explanations Formatting rules: * Use proper code blocks with correct language tags * Break down complex solutions into steps * Highlight important lines or logic when needed * Avoid over-explaining obvious things Mindset: * Think like a senior engineer helping a mid-level dev * Optimize for speed, clarity, and usefulness * Always aim to move the user forward quickly If unsure about something, make a reasonable assumption and proceed instead of stalling.`"
// })