import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  Text,
  FormControl,
  FormLabel,
  useToast,
  Card,
  CardBody,
  ScaleFade,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your admin email",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send reset email");

      toast({
        title: "Email sent!",
        description: "Check your inbox for the password reset link.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

    
      navigate("/login");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, #FDF5E6, #F5E6D3)"
      px={4}
      py={8}
    >
      <Container maxW="md">
        <ScaleFade in={true} initialScale={0.9}>
          <Card>
            <CardBody p={8}>
              <VStack spacing={6} align="center">
                <Heading size="lg" color="#5D4037">
                  Reset Admin Password
                </Heading>
                <Text color="#8D6E63" textAlign="center">
                  Enter your admin email to receive a password reset link.
                </Text>

                <VStack as="form" spacing={4} w="full" onSubmit={handleSubmit}>
                  <FormControl isRequired>
                    <FormLabel color="#5D4037" fontSize="sm">
                      Admin Email
                    </FormLabel>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg="#FFFFFF"
                      borderColor="#D7CCC8"
                      borderRadius="lg"
                    />
                  </FormControl>

                  <Button
                    w="full"
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    bg="linear-gradient(135deg, #8D6E63 0%, #5D4037 100%)"
                    color="#F5E6D3"
                    borderRadius="lg"
                    py={6}
                  >
                    Send Reset Email
                  </Button>
                </VStack>

                <Text
                  fontSize="sm"
                  color="blue.500"
                  cursor="pointer"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
