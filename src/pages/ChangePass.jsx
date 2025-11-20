import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL =", API_URL);

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ChangePass = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({
        title: "All fields are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "New passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      if (!token) {
        toast({
          title: "Not authorized. Please log in again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login?role=admin");
        return;
      }

      const response = await fetch(`${API_URL}/api/admin/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast({
        title: "Password changed successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate(-1);
    } catch (err) {
      toast({
        title: "Error changing password",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Navbar role="admin" />
      <Box
        minH="100vh"
        bg="linear-gradient(135deg, #8D6E63 0%, #F5E6D3 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Box
          bg="white"
          p={8}
          rounded="xl"
          shadow="xl"
          w={{ base: "100%", sm: "400px" }}
        >
          <Heading
            mb={6}
            textAlign="center"
            fontSize="2xl"
            color="#5D4037"
            fontWeight="bold"
          >
            Change Password
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl id="oldPassword" isRequired>
                <FormLabel>Old Password</FormLabel>
                <Input
                  type="text"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                />
              </FormControl>

              <FormControl id="newPassword" isRequired>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </FormControl>

              <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="orange"
                bg="#D2691E"
                _hover={{ bg: "#A0522D" }}
                size="md"
                w="full"
              >
                Update Password
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default ChangePass;
