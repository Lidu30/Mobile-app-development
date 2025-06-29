import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { Image } from "expo-image"
import { router } from "expo-router"
import { getCardStyle } from "src/utilities"

export function SearchResultsView(props) {
  function renderSearchResult(element) {
    const dish = element.item

    function viewDishACB() {
      props.dishChosen(dish)
      router.push("/details")
    }

    return (
      <Pressable
        role="button"
        style={styles.dishContainer}
        onPress={viewDishACB}
      >
        <View>
          <Image style={styles.image} source={{ uri: dish.image }} />
        </View>

        <View>
          <Text style={styles.dishName} numberOfLines={3}>
            {dish.title}
          </Text>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={props.searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        // automatically when the user scrolls to 50% before the end
        onEndReached={props.loadMoreResults}
        onEndReachedThreshold={0.5}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  dishContainer: {
    ...getCardStyle(),
    flex: 1,
    margin: 8,
  },

  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    margin: 4,
    alignSelf: "center",
  },

  dishName: {
    textAlign: "center", // Center-align the dish name
  },
})

