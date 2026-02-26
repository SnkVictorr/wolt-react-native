import { Colors } from "@/constants/theme";
import { useRestaurantMarkers, useRestaurants } from "@/hooks/useRestaurants";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Page = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Ref único para ambos os mapas, já que a API de controle é a mesma no expo-maps
  const mapRef = useRef<AppleMaps.MapView | GoogleMaps.MapView>(null);

  const { data: restaurants, isLoading: restaurantsLoading } = useRestaurants();
  const { data: restaurantMarkers, isLoading: markersLoading } =
    useRestaurantMarkers();

  // Marcadores específicos para o iOS (com suporte a systemImage)
  const appleMarkers: AppleMaps.Marker[] =
    restaurantMarkers?.map((marker) => ({
      id: marker.id,
      systemImage: "circle.fill",
      tintColor: Colors.muted,
      coordinates: {
        latitude: marker.latitude,
        longitude: marker.longitude,
      },
      title: marker.name,
    })) || [];

  // Marcadores específicos para o Android (sem systemImage)
  const googleMarkers: GoogleMaps.Marker[] =
    restaurantMarkers?.map((marker) => ({
      id: marker.id,
      tintColor: Colors.muted,
      coordinates: {
        latitude: marker.latitude,
        longitude: marker.longitude,
      },
      title: marker.name,
    })) || [];

  const locateMe = async () => {
    try {
      const location = await Location.getCurrentPositionAsync();
      // O setCameraPosition funciona na mesma API para ambos no expo-maps
      mapRef.current?.setCameraPosition({
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 14,
      });
    } catch (error) {
      console.error("Failed to get location:", error);
    }
  };

  useEffect(() => {
    async function getCurrentLocation() {
      // Solicita permissão para acessar a localização do usuário
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission was not granted");
        return;
      }
      await locateMe();
    }
    getCurrentLocation();
  }, []);
  if (restaurantsLoading || markersLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color={Colors.secondary} />
      </View>
    );
  }
  // Função de callback para quando um marcador é selecionado, redireciona para a página do restaurante
  const markerSelected = (e: any) => {
    router.push(`/(modal)/(restaurant)/${e.id}`);
  };

  // Trava para rodar apenas em mobile
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return (
      <View style={styles.loadingContainer}>
        <Text>Maps are only supported on Android and iOS!</Text>
      </View>
    );
  }

  return (
    <>
      {/* Header - Funciona igual no Android e iOS */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.dismiss()}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.muted} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Link href={"/(app)/(auth)/(modal)/filter"} asChild>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="filter" size={22} />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.backButton} onPress={locateMe}>
            <Ionicons name="locate-outline" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Renderização Condicional apenas do Mapa */}
      {Platform.OS === "ios" ? (
        <AppleMaps.View
          ref={mapRef as React.RefObject<AppleMaps.MapView>}
          style={StyleSheet.absoluteFill}
          markers={appleMarkers}
          properties={{
            isTrafficEnabled: false,
            mapType: AppleMapsMapType.STANDARD,
            selectionEnabled: false,
            isMyLocationEnabled: false,
          }}
          uiSettings={{
            myLocationButtonEnabled: false,
            compassEnabled: false,
          }}
          onMarkerClick={markerSelected}
        />
      ) : (
        <GoogleMaps.View
          ref={mapRef as React.RefObject<GoogleMaps.MapView>}
          style={StyleSheet.absoluteFill}
          //
          markers={googleMarkers}
          properties={{
            isTrafficEnabled: false,
            mapType: GoogleMapsMapType.NORMAL,
            isMyLocationEnabled: false,
          }}
          uiSettings={{
            myLocationButtonEnabled: false,
            compassEnabled: false,
          }}
          onMarkerClick={markerSelected}
        />
      )}

      {/* Footer / ScrollView - Funciona igual no Android e iOS */}
      <View style={styles.footerScroll}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {restaurants?.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/(app)/(auth)/(tabs)/restaurants/[id]",
                  params: { id: restaurant.id },
                })
              }
            >
              <Image source={restaurant.image!} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {restaurant.name}
                  </Text>
                  {restaurant.tags.includes("Wolt+") && (
                    <View style={styles.woltBadge}>
                      <Text style={styles.woltBadgeText}>W+</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardDescription} numberOfLines={1}>
                  {restaurant.description}
                </Text>
                <View style={styles.cardFooter}>
                  <Ionicons name="bicycle-outline" size={14} color="#666" />
                  <Text style={styles.cardFooterText}>
                    {restaurant.deliveryFee === 0
                      ? "Free delivery"
                      : `${restaurant.deliveryFee.toFixed(2)} €`}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 2px -2px rgba(0, 0, 0, 0.1)", // Nota: no Android nativo isso pode requerer 'elevation: 4' dependendo da versão do React Native.
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerScroll: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    marginVertical: 16,
  },
  card: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 16,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)", // Nota: mesmo caso do backButton, adicione elevation: 5 se falhar visualmente no Android
    flexDirection: "row",
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    margin: 10,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    paddingLeft: 0,
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  woltBadge: {
    backgroundColor: "#009de0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  woltBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  cardDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardFooterText: {
    fontSize: 12,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
