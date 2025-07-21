import { IconSymbol } from "@/components/ui/IconSymbol";
import { dummyData } from "@/lib/dummy-list-data";
import { LegendList, useViewability, ViewabilityConfig } from "@legendapp/list";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const viewabilityConfig: ViewabilityConfig = {
  id: "feed",
  itemVisiblePercentThreshold: 80,
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <LegendList
        data={dummyData}
        recycleItems
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id.toString()}
        renderItem={Item}
      />
    </View>
  );
}

type ItemType = {
  id: number;
  name: string;
  mediaUrl: string;
  mediaType: "image" | "video";
};

function Item({ item }: { item: ItemType }) {
  return (
    <View style={styles.post}>
      <Text>post {item.id}</Text>
      <View style={styles.mediaContainer}>
        <Media url={item.mediaUrl} mediaType={item.mediaType} />
      </View>
    </View>
  );
}

function Media({
  url,
  mediaType,
}: {
  url: string;
  mediaType: "image" | "video";
}) {
  const [isVisible, setIsVisible] = useState(false);

  useViewability((viewToken) => {
    setIsVisible(viewToken.isViewable);
  }, "feed");

  const isVideo = mediaType === "video";

  if (isVideo) {
    return (
      <View>
        <Video
          source={{ uri: url }}
          style={styles.media}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={isVisible}
        />
        <View style={styles.videoIcon}>
          <IconSymbol name="video" size={24} color="white" />
        </View>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: url }}
      style={styles.media}
      recyclingKey={url}
      contentFit="cover"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  post: {
    flex: 1,
    padding: 10,
  },
  mediaContainer: {
    aspectRatio: 1,
  },
  videoContainer: {
    position: "relative",
  },
  media: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  videoIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});
