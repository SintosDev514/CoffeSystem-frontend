import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Input,
  Button,
  IconButton,
  Text,
  InputGroup,
  InputRightElement,
  Badge,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Icon,
  VStack,
  Spinner,
  Collapse,
} from "@chakra-ui/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

import {
  FaCoffee,
  FaSearch,
  FaSignOutAlt,
  FaHistory,
  FaBell,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
    accent: "linear-gradient(135deg, #8D6E63 0%, #A1887F 100%)",
    card: "linear-gradient(145deg, #FFFFFF 0%, #FDF5E6 100%)",
    premium: "linear-gradient(135deg, #8D6E63 0%, #5D4037 100%)",
  },
};

const FloatingCoffees = () => {
  const icons = Array.from({ length: 10 });
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      overflow="hidden"
      zIndex={0}
      pointerEvents="none"
    >
      {icons.map((_, i) => (
        <Icon
          key={i}
          as={FaCoffee}
          color="rgba(255, 255, 255, 0.06)"
          boxSize={`${Math.random() * 20 + 15}px`}
          position="absolute"
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          animation={`floatCoffee ${
            8 + Math.random() * 8
          }s ease-in-out infinite`}
          style={{ animationDelay: `${Math.random() * 5}s` }}
        />
      ))}
      <style>
        {`
          @keyframes floatCoffee {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
            50% { transform: translateY(-25px) rotate(10deg); opacity: 0.7; }
            100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          }
        `}
      </style>
    </Box>
  );
};

