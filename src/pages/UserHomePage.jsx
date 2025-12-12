import React, { useEffect, useState, useCallback } from "react";
import CryptoJS from "crypto-js";
import { useProductStore } from "../store/product";
import { clearCustomerId } from "../utils/sessionUtils";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  SimpleGrid,
  Image,
  Card,
  CardBody,
  VStack,
  HStack,
  Icon,
  Center,
  Fade,
  useToast,
  Flex,
  Divider,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerFooter,
  DrawerCloseButton,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiCoffee,
  FiShoppingCart,
  FiCreditCard,
  FiImage,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiCopy,
  FiUser,
} from "react-icons/fi";
import CustomerNavbar from "../components/CustomerNavbar";

const AES_KEY = "GwapoAdminSine2";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Decrypt AES image
const decryptAES = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, AES_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Failed to decrypt image:", err);
    return null;
  }
};

const COFFEE_SHOP_THEME = {
  brown: "#4B2E05",
  cream: "#FFF8E7",
  latte: "#F5E6CA",
  caramel: "#D7B377",
  text: "#3E2723",
  white: "#FFFFFF",
};

// Floating coffee background
const FloatingCoffees = () => {
  const coffees = Array.from({ length: 14 });
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      overflow="hidden"
      zIndex={0}
      pointerEvents="none"
    >
      {coffees.map((_, i) => (
        <Icon
          key={i}
          as={FiCoffee}
          color="rgba(90, 50, 20, 0.08)"
          boxSize={`${Math.random() * 25 + 20}px`}
          position="absolute"
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          filter="blur(0.5px)"
          animation={`floatCoffee ${
            6 + Math.random() * 6
          }s ease-in-out infinite`}
          style={{ animationDelay: `${Math.random() * 5}s` }}
        />
      ))}

      <style>
        {`
          @keyframes floatCoffee {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-40px) rotate(15deg); opacity: 0.6; }
            100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          }
        `}
      </style>
    </Box>
  );
};

