import { Colors } from "@/constants/theme";
import { useRestaurants } from "@/hooks/useRestaurants";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const RestaurantList = () => {
  const { data: restaurants, isLoading, error } = useRestaurants();

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size={"large"} color={Colors.secondary} />
      </View>
    );
  }

  const safeRestaurants = Array.isArray(restaurants) ? restaurants : [];

  if (error || safeRestaurants.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          padding: 24,
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Ionicons name="restaurant-outline" size={44} color={Colors.muted} />
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#111" }}>
          Nenhum restaurante encontrado
        </Text>
        <Text
          style={{ fontSize: 14, color: Colors.muted, textAlign: "center" }}
        >
          Verifique sua conexão e tente novamente em instantes.
        </Text>
      </View>
    );
  }
  return (
    <>
      {safeRestaurants.map((item) => (
        <View key={item.id}>
          <Link
            href={{
              pathname: `/(app)/(auth)/(modal)/(restaurant)/[id]`,
              params: { id: item.id },
            }}
            asChild
          >
            <TouchableOpacity style={styles.card}>
              <Image source={item.image!} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              <View style={styles.metadata}>
                <Ionicons
                  name="bicycle-outline"
                  size={16}
                  color={Colors.muted}
                />
                <Text style={styles.metadataText}>
                  €{item.deliveryFee.toFixed(2)}
                </Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.metadataText}>
                  €{item.deliveryFee.toFixed(2)}
                </Text>
                <Text style={styles.dot}>•</Text>
                <Ionicons name="happy-outline" size={16} color={Colors.muted} />
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      ))}
    </>
  );
};

export default RestaurantList;

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light,
    overflow: "hidden",
    boxShadow: "0px 4px 2px -2px rgba(0, 0, 0, 0.2)",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.muted,
  },
  metadata: {
    borderTopColor: Colors.light,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 10,
  },
  metadataText: {
    fontSize: 13,
    color: Colors.muted,
  },
  dot: {
    fontSize: 13,
    color: "#999",
  },
});
