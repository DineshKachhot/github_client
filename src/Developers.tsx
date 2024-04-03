import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useInfiniteQuery } from "@tanstack/react-query";
import favoriteStore from "./redux/FavoriteStore";
import { fetchUsers } from "./api/api";

const Developers = ({ navigation }: { navigation: any }) => {
  const {
    isLoading,
    error,
    data: users,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["developers"],
    queryFn: fetchUsers,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage[lastPage.length - 1].id,
  });

  const developerItem = ({ item }: { item: Developer }) => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          navigation?.navigate("Details", { item: item });
        }}
        key={item.id}
      >
        <Image source={{ uri: item.avatar_url }} style={styles.image} />
        <View>
          <Text style={styles.text}>{item.login}</Text>
          <Text style={styles.subText}>{item.type}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error</Text>;

  const _users = users?.pages.flatMap((page) => page) ?? [];
  return (
    <View>
      <StatusBar style="auto" />
      {_users?.length > 0 && (
        <FlatList
          keyExtractor={(item, index) => item.id.toString() + index}
          data={_users}
          renderItem={developerItem}
          onEndReached={() => fetchNextPage()}
          ListFooterComponent={() =>
            isFetchingNextPage && <ActivityIndicator />
          }
          ListFooterComponentStyle={{ paddingVertical: 20 }}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

export default Developers;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
