import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { AuthContext } from "../store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function WelcomeScreen() {
  const authContext = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = authContext.token;

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        "https://expensetracker-9fde8-default-rtdb.firebaseio.com/message.json?auth=" +
          token
      )
      .then((res) => {
        setMessage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        authContext.authenticate(null);
        AsyncStorage.removeItem("token");
      });
  }, [token]);

  if (loading) {
    return <LoadingOverlay message={"Data is being fetched..."} />;
  }

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
      <Text>{message}</Text>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
