import React, {useState} from "react";
import {Box, render, Text, useInput} from "ink";

type Todo = {
	id: number;
	text: string;
	done: boolean;
};

export default function TodoList() {
	const [cursor, setCursor] = useState(0);

	const [todos, setTodos] = useState<Todo[]>([
		{ id: 1, text: "Analyze repository structure", done: true },
		{ id: 2, text: "Plan code changes", done: false },
		{ id: 3, text: "Write new files", done: false },
		{ id: 4, text: "Run tests", done: false },
		{ id: 5, text: "Commit changes", done: false }
	]);

	useInput((input, key) => {
		if (key.upArrow) {
			setCursor(c => Math.max(0, c - 1));
		}

		if (key.downArrow) {
			setCursor(c => Math.min(todos.length - 1, c + 1));
		}

		if (input === " " || key.return) {
			setTodos(prev =>
				prev.map((t, i) =>
					i === cursor ? {...t, done: !t.done} : t
				)
			);
		}
	});

	return (
		<Box flexDirection="column">
			<Text bold>Agent Tasks</Text>

			<Box flexDirection="column" marginTop={1}>
				{todos.map((todo, i) => {
					const selected = i === cursor;

					return (
						<Box key={todo.id}>
							<Text color={selected ? "cyan" : undefined}>
								{selected ? "❯ " : "  "}
							</Text>

							<Text dimColor={!todo.done}>
								{todo.done ? "✓" : "○"}
							</Text>

							<Text> </Text>

							<Text
								strikethrough={todo.done}
								dimColor={todo.done}
							>
								{todo.text}
							</Text>
						</Box>
					);
				})}
			</Box>

			<Box marginTop={1}>
				<Text dimColor>
					↑ ↓ navigate • space toggle
				</Text>
			</Box>
		</Box>
	);
}

render(<TodoList/>)