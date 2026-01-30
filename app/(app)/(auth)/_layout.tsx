import { Stack } from "expo-router";
import React from "react";

const layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default layout;
