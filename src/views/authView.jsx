import { View, TextInput, Button, Text, StyleSheet, Pressable } from "react-native"
import { getCardStyle } from "src/utilities"

export function AuthView(props) {
  function renderError() {
    if (!props.error) return null;
    return <Text style={styles.error}>{props.error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {props.isSignUp ? "Sign Up" : "Sign In"}
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={props.email}
          onChangeText={props.onEmailChange}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={props.password}
          onChangeText={props.onPasswordChange}
          secureTextEntry
        />
        
        {renderError()}
        
        <Button
          title={props.isSignUp ? "Sign Up" : "Sign In"}
          onPress={props.onSubmit}
        />
        
        <Pressable onPress={props.onToggleMode}>
          <Text style={styles.switchText}>
            {props.isSignUp 
              ? "Already have an account? Sign In" 
              : "Don't have an account? Sign Up"}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    ...getCardStyle(),
    padding: 30,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  switchText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 20,
  },
})