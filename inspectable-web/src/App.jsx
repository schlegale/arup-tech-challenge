import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Flex,
  Icon,
  Spacer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Image,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import axios from "axios";
import { CONSTANTS } from "../constants";

function getStatusColor(issueType) {
  switch (issueType) {
    case "Critical":
      return "#E53E3E";
    case "Moderate":
      return "#DD6B20";
    case "Observation":
    case "Good":
      return "#D69E2E";
    case "Minor":
      return "#38A169";
    default:
      return "#718096";
  }
}

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [issues, setIssues] = useState([]);
  const [currentIssue, setCurrentIssue] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get(CONSTANTS.API_ENDPOINTS.ISSUES);
        setIssues(response.data);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      }
    };

    fetchIssues();
  }, []);

  function handleRowClick(issue) {
    setCurrentIssue(issue);
    onOpen();
  }

  const renderImages = (files) => {
    return files.map((file, index) => (
      <Image
        key={index}
        src={`${CONSTANTS.API_ENDPOINTS.GET_FILE}${file.uri}`}
        alt={`Attachment ${index + 1}`}
        boxSize="100px"
        objectFit="contain"
        m={2}
      />
    ));
  };

  return (
    <Box width="100vw" overflowX="auto" display="flex" justifyContent="center">
      <Table variant="simple" size="sm" width="90vw" marginTop={50}>
        <Thead>
          <Tr>
            <Th width="5%">Ref.</Th>
            <Th width="20%">Issue</Th>
            <Th width="5%">Floor</Th>
            <Th width="5%">Area</Th>
            <Th width="10%">Discipline</Th>
            <Th width="10%">Type</Th>
            <Th width="20%"></Th>
          </Tr>
        </Thead>

        <Tbody>
          {issues.map((issue) => (
            <Tr
              key={issue.id}
              onClick={() => handleRowClick(issue)}
              _hover={{ bg: "gray.100", cursor: "pointer" }}
            >
              <Td>{issue.id}</Td>
              <Td>{issue.title}</Td>
              <Td>{issue.floor}</Td>
              <Td>{issue.area}</Td>
              <Td>{issue.discipline}</Td>
              <Td>{issue.type}</Td>
              <Td>
                <Flex alignItems="center">
                  <Box
                    width={23}
                    height={23}
                    borderRadius={"100%"}
                    style={{ backgroundColor: getStatusColor(issue.type) }}
                    mr={2}
                  />
                  <Spacer />
                  <Icon as={ChevronRightIcon} />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal for displaying the issue details remains unchanged */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent
          mx="auto"
          width="auto"
          height="80vh"
          backgroundColor="#fff"
          p={30}
          px={50}
          marginTop={20}
          borderRadius={10}
          position="relative"
        >
          <ModalHeader marginBottom={30}>Issue Details</ModalHeader>
          <ModalCloseButton
            position="absolute"
            right="8px"
            top="10px"
            background={"transparent"}
            border={"none"}
          />
          <ModalBody>
            {currentIssue && (
              <VStack spacing={0} align="start">
                <Text fontWeight="bold" m={0} p={0}>
                  Issue Name
                </Text>
                <Text m={0} p={0}>
                  {currentIssue.title}
                </Text>

                <Text fontWeight="bold" m={0} p={0}>
                  Issue ID
                </Text>
                <Text m={0} p={0}>
                  {currentIssue.id}
                </Text>

                <Text fontWeight="bold" m={0} p={0}>
                  Location
                </Text>
                <Text m={0} p={0}>
                  Floor: {currentIssue.floor} - Area: {currentIssue.area}
                </Text>

                <Text fontWeight="bold" m={0} p={0}>
                  Discipline
                </Text>
                <Text m={0} p={0}>
                  {currentIssue.discipline}
                </Text>

                <Text fontWeight="bold" m={0} p={0}>
                  Issue Type
                </Text>
                <Text m={0} p={0}>
                  {currentIssue.type}
                </Text>

                <Text fontWeight="bold" m={0} p={0}>
                  Description
                </Text>
                {currentIssue.description ? (
                  <Text fontStyle="italic" m={0} p={0}>
                    {currentIssue.description}
                  </Text>
                ) : (
                  <Text m={0} p={0}>
                    No description provided.
                  </Text>
                )}

                <Text fontWeight="bold" m={0} p={0}>
                  Attachments
                </Text>
                <Flex wrap="wrap">
                  {currentIssue.files && currentIssue.files.length > 0 ? (
                    renderImages(currentIssue.files)
                  ) : (
                    <Text m={0} p={0}>
                      No images available
                    </Text>
                  )}
                </Flex>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
