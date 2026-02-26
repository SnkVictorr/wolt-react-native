import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RestaurantHeaderProps {
  title: string;
  scrollOffset: SharedValue<number>;
}

// limite de scroll para trocar o header
const SCROLL_THRESHOLD = 60;

// Quando o scroll estiver entre 0 e SCROLL_THRESHOLD, o header1 vai sumindo e o header2 vai aparecendo, criando um efeito de transição suave entre os dois headers. O header1 é o header principal, que mostra a localização e os ícones de filtro e mapa. O header2 é um header menor, que aparece quando o usuário começa a rolar para baixo, mostrando apenas o título do restaurante e a localização em um formato mais compacto.
const RestaurantHeader = ({ title, scrollOffset }: RestaurantHeaderProps) => {
  const insets = useSafeAreaInsets();

  const header1Style = useAnimatedStyle(() => {
    // interpolar o valor do scroll para opacidade
    const opacity = interpolate(
      // valor do scroll
      scrollOffset.value,
      // input range
      [0, SCROLL_THRESHOLD * 0.6],
      // output range
      [1, 0],
      // Tipo de extrapolação.
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      // valor do scroll
      scrollOffset.value,
      // input range
      [0, SCROLL_THRESHOLD * 0.6],
      // output range
      [0, -10],
      // Tipo de extrapolação.
      Extrapolation.CLAMP,
    );

    return { opacity, transform: [{ translateY }] };
  });

  const header2Style = useAnimatedStyle(() => {
    // interpolar o valor do scroll para opacidade
    const opacity = interpolate(
      // valor do scroll
      scrollOffset.value,
      // input range
      [SCROLL_THRESHOLD * 0.3, SCROLL_THRESHOLD],
      // output range
      [0, 1],
      // Tipo de extrapolação.
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      // valor do scroll
      scrollOffset.value,
      // input range
      [SCROLL_THRESHOLD * 0.3, SCROLL_THRESHOLD],
      // output range
      [-10, 0],
      // Tipo de extrapolação.
      Extrapolation.CLAMP,
    );

    return { opacity, transform: [{ translateY }] };
  });

  // Para adicionar uma sombra ao header quando o usuário começar a rolar para baixo, podemos usar outro estilo animado que interpolará a opacidade da sombra com base no valor do scroll. A sombra ficará mais visível à medida que o usuário rolar para baixo, criando um efeito de profundidade.
  const shadowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      // input range(0 a 60px)
      [0, SCROLL_THRESHOLD],
      // output range
      [0, 1],
      // Tipo de extrapolação.
      Extrapolation.CLAMP,
    );

    return {
      shadowOpacity: opacity * 0.1,
      elevation: opacity * 4,
    };
  });

  return (
    <Animated.View
      style={[styles.headerContainer, shadowStyle, { paddingTop: insets.top }]}
    >
      {/* Header 1 */}
      <Animated.View style={[styles.header1, header1Style]}>
        <Link href={"/(app)/(auth)/(modal)/location"} asChild>
          <TouchableOpacity style={styles.locationButton}>
            <View style={styles.locationButtonIcon}>
              <Ionicons name="business-outline" size={16} />
            </View>
            <Text style={styles.locationButtonText}>San Francisco</Text>
            <Ionicons name="chevron-down" size={16} />
          </TouchableOpacity>
        </Link>

        <View style={styles.rightIcons}>
          <Link href={"../(modal)/filter"} asChild>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="filter" size={20} />
            </TouchableOpacity>
          </Link>
          <Link href={"../(modal)/map"} asChild>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="map-outline" size={20} />
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>

      {/* Header 2 */}
      <Animated.View style={[styles.header2, header2Style]}>
        <View style={styles.centerContent}>
          <Text style={styles.titleSmall}>{title}</Text>
          <Link href={"../(modal)/location"} asChild>
            <TouchableOpacity style={styles.locationSmall}>
              <Text style={styles.locationSmallText}>San Francisco</Text>
              <Ionicons name="chevron-down" size={14} />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.rightIcons}>
          <Link href={"../(modal)/filter"} asChild>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="filter" size={20} />
            </TouchableOpacity>
          </Link>
          <Link href={"../(modal)/map"} asChild>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="map-outline" size={20} />
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default RestaurantHeader;

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 100,
    // boxShadow: "0px 2px 4px -2px rgba(0,0,0,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  header1: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header2: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    gap: 6,
  },
  locationButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  locationButtonIcon: {
    borderRadius: 20,
    backgroundColor: Colors.light,
    padding: 10,
  },
  rightIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.light,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    paddingLeft: 40,
  },
  titleSmall: {
    fontSize: 16,
    fontWeight: "700",
    margin: 2,
  },
  locationSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  locationSmallText: {
    fontSize: 12,
    color: Colors.muted,
  },
});
