import React, { useState } from "react";
import { render, Box, Text } from "ink";
import TextInput from "ink-text-input";

export const PromptInput = ({
  onSubmit
}: {
  onSubmit: (value: string) => void
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (val: string) => {
    onSubmit(val);
  };

  return (
    <Box flexDirection="column">
      <Text>Enter prompt:</Text>
      <Box borderStyle="round" borderColor="whiteBright" borderDimColor>
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="Type your prompt..."
        />
      </Box>
    </Box>
  );
};
