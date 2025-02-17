import { ScrollView, View, Text, StyleSheet, Pressable, Linking, FlatList } from "react-native";
import { Image } from "expo-image"

export function DetailsView(props) {

    function openMoreInfoACB() {
        if (props.dishData.sourceUrl) {
            Linking.openURL(props.dishData.sourceUrl);
        }
    }

    function addDishToMenuACB(){
        props.userWantsToAddDish()
    }

    function renderIngredientCB(element) {
        const ingr= element.item;
            return (
                <Text>{ingr.amount.toFixed(2)} {ingr.unit} {ingr.name}</Text>
            );
    }

    function renderInstructionsCB(element) {
        const instr = element.item;
        return <Text>{instr.number}. {instr.step}</Text>
    }

    return (<ScrollView>
        <Text style={styles.title}>{props.dishData.title}</Text>

        <Image source={{ uri: props.dishData.image }} style={styles.image} />

        <View style={"/* TODO */"}>
            <Pressable 
                role="button"
                disabled={props.isDishInMenu} 
                onPress={addDishToMenuACB}
            >
                <Text>{props.isDishInMenu? "Added to menu" : "Add to menu"}</Text>
            </Pressable>

            <Pressable 
                role="button" 
                onPress={openMoreInfoACB}
            >
                <Text>More info</Text>
            </Pressable>

            <Pressable onPress={"/* TODO */"}>
                <Text>Cancel</Text>
            </Pressable>
        </View>

        <View style={styles.card}>
            <Text style= {styles.header}>Price Information</Text>
            <Text>Price per serving: {props.dishData.pricePerServing.toFixed(2)}</Text>
            <Text>Total for {props.guests} guests: {(props.dishData.pricePerServing * props.guests).toFixed(2)}</Text>
        </View>

        <View>
            <Text style={styles.header}>Ingredients</Text>
            {"/*TODO: flatlist? */"}
            <FlatList 
                data={props.dishData.extendedIngredients}
                renderItem={renderIngredientCB}
                keyExtractor={item => item.id}
            />
        </View>

        <View>
            <Text style={styles.header}>Instructions</Text>
            <FlatList 
                data={props.dishData.analyzedInstructions[0].steps}
                renderItem={renderInstructionsCB}
                keyExtractor={item => item.id}
            />
        </View>

    </ScrollView>);
}

const styles = StyleSheet.create({
    input: {
      backgroundColor: "white",
      borderRadius: 8,
      margin: 12,
      padding: 8,
    },
    dishTypes: {
        borderRadius: 8,
        margin: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    header: {
        fontSize: 15,
        fontWeight: "bold",
    },
    card: {
        padding: 10,
        backgroundColor: "#ffffff",
        borderRadius:8,
        marginVertical: 8,
    },
  });