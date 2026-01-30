import React from "react";
import { StyleSheet, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Profile = () => {
  return (
    //  contentInsetAdjustmentBehavior serve para ajustar o conteúdo automaticamente em relação às áreas seguras (safe areas) do dispositivo, como o notch ou a barra de status.
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <Text>
        ProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfile
      </Text>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
