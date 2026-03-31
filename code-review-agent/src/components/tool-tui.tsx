import React from "react";
import { Box, render, Text } from "ink";

type ToolStatus = "running" | "success" | "error";

type Props = {
	name: string;
	args?: Record<string, any>;
	status: ToolStatus;
	output?: string;
};

export default function ToolExecution({ name, args, status, output }: Props) {
	const color =
		status === "running" ? "yellow" :
		status === "success" ? "green" : "red";

	const icon =
		status === "running" ? "●" :
		status === "success" ? "✓" : "✕";

	return (
		<Box flexDirection="column" marginBottom={1}>
			<Box>
				<Text color={color}>{icon}</Text>
				<Text> </Text>
				<Text bold>{name}</Text>
				<Text dimColor> tool</Text>
				<Text dimColor>  ·  {status}</Text>
			</Box>

			{args && (
				<Box flexDirection="column" marginLeft={2}>
					<Text dimColor>args</Text>
					{Object.entries(args).map(([key, value]) => (
						<Text key={key}>
							<Text dimColor>{key}:</Text>{" "}
							<Text color="cyan">{String(value)}</Text>
						</Text>
					))}
				</Box>
			)}

			{output && (
				<Box flexDirection="column" marginLeft={2}>
					<Text dimColor>output</Text>
					<Text>{output}</Text>
				</Box>
			)}
		</Box>
	);
}

render(<ToolExecution name="edit_file" status="running"/>)