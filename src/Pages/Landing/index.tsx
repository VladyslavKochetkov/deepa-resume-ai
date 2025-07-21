import { Select } from "@inkjs/ui";
import { Box, Text } from "ink";
import { useNavigate } from "react-router";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <Box flexDirection="column">
      <Text>What are you feeling like doing today?</Text>
      <Select
        onChange={(value) => {
          navigate(value);
        }}
        options={[
          {
            value: "/create",
            label: "Create a new resume",
          },
          {
            // TODO
            value: "/edit",
            label: "Edit a past resume",
          },
        ]}
      />
    </Box>
  );
};
