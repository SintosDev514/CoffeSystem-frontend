import React, { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  ScaleFade,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiLock } from "react-icons/fi";


const COFFEE_SHOP_THEME = {
  primary: {
    darkBrown: "#5D4037",
    mediumBrown: "#8D6E63",
    lightBrown: "#A1887F",
    cream: "#F5E6D3",
    white: "#FFFFFF",
    lightCream: "#FDF5E6",
    mediumGray: "#D7CCC8",
    accent: "#D2691E",
    gold: "#FFA000",
  },
  gradients: {
    card: "linear-gradient(145deg, #FFFFFF 0%, #FDF5E6 100%)",
    accent: "linear-gradient(135deg, #8D6E63 0%, #A1887F 100%)",
  },
};

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Password required",
        description: "Please fill in both fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are identical.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/auth/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      toast({
        title: "Password Updated!",
        description: "You can now login with your new password.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/login");
    } catch (err) {
      toast({
        title: "Reset Failed",
        description: err.message,
        status: "error",
        duration: 3000,
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
      <Container maxW="sm">
        <ScaleFade in={true} initialScale={0.9}>
          <Card
            bg={COFFEE_SHOP_THEME.gradients.card}
            boxShadow="0 20px 40px rgba(93, 64, 55, 0.15)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
          >
            <CardBody p={8}>
              <VStack spacing={6} align="center">
                <Heading
                  size="lg"
                  color={COFFEE_SHOP_THEME.primary.darkBrown}
                  textAlign="center"
                >
                  Reset Password
                </Heading>
                <Text
                  fontSize="sm"
                  color={COFFEE_SHOP_THEME.primary.mediumBrown}
                  textAlign="center"
                >
                  Enter a new password to continue
                </Text>

              
                <FormControl isRequired>
                  <FormLabel color={COFFEE_SHOP_THEME.primary.darkBrown}>
                    New Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      placeholder="Enter new password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      bg={COFFEE_SHOP_THEME.primary.white}
                      borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
                      borderRadius="lg"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        color={COFFEE_SHOP_THEME.primary.mediumBrown}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

               
                <FormControl isRequired>
                  <FormLabel color={COFFEE_SHOP_THEME.primary.darkBrown}>
                    Confirm Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      placeholder="Confirm new password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      bg={COFFEE_SHOP_THEME.primary.white}
                      borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
                      borderRadius="lg"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                        icon={showConfirm ? <ViewOffIcon /> : <ViewIcon />}
                        size="sm"
                        onClick={() => setShowConfirm(!showConfirm)}
                        variant="ghost"
                        color={COFFEE_SHOP_THEME.primary.mediumBrown}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

               
                <Button
                  w="full"
                  size="lg"
                  colorScheme="orange"
                  bg={COFFEE_SHOP_THEME.gradients.accent}
                  color={COFFEE_SHOP_THEME.primary.cream}
                  borderRadius="lg"
                  py={6}
                  isLoading={isLoading}
                  onClick={handleResetPassword}
                  leftIcon={<FiLock />}
                >
                  Reset Password
                </Button>

                <Text fontSize="sm" color={COFFEE_SHOP_THEME.primary.mediumBrown} textAlign="center">
                  After resetting, you will be redirected to the login page.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage;
