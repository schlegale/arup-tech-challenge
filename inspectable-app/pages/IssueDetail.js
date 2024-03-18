import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import { CONSTANTS } from "../constants";

const IssueDetail = ({ route, navigation }) => {
  const { issue } = route.params;

  const renderImages = () => {
    return issue.files.map((file, index) => (
      <Image
        key={index}
        source={{ uri: `${CONSTANTS.API_ENDPOINTS.GET_FILE}${file.uri}` }}
        style={styles.image}
        resizeMode="contain"
      />
    ));
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Issue Name</Text>
        <Text style={styles.text}>{issue.title}</Text>

        <Text style={styles.label}>Issue ID</Text>
        <Text style={styles.text}>{issue.id}</Text>

        <Text style={styles.label}>Location</Text>
        <Text style={styles.text}>
          Floor: {issue.floor} - Area: {issue.area}
        </Text>

        <Text style={styles.label}>Discipline</Text>
        <Text style={styles.text}>{issue.discipline}</Text>

        <Text style={styles.label}>Issue Type</Text>
        <Text style={styles.text}>{issue.type}</Text>

        <Text style={styles.label}>Description</Text>
        {issue.description ? (
          <Text style={styles.description}>{issue.description}</Text>
        ) : (
          <Text style={styles.text}>No description provided.</Text>
        )}

        <Text style={styles.label}>Attachments</Text>
        <View style={styles.attachmentContainer}>
          {issue.files && issue.files.length > 0 ? (
            renderImages()
          ) : (
            <Text style={styles.text}>No images available</Text>
          )}
        </View>

        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 25,
  },
  label: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    marginBottom: 15,
    fontStyle: "italic",
  },
  attachmentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default IssueDetail;
