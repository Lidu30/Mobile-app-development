import { FlatList, StyleSheet, Text, View, ScrollView } from "react-native";
// un-comment when needed:
import { sortIngredients, getCardStyle } from "src/utilities";

/* Functional JSX component. Name must start with capital letter */
export function SummaryView(props) {
  return (
    <View style={styles.container}>
      {/* TW 1.2 note the syntax: {JS_expression_or_comment} */}
      <Text>
        Summary for <Text>{props.people}</Text> persons:
      </Text>

      {/* testID="summary-row" */}
      <View style={styles.card}>
        {/*
        <View  style={styles.row}>
          <Text>Name</Text>
          <Text>Aisle</Text>
          <Text>Quantity</Text>
        </View>
        */}
        
        <FlatList 
          data={sortIngredients(props.ingredients)}
          renderItem={renderIngredientRowCB}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );

  /* Callback for rendering each ingredient row - implement in TW 1.3 */
  function renderIngredientRowCB(element) {
    const ingr= element.item;    // FlatList sends objects with a property called item
    return (
      <View testID="summary-row" style={styles.row}>
        <View>
          <Text style={styles.ingredient}>{ingr.name}</Text>
          <Text>{ingr.aisle}</Text>
        </View>
        <View>
          <Text style={styles.ingredientAmount}>{(props.people * ingr.amount).toFixed(2)} {ingr.unit}</Text>
        </View>
      </View>
    );
  }
}


// Basic styles to get started
const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    padding: 8,
    justifyContent: "space-between",
  },
  ingredient:{
    fontSize: 17,
    fontWeight: "bold",
  },
  ingredientAmount:{
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
  },
});
