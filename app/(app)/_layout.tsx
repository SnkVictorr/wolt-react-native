import useUserStore from "@/hooks/use-userstore";
import { Stack } from "expo-router";

/** RootNav é o componente de navegação raiz que gerencia as rotas principais */
const RootNav = () => {
  const { isGuest, user } = useUserStore();
  console.log("User State:", { isGuest, user });
  return (
    <Stack>
      {/* Rotas protegidas para usuários logados ou convidados */}
      <Stack.Protected guard={isGuest || user}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isGuest && !user}>
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default RootNav;
