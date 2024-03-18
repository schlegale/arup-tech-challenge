import React, { useEffect, useState, useCallback } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { CONSTANTS } from "../constants";
import { useFocusEffect } from "@react-navigation/native";

export default function Home({ navigation }) {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(CONSTANTS.API_ENDPOINTS.ISSUES);
      setIssues(response.data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchIssues();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.navBar, { backgroundColor: "#1dcaff" }]}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.navTitle}>Inspectable</Text>
      </View>
      <ScrollView style={styles.issuesList}>
        {issues.map((issue) => (
          <TouchableOpacity
            key={issue.id}
            onPress={() => navigation.navigate("Details", { issue })}
          >
            <View style={styles.issueItem}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.issueText}>{issue.id}</Text>
                <Text style={[styles.issueText, { paddingLeft: 20 }]}>
                  {issue.title}
                </Text>
              </View>
              <Text style={styles.issueAction}>{">"}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: "#1dcaff" }]}
        onPress={() => navigation.navigate("Add")}
      >
        <Text style={styles.addButtonText}>Add Issue</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navBar: {
    height: 60,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  navTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    paddingLeft: 10,
  },
  logo: {
    width: 20,
    height: 20,
  },
  issuesList: {
    flex: 1,
    width: "100%",
  },
  issueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  issueText: {
    fontSize: 16,
  },
  issueAction: {
    fontSize: 16,
    fontWeight: "500",
  },
  addButton: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: "80%",
    alignSelf: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
