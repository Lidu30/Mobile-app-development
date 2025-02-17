import React from 'react';
import { View, TextInput, StyleSheet } from "react-native";
import SegmentedControl from '@react-native-segmented-control/segmented-control';

export function SearchFormView(props) {
    const [text, onChangeTextACB] = React.useState(props.text || "");
    const selectedIndex = props.type ? props.dishTypeOptions.indexOf(props.type) + 1 : 0;

    function updateTextACB(newText) {
        onChangeTextACB(newText);
        props.onText(newText);
    }

    function submitTextACB() {
        props.onSearchDish();
    }

    function updateValueACB(selectedOption){
        props.onType(selectedOption);
        props.onSearchDish();
    }
    
    return (
    <View>
        <View>
            <TextInput 
                style={styles.input}
                onChangeText={updateTextACB}
                onSubmitEditing={submitTextACB}
                placeholder="Search for a dish..."
                value={text}
            />
        </View>
        
        <View>
        <SegmentedControl
            style={styles.dishTypes}
            values={['All', ...props.dishTypeOptions]}
            selectedIndex={selectedIndex}
            onValueChange={updateValueACB}
        />
        </View>
    </View>);
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
  });