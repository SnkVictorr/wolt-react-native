import { Colors } from "@/constants/theme";
import { useRestaurantMarkers, useRestaurants } from "@/hooks/useRestaurants";
import * as Location from "expo-location";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Page = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);

  const { data: restaurant, isLoading: restaurantLoading } = useRestaurants();
  const { data: restaurantsMarkers, isLoading: markersLoading } =
    useRestaurantMarkers();

  const markers = restaurantsMarkers?.map((marker) => ({
    id: marker.id,
    systemImage: "circle.fill",
    tintColor: Colors.muted,
    coordinates: {
      latitude: marker.latitude,
      longitude: marker.longitude,
    },
    title: marker.name,
  }));

  const locateMe = async () => {
    // Pegar a localização atual do usuário
    let location = await Location.getCurrentPositionAsync();
    // Centralizar o mapa na localização do usuário
    mapRef.current?.setCameraPosition({
      coordinates: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      zoom: 14,
    });
  };

  if (restaurantLoading || markersLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  const markerSelected = (e: any) => {
    console.log(e);
  };

  if (Platform.OS === "ios") {
    return <AppleMaps.View style={{ flex: 1 }} />;
  } else if (Platform.OS === "android") {
    return <GoogleMaps.View style={{ flex: 1 }} />;
  } else {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <Text>Maps are only available on iOS and Android devices.</Text>
      </View>
    );
  }
};

export default Page;

const styles = StyleSheet.create({});
