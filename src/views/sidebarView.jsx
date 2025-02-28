import {Button, FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import {sortDishes, dishType, menuPrice, getCardStyle } from "src/utilities";
import {router} from "expo-router"

export function SidebarView(props){
  function removePersonACB() {
    //console.log("Remove person");
    props.onNumberChange(props.number - 1)
  };

  function addPersonACB() {
    //console.log("Add person");
    props.onNumberChange(props.number + 1)
  };
  
  function renderItemCB(element) {
    const dish = element.item
    
    function displayDishACB() {
      // console.log(dish);
      props.onDishInterest(dish)
      router.push('/details')
    }
  
    function removeDishACB() {
      //console.log("Remove selected dish");
      props.onDishRemove(dish)
    }

    return (
      <Pressable onPress={displayDishACB} testID="sidebar-row" style={styles.card}>
        <View style={styles.dishRow}>
          <View style={styles.dishNameContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.dishName}>{dish.title}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail">{dishType(dish)}</Text>
          </View>
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.dishPrice}>${(dish.pricePerServing * props.number /100).toFixed(2)}</Text>
            </View>
            <Pressable onPress={removeDishACB} testID="sidebar-row-remove">
              <Text style={styles.x}>✕</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View>
      <View style={styles.guestRow}>
        <Button title="-" disabled={props.number === 1} onPress={removePersonACB}></Button>
        <Text style={styles.text}>{props.number} {props.number === 1 ? "Guest" : "Guests"}</Text>
        <Button title="+" onPress={addPersonACB}></Button>
      </View>

      <FlatList
        data={sortDishes(props.dishes)}
        renderItem={renderItemCB}
        keyExtractor={item => item.id} 
      /> 
      
      <View style={styles.dishRow}>
        <Text>Total: </Text>
        <Text style={styles.dishName}>${(menuPrice(props.dishes)*props.number/100).toFixed(2)}</Text>
      </View>     
    </View>
  );
}

// Basic style
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 8,
    margin: 8,
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    alignItems: "center",
    padding: 8,
    margin: 8,
  },
  dishRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    justifyContent: "space-between",
  },
  card: {
    ...getCardStyle(),
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius:8,
    marginVertical: 8,
    margin: 8,
  },
  dishNameContainer: {
    flex: 1,
    marginRight: 8, 
  },
  dishName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  dishPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 15,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexShrink: 0,
    marginLeft: 8,
  },
  text: {
    marginHorizontal: 16,
  },
  x: {
    fontWeight: "bold",
    fontSize: 20,
    color: "red",
  },
});