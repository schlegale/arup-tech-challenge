import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Select from "react-native-picker-select";
import Icon from "react-native-vector-icons/FontAwesome";
import { CONSTANTS } from "../constants";
import * as ImagePicker from "expo-image-picker";

function IssueAdd({ navigation }) {
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
    if (files.length >= 3) {
      alert("You can only upload up to 3 images.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setFiles([...files, result.assets[0].uri]);
    }
  };

  const handleTakePhoto = async () => {
    if (files.length >= 3) {
      alert("You can only upload up to 3 images.");
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });

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

      // Clear the form
      setFiles([]);
      setFloor("");
      setArea("");
      setDiscipline("");
      setIssueType("");
      setDescription("");
      navigation.navigate("Home");
    } catch (error) {
      console.error("There was a problem with the Axios operation:", error);
      alert("Failed to submit the issue.");
    }
  };

  const handleAddLocation = () => {};

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Issue Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setIssueName}
          value={issueName}
        />

        <Text style={styles.label}>Location</Text>
        <View style={styles.row}>
          <Select
            onValueChange={(value) => setFloor(value)}
            items={[
              { label: "1st Floor", value: "1st" },
              { label: "2nd Floor", value: "2nd" },
              { label: "3rd Floor", value: "3rd" },
              { label: "4th Floor", value: "4th" },
              { label: "5th Floor", value: "5th" },
            ]}
            placeholder={{ label: "Select Floor", value: null }}
            style={{
              inputIOS: styles.select,
              inputAndroid: styles.select,
              iconContainer: styles.selectIcon,
              viewContainer: styles.selectContainer,
            }}
            Icon={() => <Icon name="chevron-down" size={15} color="#888" />}
          />

          <Select
            onValueChange={(value) => setArea(value)}
            items={[
              { label: "Area A", value: "A" },
              { label: "Area B", value: "B" },
              { label: "Area C", value: "C" },
              { label: "Area D", value: "D" },
              { label: "Area E", value: "E" },
              { label: "Area F", value: "F" },
            ]}
            placeholder={{ label: "Select area", value: null }}
            style={{
              inputIOS: styles.select,
              inputAndroid: styles.select,
              iconContainer: styles.selectIcon,
              viewContainer: styles.selectContainer,
            }}
            Icon={() => <Icon name="chevron-down" size={15} color="#888" />}
          />
        </View>

        <TouchableOpacity onPress={handleAddLocation} style={styles.button}>
          <Icon name="map-marker" size={30} color="#ddd" />
        </TouchableOpacity>

        <Text style={styles.label}>Discipline</Text>
        <Select
          onValueChange={(value) => setDiscipline(value)}
          items={[
            { label: "Discipline 1", value: "1" },
            { label: "Discipline 2", value: "2" },
            { label: "Discipline 3", value: "3" },
            { label: "Discipline 4", value: "4" },
          ]}
          placeholder={{ label: "Select discipline", value: null }}
          style={{
            inputIOS: styles.select,
            inputAndroid: styles.select,
            iconContainer: styles.selectIcon,
            viewContainer: styles.selectContainer,
          }}
          Icon={() => <Icon name="chevron-down" size={15} color="#888" />}
        />

        <Text style={styles.label}>Issue Type</Text>
        <Select
          onValueChange={(value) => setIssueType(value)}
          items={[
            { label: "Critical Issue", value: "Critical" },
            { label: "Moderate Issue", value: "Moderate" },
            { label: "Minor Issue", value: "Minor" },
            { label: "Observation", value: "Observation" },
            { label: "Good Practice", value: "Good" },
          ]}
          placeholder={{ label: "Select type", value: null }}
          style={{
            inputIOS: styles.select,
            inputAndroid: styles.select,
            iconContainer: styles.selectIcon,
            viewContainer: styles.selectContainer,
          }}
          Icon={() => <Icon name="chevron-down" size={15} color="#888" />}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          multiline={true}
          numberOfLines={4}
          onChangeText={setDescription}
          value={description}
        />

        <Text style={styles.label}>Attachments</Text>
        <View style={styles.attachmentContainer}>
          {files.map((uri, index) => (
            <View key={String(index)} style={styles.imagePreview}>
              <Image source={{ uri }} style={styles.image} />
            </View>
          ))}
        </View>
        <View style={styles.attachmentContainer}>
          <TouchableOpacity onPress={handleChoosePhoto} style={styles.button}>
            <Icon name="image" size={20} color="#ddd" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleTakePhoto}
            style={{ ...styles.button, marginLeft: 20 }}
          >
            <Icon name="camera" size={20} color="#ddd" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.saveButtonTouchable}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
    padding: 25,
  },
  label: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 6,
    height: 100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex1: {
    flex: 1,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    position: "relative",
    backgroundColor: "#fff",
    height: 40,
    width: "auto",
  },
  selectIcon: {
    position: "absolute",
    right: 10,
    zIndex: 1,
  },
  select: {
    paddingRight: 40,
    paddingLeft: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#fff",
    borderStyle: "dotted",
    flex: 1,
  },
  halfWidthButton: {
    flex: 1,
    margin: 5,
  },
  fullWidthButton: {
    marginBottom: 16,
    padding: 20,
    borderWidth: 2,
  },
  attachmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  saveButtonTouchable: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1dcaff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default IssueAdd;
