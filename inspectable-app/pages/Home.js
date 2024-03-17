import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const issues = [
  { id: 1, issueName: "Leaky faucet" },
  { id: 2, issueName: "Broken window" },
];

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Inspectable</Text>
      </View>
      <ScrollView style={styles.issuesList}>
        {issues.map((issue) => (
          <TouchableOpacity
            key={issue.id}
            onPress={() =>
              navigation.navigate("IssueDetail", {
                issueId: issue.id,
                issueName: issue.issueName,
              })
            }
          >
            <View style={styles.issueItem}>
              <Text style={styles.issueText}>
                ID: {issue.id} - {issue.issueName}
              </Text>
              <Text style={styles.issueAction}>{">"}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("IssueAdd")}
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
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  navTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
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
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
