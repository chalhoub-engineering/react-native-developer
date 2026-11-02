import { Image } from "expo-image";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type ImageLightboxProps = {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
};

export function ImageLightbox({ visible, imageUrl, onClose }: ImageLightboxProps) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop} testID="lightbox">
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.close} testID="lightbox-close">
          <Text style={styles.closeLabel}>Close</Text>
        </Pressable>
        {imageUrl ? (
          <Image contentFit="contain" source={{ uri: imageUrl }} style={styles.image} />
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "#111111",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  close: {
    position: "absolute",
    right: 20,
    top: 56,
    zIndex: 1,
  },
  closeLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    height: "70%",
    width: "100%",
  },
});
