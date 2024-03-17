import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const IssueDetail = ({ route, navigation }) => {
  const { issueId, issueName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Issue Details</Text>
      <Text style={styles.detail}>ID: {issueId}</Text>
      <Text style={styles.detail}>Name: {issueName}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default IssueDetail;