const ProfessionalCustomerNavbar = ({
  search,
  setSearch,
  cartCount = 0,
  onOpenCart,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const bgColor = COFFEE_SHOP_THEME.primary.darkBrown;
  const borderColor = COFFEE_SHOP_THEME.primary.mediumBrown;
  const textColor = COFFEE_SHOP_THEME.primary.cream;

  const handleLogout = () => {
    toast({
      title: "Signed out successfully",
      description: "Come back for more coffee soon! ☕",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
    navigate("/login");
  };

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const customerId = localStorage.getItem("customerId");
      const res = await axios.get(
        `${API_URL}/api/orders?customerId=${customerId}`
      );
      setOrders(res.data);
      onOpen();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching orders",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      as="nav"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={{ base: 4, md: 8 }}
      py={3}
      position="sticky"
      top={0}
      zIndex="sticky"
      overflow="hidden"
      boxShadow="0 4px 20px rgba(93, 64, 55, 0.15)"
    >
      <FloatingCoffees />

      <Flex
        align="center"
        justify="space-between"
        maxW="1400px"
        mx="auto"
        gap={4}
        position="relative"
        zIndex={1}
      >
        {/* Logo */}
        <Box
          p={2}
          bg={COFFEE_SHOP_THEME.gradients.accent}
          borderRadius="xl"
          color={COFFEE_SHOP_THEME.primary.cream}
          boxShadow="0 4px 12px rgba(93, 64, 55, 0.3)"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          <FaCoffee size="20px" />
        </Box>

        {/* Desktop Menu */}
        <Flex
          align="center"
          gap={4}
          flex="1"
          justify="flex-end"
          display={{ base: "none", md: "flex" }}
        >
          <InputGroup maxW="400px">
            <Input
              placeholder="Search brews, orders, or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg={COFFEE_SHOP_THEME.primary.mediumBrown}
              color={textColor}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              _placeholder={{
                color: "#EDE0D4",
                fontSize: "sm",
                fontStyle: "italic",
              }}
            />
            <InputRightElement>
              <FaSearch color="#EDE0D4" />
            </InputRightElement>
          </InputGroup>

          <Button
            bg={COFFEE_SHOP_THEME.gradients.accent}
            color={textColor}
            _hover={{
              bg: COFFEE_SHOP_THEME.gradients.premium,
              transform: "translateY(-2px)",
            }}
            leftIcon={<FaHistory />}
            onClick={handleCheckStatus}
          >
            Order Status
          </Button>

          <Box position="relative">
            <IconButton
              aria-label="Cart"
              icon={<FaShoppingCart />}
              variant="ghost"
              color={textColor}
              onClick={onOpenCart}
            />
            {cartCount > 0 && (
              <Badge
                position="absolute"
                top="0"
                right="0"
                bg="red.500"
                color="white"
                borderRadius="full"
                fontSize="0.7em"
                px={2}
              >
                {cartCount}
              </Badge>
            )}
          </Box>


          <Button
            leftIcon={<FaSignOutAlt />}
            colorScheme="red"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Flex>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          aria-label="Menu"
          icon={isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          variant="ghost"
          color={textColor}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </Flex>

      {/* Mobile Menu Drawer */}
      <Collapse in={isMobileMenuOpen} animateOpacity>
        <VStack
          spacing={4}
          align="stretch"
          mt={3}
          display={{ md: "none" }}
          bg="rgba(255,255,255,0.08)"
          p={4}
          borderRadius="lg"
          border="1px solid rgba(255,255,255,0.1)"
        >
          {/* Search */}
          {/* Search */}
          <Box mb={2}>
            <InputGroup>
              <Input
                placeholder="Search brews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg={COFFEE_SHOP_THEME.primary.mediumBrown}
                color={COFFEE_SHOP_THEME.primary.cream}
                borderRadius="lg"
                border="none"
                py={2}
              />
              <InputRightElement>
                <FaSearch color="#D7CCC8" />
              </InputRightElement>
            </InputGroup>
          </Box>

          {/* Buttons Stack */}
          <VStack spacing={3} align="stretch">
            <Button
              leftIcon={<FaHistory />}
              bg={COFFEE_SHOP_THEME.gradients.accent}
              color={COFFEE_SHOP_THEME.primary.cream}
              onClick={handleCheckStatus}
              borderRadius="lg"
              w="full"
              justifyContent="center"
              _hover={{
                bg: COFFEE_SHOP_THEME.gradients.premium,
                transform: "translateY(-1px)",
              }}
            >
              Order Status
            </Button>

            <Button
              leftIcon={<FaShoppingCart />}
              variant="outline"
              borderColor="rgba(255,255,255,0.2)"
              color={COFFEE_SHOP_THEME.primary.cream}
              onClick={onOpenCart}
              borderRadius="lg"
              w="full"
              justifyContent="center"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
            >
              Cart ({cartCount})
            </Button>

            <Button
              leftIcon={<FaSignOutAlt />}
              colorScheme="red"
              onClick={handleLogout}
              borderRadius="lg"
              w="full"
              justifyContent="center"
            >
              Sign Out
            </Button>
          </VStack>
        </VStack>
      </Collapse>

      {/* Order Status Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#3E2723" color="white">
          <DrawerHeader borderBottom="1px solid #8D6E63">
            Order Status
          </DrawerHeader>
          <DrawerBody>
            {loading ? (
              <Flex align="center" justify="center" h="100%">
                <Spinner size="lg" color="yellow.400" />
              </Flex>
            ) : (
              <VStack align="stretch" spacing={3}>
                {orders.length === 0 ? (
                  <Text>No orders found.</Text>
                ) : (
                  orders.map((order) => (
                    <Box
                      key={order._id}
                      p={3}
                      borderRadius="lg"
                      bg="rgba(255,255,255,0.08)"
                      shadow="md"
                    >
                      <Text fontWeight="bold">Order ID: {order._id}</Text>
                      <Text fontSize="sm" color="yellow.300">
                        Customer ID: {order.customerId}
                      </Text>
                      <Text>
                        Status:{" "}
                        <Badge
                          colorScheme={
                            order.paymentStatus === "pending"
                              ? "yellow"
                              : order.paymentStatus === "paid"
                              ? "green"
                              : order.paymentStatus === "ready to serve"
                              ? "purple"
                              : "blue"
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </Text>
                      <Text fontSize="sm">
                        Total: ₱{order.total?.toFixed(2)}
                      </Text>
                    </Box>
                  ))
                )}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default ProfessionalCustomerNavbar;
