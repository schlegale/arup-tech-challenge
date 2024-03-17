import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Select from "react-native-picker-select";
import Icon from "react-native-vector-icons/FontAwesome";
import { CONSTANTS } from "../constants";
import * as ImagePicker from "expo-image-picker";

function IssueAdd() {
  const [files, setFiles] = useState([]);

  const [floor, setFloor] = useState("");
  const [area, setArea] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [issueId, setIssueId] = useState("");
  const [issueName, setIssueName] = useState("");

  useEffect(() => {
    const fetchNextIssueId = async () => {
      try {
        const response = await axios.get(CONSTANTS.API_ENDPOINTS.NEXT_ISSUE_ID);
        setIssueId(response.data.nextIssueId);
        setIssueName(`Issue_${response.data.nextIssueId}`);
      } catch (error) {
        console.error("Error fetching the next issue ID:", error);
      }
    };

    fetchNextIssueId();
  }, []);

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({});

    if (!result.canceled) {
      setFiles([...files, result.assets[0].uri]);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({});

    if (!result.canceled) {
      setFiles([...files, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    let formData = new FormData();
    formData.append("id", issueId);
    formData.append("title", issueName || "Default Issue Name");
    formData.append("floor", floor);
    formData.append("area", area);
    formData.append("discipline", discipline);
    formData.append("type", issueType);

    files.forEach((uri) => {
      const file = {
        uri: uri,
        name: `${issueId}.jpg`,
        type: "image/jpeg",
      };
      formData.append("files", file);
    });

    {
      console.log("ihandleSubmit: ", formData);
    }

    try {
      const response = await axios.post(
        CONSTANTS.API_ENDPOINTS.ISSUES,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Issue submitted successfully!");
    } catch (error) {
      console.error("There was a problem with the Axios operation:", error);
      alert("Failed to submit the issue.");
    }
  };

  const handleAddLocation = () => {};

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Issue Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setIssueName}
          value={issueName}
        />

        <Text style={styles.label}>Location:</Text>
        <View style={styles.row}>
          <Select
            onValueChange={(value) => setFloor(value)}
            items={[
              { label: "Floor 1", value: "1" },
              { label: "Floor 2", value: "2" },
              { label: "Floor 3", value: "3" },
            ]}
            style={styles.select}
            Icon={() => {
              return <Icon name="chevron-down" size={15} color="#888" />;
            }}
          />

          <Select
            onValueChange={(value) => setFloor(value)}
            items={[
              { label: "Area A", value: "A" },
              { label: "Area B", value: "B" },
            ]}
            style={styles.select}
            Icon={() => {
              return <Icon name="chevron-down" size={15} color="#888" />;
            }}
          />
        </View>

        <TouchableOpacity
          onPress={handleAddLocation}
          style={styles.locationButton}
        >
          <Text>Add Current Location</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Discipline:</Text>
        <Select
          onValueChange={(value) => setFloor(value)}
          items={[
            { label: "Discipline A", value: "A" },
            { label: "Discipline B", value: "B" },
            { label: "Discipline C", value: "C" },
          ]}
          style={styles.select}
          Icon={() => <Icon name="chevron-down" size={15} color="#888" />}
        />

        <Text style={styles.label}>Issue Type:</Text>
        <Select
          onValueChange={(value) => setFloor(value)}
          items={[
            { label: "Critical", value: "A" },
            { label: "Minor", value: "B" },
          ]}
          style={styles.select}
          Icon={() => <Icon name="chevron-down" size={15} color="#888" />}
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={4}
          onChangeText={setDescription}
          value={description}
        />

        <Text style={styles.label}>files:</Text>
        <View style={styles.attachmentContainer}>
          {files.map((uri, index) => (
            <View key={String(index)} style={styles.imagePreview}>
              <Image source={{ uri }} style={styles.image} />
            </View>
          ))}
          <TouchableOpacity
            onPress={handleChoosePhoto}
            style={styles.iconButton}
          >
            <Icon name="image" size={20} color="#888" />
            <Text>Select File</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTakePhoto} style={styles.iconButton}>
            <Icon name="camera" size={20} color="#888" />
            <Text>Take Photo</Text>
          </TouchableOpacity>
        </View>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  attachmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginHorizontal: 5,
  },
  imagePreview: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  label: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex1: {
    flex: 1,
  },
  select: {
    paddingRight: 30,
  },
  locationButton: {
    backgroundColor: "#eee",
    padding: 8,
    marginBottom: 16,
    alignItems: "center",
  },
});

export default IssueAdd;
