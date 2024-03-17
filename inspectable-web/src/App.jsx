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
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import axios from "axios";
import { CONSTANTS } from "../constants";

function getStatusColor(issueType) {
  switch (issueType) {
    case "Critical issue":
      return "red.500";
    case "Moderate issue":
      return "orange.500";
    case "Observation":
    case "Good practice":
      return "yellow.500";
    case "Minor issue":
      return "green.500";
    default:
      return "gray.500";
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
                    width={3}
                    height={3}
                    borderRadius="full"
                    bg={getStatusColor(issue.type)}
                    mr={2}
                  />
                  {issue.type}
                  <Spacer />
                  <Icon as={ChevronRightIcon} />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal for displaying the issue details remains unchanged */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="white" mx="auto" width="auto" maxWidth="80vw">
          <ModalHeader>Issue Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentIssue && (
              <Box>
                <p>Reference: {currentIssue.ref}</p>
                <p>Title: {currentIssue.title}</p>
                <p>Floor: {currentIssue.floor}</p>
                <p>Area: {currentIssue.area}</p>
                <p>Discipline: {currentIssue.discipline}</p>
                <p>Type: {currentIssue.type}</p>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
