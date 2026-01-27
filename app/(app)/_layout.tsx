import { Stack } from "expo-router";

/** RootNav é o componente de navegação raiz que gerencia as rotas principais */
const RootNav = () => {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootNav;