const UserHomePage = () => {
  const { fetchProductsForUsers, products: rawProducts } = useProductStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const toast = useToast();

  const showNotification = useCallback(
    (title, description, status = "info") => {
      toast({
        title,
        description,
        status,
        duration: 2500,
        isClosable: true,
        position: "top-right",
      });
    },
    [toast]
  );

  useEffect(() => {
    let savedId = localStorage.getItem("customerId");
    if (!savedId) {
      savedId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 15);
      localStorage.setItem("customerId", savedId);
    }
    setCustomerId(savedId);

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    fetchProductsForUsers();
  }, [fetchProductsForUsers]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const copyCustomerId = () => {
    navigator.clipboard.writeText(customerId);
    showNotification("Copied!", "Customer ID copied to clipboard.", "success");
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing)
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification("Added to Cart", `${product.name} added`, "success");
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
    showNotification("Removed from Cart", "Item removed", "info");
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i._id === id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showNotification(
        "Cart Empty",
        "Please add items before checkout.",
        "warning"
      );
      return;
    }

    showNotification("Processing...", "Creating checkout session...", "info");

    try {
      const lineItems = cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await fetch(`${API_URL}/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems, customerId }),
      });

      const data = await response.json();
      const checkoutUrl = data?.checkoutUrl;

      if (checkoutUrl) {
        showNotification(
          "Redirecting",
          "Opening PayMongo checkout...",
          "success"
        );
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      showNotification("Error", "Failed to start checkout process.", "error");
    }
  };

  const products = Array.isArray(rawProducts) ? rawProducts : [];
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box bg={COFFEE_SHOP_THEME.cream} minH="100vh" position="relative">
      <FloatingCoffees />

      <Box
        position="fixed"
        top={0}
        width="100%"
        zIndex={1000}
        bg={COFFEE_SHOP_THEME.cream}
      >
        <Flex justifyContent="space-between" alignItems="center" px={4}>
          <Box flex={1}>
            <CustomerNavbar
              search={searchQuery}
              setSearch={setSearchQuery}
              cartCount={cart.length}
              onOpenCart={() => setIsCartOpen(true)}
            />
          </Box>
        </Flex>
      </Box>

      <Box pt="80px">
        {/* Hero */}
        <Box
          bgGradient="linear(to-r, #fdf6ec, #fae9c7, #fdf6ec)"
          py={{ base: 10, md: 16 }}
          textAlign="center"
          borderBottom="1px solid #E0C097"
          px={4}
          position="relative"
          zIndex={1}
          animation="backgroundShift 12s ease-in-out infinite"
        >
          <style>
            {`
              @keyframes backgroundShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}
          </style>

          <Container maxW="container.md">
            <Heading
              color={COFFEE_SHOP_THEME.brown}
              fontSize={{ base: "2xl", md: "3xl" }}
            >
              Welcome to BrewTrack ☕
            </Heading>
            <Text
              mt={3}
              color={COFFEE_SHOP_THEME.text}
              fontSize={{ base: "sm", md: "lg" }}
            >
              Where every cup tells a story. Discover, sip, and enjoy your next
              favorite brew.
            </Text>

            {customerId && (
              <Center mt={8}>
                <Box
                  bgGradient="linear(to-r, #fffaf0, #ffe0b3)"
                  border="1px solid #f2c16d"
                  borderRadius="xl"
                  p={5}
                  shadow="xl"
                  w={{ base: "90%", sm: "70%", md: "50%" }}
                  _hover={{ transform: "translateY(-3px)" }}
                  transition="0.3s"
                >
                  <VStack spacing={2}>
                    <Icon as={FiUser} boxSize={8} color="orange.400" />
                    <Text color="orange.700" fontWeight="semibold">
                      Your Customer ID
                    </Text>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="orange.600"
                      bg="whiteAlpha.800"
                      px={5}
                      py={2}
                      borderRadius="md"
                      letterSpacing="wide"
                    >
                      {customerId}
                    </Text>
                    <Tooltip label="Copy ID" hasArrow>
                      <IconButton
                        size="sm"
                        icon={<FiCopy />}
                        variant="ghost"
                        colorScheme="orange"
                        onClick={copyCustomerId}
                      />
                    </Tooltip>
                  </VStack>
                </Box>
              </Center>
            )}
          </Container>
        </Box>

        {/* Products Grid */}
        <Container
          maxW="container.xl"
          py={{ base: 8, md: 12 }}
          px={{ base: 4, md: 8 }}
          zIndex={1}
          position="relative"
        >
          {filteredProducts.length === 0 ? (
            <Center py={20}>
              <VStack spacing={4}>
                <Icon as={FiCoffee} w={10} h={10} color="gray.400" />
                <Text color="gray.500">No products found.</Text>
              </VStack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
              {filteredProducts.map((product, i) => (
                <Fade in key={product._id} delay={i * 0.05}>
                  <Card
                    borderRadius="2xl"
                    overflow="hidden"
                    bg="white"
                    shadow="md"
                    transition="0.25s"
                    _hover={{ transform: "translateY(-6px)", shadow: "xl" }}
                  >
                    <Image
                      src={decryptAES(product.image)}
                      alt={product.name}
                      height="220px"
                      objectFit="cover"
                      fallback={
                        <Center h="220px" bg="orange.50">
                          <Icon as={FiImage} boxSize={8} color="orange.300" />
                        </Center>
                      }
                    />
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <Flex justify="space-between" w="full">
                          <Heading size="sm" color={COFFEE_SHOP_THEME.brown}>
                            {product.name}
                          </Heading>
                          <Badge colorScheme="orange" borderRadius="full">
                            ₱{product.price}
                          </Badge>
                        </Flex>
                        <Text noOfLines={2} color="gray.600" fontSize="sm">
                          {product.description}
                        </Text>
                        <Button
                          colorScheme="orange"
                          w="full"
                          size="sm"
                          leftIcon={<FiShoppingCart />}
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </Fade>
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      {/* Cart Drawer */}
      <Drawer
        isOpen={isCartOpen}
        placement="right"
        onClose={() => setIsCartOpen(false)}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent borderRadius="xl 0 0 xl">
          <DrawerCloseButton />
          <DrawerHeader
            borderBottom="1px solid #E0C097"
            bg={COFFEE_SHOP_THEME.latte}
          >
            Your Cart
          </DrawerHeader>
          <DrawerBody>
            {cart.length === 0 ? (
              <Center h="full">
                <Text color="gray.500">Your cart is empty.</Text>
              </Center>
            ) : (
              <VStack align="stretch" spacing={4}>
                {cart.map((item) => (
                  <Box
                    key={item._id}
                    p={3}
                    bg="white"
                    borderRadius="lg"
                    shadow="sm"
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{item.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          ₱{item.price} × {item.quantity}
                        </Text>
                      </VStack>
                      <HStack spacing={1}>
                        <IconButton
                          size="sm"
                          icon={<FiMinus />}
                          onClick={() => decreaseQuantity(item._id)}
                        />
                        <Text fontSize="sm">{item.quantity}</Text>
                        <IconButton
                          size="sm"
                          icon={<FiPlus />}
                          onClick={() => increaseQuantity(item._id)}
                        />
                        <IconButton
                          size="sm"
                          colorScheme="red"
                          icon={<FiTrash2 />}
                          onClick={() => removeFromCart(item._id)}
                        />
                      </HStack>
                    </Flex>
                  </Box>
                ))}
                <Divider />
                <Flex justify="space-between">
                  <Text fontWeight="bold">Total:</Text>
                  <Text fontWeight="bold" color="orange.500">
                    ₱{totalPrice.toFixed(2)}
                  </Text>
                </Flex>
              </VStack>
            )}
          </DrawerBody>
          <DrawerFooter>
            {cart.length > 0 && (
              <Button
                w="full"
                colorScheme="green"
                leftIcon={<FiCreditCard />}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default UserHomePage;
