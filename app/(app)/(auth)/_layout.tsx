import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/location"
        options={{
          // como a tela deve ser apresentada
          presentation: "formSheet",
          // altura do modal em relacao a tela
          sheetAllowedDetents: [0.7],
          title: "",
          sheetCornerRadius: 16,
          // mostrar a barra de arrastar do modal
          sheetGrabberVisible: true,
          headerShadowVisible: false,
          // customizar o botao de fechar
          headerRight: () => (
            <TouchableOpacity
              style={{ padding: 4, borderRadius: 20 }}
              onPress={() => router.dismiss()}
            >
              <Ionicons name="close" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modal)/filter"
        options={{
          headerTransparent: false,

          headerShown: true,

          // como a tela deve ser apresentada
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          // altura do modal em relacao a tela
          sheetAllowedDetents: [0.8],
          title: "",
          // borda arredondada do modal em IOS
          sheetCornerRadius: 16,
          // mostrar a barra de arrastar do modal
          sheetGrabberVisible: true,
          headerShadowVisible: false,
          // customizar o botao de fechar
          contentStyle: {
            backgroundColor: "white",
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ padding: 4, borderRadius: 20 }}
              onPress={() => router.dismiss()}
            >
              <Ionicons name="close" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default layout;
