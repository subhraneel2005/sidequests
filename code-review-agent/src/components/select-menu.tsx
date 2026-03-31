import React, { useState } from "react";
import { Box, render, Text } from "ink";
import SelectInput from "ink-select-input";

import { OPENROUTER_FREE_MODELS } from "../../free-models";
import { openrouter } from "../config/openrouter";

type Item = {
	label: string;
	value: string;
};

export default function ModelSelect() {
	const [selectedModel, setSelectedModel] = useState<string | null>(null);

	const items: Item[] = OPENROUTER_FREE_MODELS.map((m: string) => ({
		label: m,
		value: m
	}));

	const handleSelect = (item: Item) => {
		setSelectedModel(item.value);
	};

	if (selectedModel) {
		return (
			<Box
				flexDirection="column"
				borderStyle="round"
				borderColor="green"
				paddingX={2}
				paddingY={1}
			>
				<Text color="green">✓ Model Selected</Text>

				<Box marginTop={1}>
					<Text dimColor>Model:</Text>
					<Text> {selectedModel}</Text>
				</Box>

				<Box marginTop={1}>
					<Text dimColor>Client:</Text>
					<Text> openrouter.chat()</Text>
				</Box>
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold>Select a Model</Text>
				<Text dimColor> (↑ ↓ navigate • enter select)</Text>
			</Box>

			<Box borderStyle="round" paddingX={1}>
				<SelectInput
					items={items}
					onSelect={handleSelect}
					indicatorComponent={({ isSelected }) => (
						<Text>{isSelected ? "❯" : " "}</Text>
					)}
					itemComponent={({ label, isSelected }) => (
						<Text inverse={isSelected}>
							{label}
						</Text>
					)}
				/>
			</Box>
		</Box>
	);
}

render(<ModelSelect />);