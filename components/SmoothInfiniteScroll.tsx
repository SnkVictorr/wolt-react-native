import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
const iconDataSets = {
  set1: [
    { emoji: "🍕", color: "#FFE5CC" },
    { emoji: "🍔", color: "#F4D03F" },
    { emoji: "🍟", color: "#F8D7DA" },
    { emoji: "🌮", color: "#D5EDDA" },
    { emoji: "🍗", color: "#FADBD8" },
  ],
  set2: [
    { emoji: "🎮", color: "#D1ECF1" },
    { emoji: "🎧", color: "#E2E3E5" },
    { emoji: "☕", color: "#F4D03F" },
    { emoji: "🍿", color: "#FFE5CC" },
    { emoji: "🥤", color: "#F8D7DA" },
  ],
  set3: [
    { emoji: "🍰", color: "#FADBD8" },
    { emoji: "🍦", color: "#D1ECF1" },
    { emoji: "🍪", color: "#FFE5CC" },
    { emoji: "🎲", color: "#D5EDDA" },
    { emoji: "🕹️", color: "#E2E3E5" },
  ],
};  

const ITEM_HEIGHT = 160;
const SCROLL_SPEED = 20; // pixels per second
const GAP = 10; // gap between items from styles
const FRAME_RATE = 60; // frames per second

interface SmoothInfiniteScrollProps {
  scrollDirection?: "up" | "down";
  iconSet?: "set1" | "set2" | "set3";
}

const SmoothInfiniteScroll = ({
  scrollDirection = "down",
  iconSet = "set1",
}: SmoothInfiniteScrollProps) => {
  // Referência animada do scroll
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  // useSharedValue serves para armazenar o valor atual do scroll
  const scrollY = useSharedValue(0);
  const iconData = iconDataSets[iconSet];
  const items = [...iconData, ...iconData]; // Duplicate for seamless scroll
  const totalContentHeight = iconData.length * ITEM_HEIGHT; // Altura total do conteúdo
 
  useEffect(() => {
    // Inicializa a posição do scroll com base na direção
    if (scrollDirection === "up") {
      scrollY.value = totalContentHeight;
    } else {
      scrollY.value = 0;
    }
    // Configura o intervalo para atualizar a posição do scroll
    const interval = setInterval(() => {
      
      const increment =
        (SCROLL_SPEED / FRAME_RATE) * (scrollDirection === "up" ? -1 : 1);
      scrollY.value += increment;
    }, 1000 / SCROLL_SPEED);

    return () => clearInterval(interval);
  }, [scrollDirection]);

  // Reage às mudanças em scrollY e atualiza a posição do scroll
  useAnimatedReaction(
    // Retorna o valor atual do scroll
    () => scrollY.value,
    // Atualiza a posição do scroll com base no valor de scrollY
    (y) => {
      if (scrollDirection === "down") {
        if (y >= totalContentHeight) {
          scrollY.value = 0;
          scrollTo(scrollRef, 0, 0, false);
        } else {
          scrollTo(scrollRef, 0, y, false);
        }
      } else {
        if (y <= 0) {
          scrollY.value = totalContentHeight;
          scrollTo(scrollRef, 0, totalContentHeight, false);
        } else {
          scrollTo(scrollRef, 0, y, false);
        }
      }
    },
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((item, index) => (
        <View
          key={index}
          style={[styles.iconContainer, { backgroundColor: item.color }]}
        >
          <Text style={{ fontSize: 40 }}>{item.emoji}</Text>
        </View>
      ))}
    </Animated.ScrollView>
  );
};

export default SmoothInfiniteScroll;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 20,
  },
  iconContainer: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginBottom: GAP,
    width: 160,
    marginHorizontal: 5,
    boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
  },
});
