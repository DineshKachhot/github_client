import {
  ActivityIndicator,
  Button,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import favoriteStore from "./redux/FavoriteStore";
import { addFavorite, removeFavorite } from "./redux/FavoriteSlice";
import { fetchUser } from "./api/api";

const DevDetail = ({ route, navigation }: { route: any; navigation: any }) => {
  const { item } = route.params;
  const [favorite, setFavorite] = useState(
    favoriteStore.getState().favorites.includes(item.login)
  );

  const { isLoading, error, data } = useQuery<DeveloperDetails>({
    queryKey: ["detail " + item.login],
    queryFn: () => fetchUser(item.login),
  });

  useEffect(() => {
    navigation.setOptions({
      title: item.login,
      headerRight: () => (
        <Ionicons
          name={favorite ? "heart-dislike" : "heart"}
          size={24}
          color="blue"
          onPress={() =>
            favorite
              ? favoriteStore.dispatch(removeFavorite(item.login))
              : favoriteStore.dispatch(addFavorite(item.login))
          }
        />
      ),
    });
  }, [favorite]);

  useEffect(() => {
    favoriteStore.subscribe(() => {
      setFavorite(favoriteStore.getState().favorites.includes(item.login));
    });
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>{error.message}</Text>;
  }
  return (
    <View>
      {data && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: data.avatar_url }} style={styles.image} />
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.email}>{data.email}</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.title}>{`Followers: `}</Text>
              <Text style={styles.value}>{data.followers}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>{`Following: `}</Text>
              <Text style={styles.value}>{data.following}</Text>
            </View>

            {data.location && (
              <View style={styles.row}>
                <Text style={styles.title}>{`Location: `}</Text>
                <Text style={styles.value}>{data.location}</Text>
              </View>
            )}
            {data.blog && (
              <View style={styles.row}>
                <Text style={styles.title}>{`Blog: `}</Text>
                <Text
                  onPress={() => Linking.openURL(data.blog)}
                  style={styles.link}
                >
                  {data.blog}
                </Text>
              </View>
            )}
            {data.email && (
              <View style={styles.row}>
                <Text style={styles.title}>{`Email: `}</Text>
                <Text
                  onPress={() => Linking.openURL(data.email)}
                  style={styles.link}
                >
                  {data.email}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default DevDetail;

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
  card: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "gray",
  },
  row: { flexDirection: "row", alignItems: "center" },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
