import React, { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Flex,
  HStack,
  Card,
  CardBody,
  ScaleFade,
  Divider,
  FormControl,
  FormLabel,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FiCoffee, FiArrowLeft, FiUser, FiShield } from "react-icons/fi";

const COFFEE_SHOP_THEME = {
  primary: {
    darkBrown: "#5D4037",
    mediumBrown: "#8D6E63",
    lightBrown: "#A1887F",
    cream: "#F5E6D3",
    white: "#FFFFFF",
    lightCream: "#FDF5E6",
    mediumGray: "#D7CCC8",
    darkGray: "#5D4037",
    accent: "#D2691E",
    gold: "#FFA000",
    espresso: "#3E2723",
    latte: "#F5F5DC",
  },
  gradients: {
    hero: "linear-gradient(135deg, #5D4037 0%, #8D6E63 50%, #A1887F 100%)",
    accent: "linear-gradient(135deg, #8D6E63 0%, #A1887F 100%)",
    light: "linear-gradient(135deg, #A1887F 0%, #D7CCC8 100%)",
    card: "linear-gradient(145deg, #FFFFFF 0%, #FDF5E6 100%)",
    premium: "linear-gradient(135deg, #8D6E63 0%, #5D4037 100%)",
  },
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ email: "", password: "", customerId: "" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const roleFromQuery = query.get("role") || "user";
    setRole(roleFromQuery);
  }, [location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!form.customerId) {
      toast({
        title: "Customer ID required",
        description: "Please enter your Customer ID to continue",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    localStorage.setItem("customerId", form.customerId);
    toast({
      title: "Welcome to BrewFlow!",
      description: "Your coffee journey begins now ☕",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/userhomepage");
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("ADMIN_TOKEN", data.token);
      toast({
        title: "Welcome back, Admin!",
        description: "Ready to manage the coffee shop?",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/adminhomepage");
    } catch (err) {
      toast({
        title: "Brew interrupted",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    setForm({ email: "", password: "", customerId: "" });
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
      position="relative"
      overflow="hidden"
    >
      <Container maxW="md" p={0} position="relative" zIndex={1}>
        <ScaleFade in={true} initialScale={0.9}>
          <Card
            bg={COFFEE_SHOP_THEME.gradients.card}
            boxShadow="0 20px 40px rgba(93, 64, 55, 0.15)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
            overflow="hidden"
            transition="all 0.3s ease"
          >
            <CardBody p={{ base: 6, md: 8 }}>
              {/* Header */}
              <VStack spacing={6} align="center" mb={6}>
                <Flex
                  align="center"
                  justify="center"
                  w={16}
                  h={16}
                  bg={COFFEE_SHOP_THEME.gradients.accent}
                  borderRadius="xl"
                >
                  <FiCoffee size={28} color={COFFEE_SHOP_THEME.primary.cream} />
                </Flex>
                <VStack spacing={2} textAlign="center">
                  <Heading
                    size="lg"
                    color={COFFEE_SHOP_THEME.primary.darkBrown}
                  >
                    Welcome to BrewFlow
                  </Heading>
                  <Text
                    color={COFFEE_SHOP_THEME.primary.mediumBrown}
                    opacity={0.9}
                    fontStyle="italic"
                  >
                    {role === "admin"
                      ? "Barista access to coffee management"
                      : "Your perfect coffee experience awaits"}
                  </Text>
                </VStack>

                <HStack
                  bg={COFFEE_SHOP_THEME.primary.lightCream}
                  p={1}
                  borderRadius="lg"
                  w="full"
                  maxW="xs"
                  border="1px solid"
                  borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
                >
                  <Button
                    flex={1}
                    size="sm"
                    variant={role === "user" ? "solid" : "ghost"}
                    bg={
                      role === "user"
                        ? COFFEE_SHOP_THEME.gradients.accent
                        : "transparent"
                    }
                    color={
                      role === "user"
                        ? COFFEE_SHOP_THEME.primary.cream
                        : COFFEE_SHOP_THEME.primary.mediumBrown
                    }
                    leftIcon={<FiUser />}
                    onClick={() => switchRole("user")}
                  >
                    Customer
                  </Button>
                  <Button
                    flex={1}
                    size="sm"
                    variant={role === "admin" ? "solid" : "ghost"}
                    bg={
                      role === "admin"
                        ? COFFEE_SHOP_THEME.gradients.premium
                        : "transparent"
                    }
                    color={
                      role === "admin"
                        ? COFFEE_SHOP_THEME.primary.cream
                        : COFFEE_SHOP_THEME.primary.mediumBrown
                    }
                    leftIcon={<FiShield />}
                    onClick={() => switchRole("admin")}
                  >
                    Barista
                  </Button>
                </HStack>
              </VStack>

              {role === "user" && (
                <VStack
                  spacing={4}
                  as="form"
                  onSubmit={(e) => {
                    e.preventDefault();

                    const generatedId =
                      "CUST-" +
                      Date.now() +
                      "-" +
                      Math.floor(Math.random() * 1000);

                    localStorage.setItem("customerId", generatedId);

                    toast({
                      title: "Welcome to BrewFlow!",
                      description: `Your Customer ID is ${generatedId}. Keep it safe to track your orders ☕`,
                      status: "success",
                      duration: 4000,
                      isClosable: true,
                    });

                    navigate("/userhomepage");
                  }}
                  mt={4}
                >
                  <Text
                    color={COFFEE_SHOP_THEME.primary.darkBrown}
                    fontSize="sm"
                    fontWeight="bold"
                    textAlign="center"
                  >
                    Press Continue to generate your unique Customer ID
                  </Text>

                  <Button
                    w="full"
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    bg={COFFEE_SHOP_THEME.gradients.accent}
                    color={COFFEE_SHOP_THEME.primary.cream}
                    borderRadius="lg"
                    py={6}
                  >
                    Continue as Customer
                  </Button>
                </VStack>
              )}

              {role === "admin" && (
                <VStack spacing={4} as="form" onSubmit={handleAdminSubmit}>
                  <FormControl isRequired>
                    <FormLabel
                      color={COFFEE_SHOP_THEME.primary.darkBrown}
                      fontSize="sm"
                    >
                      Barista Email
                    </FormLabel>
                    <Input
                      placeholder="Enter your barista email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      bg={COFFEE_SHOP_THEME.primary.white}
                      borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
                      borderRadius="lg"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      color={COFFEE_SHOP_THEME.primary.darkBrown}
                      fontSize="sm"
                    >
                      Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        bg={COFFEE_SHOP_THEME.primary.white}
                        borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
                        borderRadius="lg"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          color={COFFEE_SHOP_THEME.primary.mediumBrown}
                        />
                      </InputRightElement>
                    </InputGroup>

                    <Text
                      fontSize="sm"
                      color="blue.500"
                      cursor="pointer"
                      mt={2} // spacing from password input
                      onClick={() => navigate("/admin/forgot-password")}
                      alignSelf="flex-end"
                    >
                      Forgot Password?
                    </Text>
                  </FormControl>
                  <Button
                    w="full"
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    bg={COFFEE_SHOP_THEME.gradients.premium}
                    color={COFFEE_SHOP_THEME.primary.cream}
                    borderRadius="lg"
                    py={6}
                  >
                    Sign In as Barista
                  </Button>
                </VStack>
              )}

              <Divider
                borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
                my={6}
                opacity={0.5}
              />
              <Button
                variant="ghost"
                size="md"
                leftIcon={<FiArrowLeft />}
                onClick={() => navigate("/")}
                color={COFFEE_SHOP_THEME.primary.mediumBrown}
              >
                Back to Coffee Shop
              </Button>
            </CardBody>
          </Card>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default LoginPage;
