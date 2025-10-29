import React, { useEffect, useState } from "react";

import CryptoJS from "crypto-js"; 

import { useProductStore } from "../store/product";
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
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  Badge,
  IconButton,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import {
  FiCoffee,
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiImage,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


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
  },
  gradients: {
    card: "linear-gradient(145deg, #FFFFFF 0%, #FDF5E6 100%)",
    premium: "linear-gradient(135deg, #8D6E63 0%, #5D4037 100%)",
  },
};

const AdminHomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchProducts, products, deleteProduct, updateProduct } =
    useProductStore();
  const [updatedProduct, setUpdateProduct] = useState({
    _id: "",
    name: "",
    price: "",
    image: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const token = localStorage.getItem("ADMIN_TOKEN");
    if (!token) {
      navigate("/login?role=admin");
      return;
    }

    const fetchData = async () => {
      try {
        await fetchProducts();
      } catch (err) {
        toast({
          title: "Brew Interrupted",
          description: err.message || "Failed to fetch coffee products",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchData();
  }, [fetchProducts, navigate, toast]);

  const handleDelete = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    if (!success && message.includes("login")) {
      localStorage.removeItem("ADMIN_TOKEN");
      navigate("/login?role=admin");
    }
    toast({
      title: success ? "Brew Removed" : "Brew Interrupted",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdate = (pid) => {
    const product = products.find((p) => p._id === pid);
    if (product) {
      setUpdateProduct(product);
      onOpen();
    }
  };

  const handleUpdateSubmit = async () => {
    const { _id, ...rest } = updatedProduct;
    const { success, message } = await updateProduct(_id, rest);

    if (!success && message.includes("login")) {
      localStorage.removeItem("ADMIN_TOKEN");
      navigate("/login?role=admin");
    }

    toast({
      title: success ? "Brew Updated" : "Brew Interrupted",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });

    if (success) onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct((prev) => ({ ...prev, [name]: value }));
  };

  // <-- decrypt function ine

  const AES_KEY = "GwapoAdminSine2";

  const decryptAES = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, AES_KEY);
      return bytes.toString(CryptoJS.enc.Utf8); // Base64 string
    } catch (err) {
      console.error("Failed to decrypt image:", err);
      return null;
    }
  };

  return (
    <Box minH="100vh" bg={COFFEE_SHOP_THEME.primary.lightCream} pt={0} pb={16}>
      <Navbar role="admin" />

      <Container maxW="container.lg" textAlign="center" mb={12} pt={20}>
        <VStack spacing={6}>
          <Heading
            as="h1"
            size="2xl"
            color={COFFEE_SHOP_THEME.primary.darkBrown}
            fontWeight="bold"
            fontFamily="serif"
          >
            Barista Dashboard
          </Heading>
          <Text
            color={COFFEE_SHOP_THEME.primary.mediumBrown}
            fontSize="lg"
            maxW="2xl"
            fontStyle="italic"
          >
            Manage your coffee brews with precision and care
          </Text>
        </VStack>
      </Container>

      <Container maxW="container.xl">
        {products.length === 0 ? (
          <Center py={20}>
            <VStack spacing={4}>
              <Icon
                as={FiCoffee}
                boxSize={12}
                color={COFFEE_SHOP_THEME.primary.mediumBrown}
              />
              <Text color={COFFEE_SHOP_THEME.primary.mediumBrown} fontSize="xl">
                No coffee brews found
              </Text>
              <Text color={COFFEE_SHOP_THEME.primary.lightBrown}>
                Add your first brew to get started
              </Text>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {products.map((product) => (
              <Card
                key={product._id}
                bg={COFFEE_SHOP_THEME.gradients.card}
                border="1px"
                borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
                borderRadius="2xl"
                boxShadow="0 4px 20px rgba(93, 64, 55, 0.08)"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(93, 64, 55, 0.15)",
                }}
                overflow="hidden"
              >
                <Box position="relative">
                  <Image
                    src={decryptAES(product.image)} // <-- decrypt
                    alt={product.name}
                    height="200px"
                    width="100%"
                    objectFit="cover"
                    fallback={
                      <Center
                        height="200px"
                        bg={COFFEE_SHOP_THEME.primary.lightCream}
                      >
                        <Icon
                          as={FiImage}
                          boxSize={8}
                          color={COFFEE_SHOP_THEME.primary.mediumBrown}
                        />
                      </Center>
                    }
                  />

                  <Badge
                    position="absolute"
                    top={3}
                    left={3}
                    bg={COFFEE_SHOP_THEME.primary.accent}
                    color={COFFEE_SHOP_THEME.primary.cream}
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    BREW
                  </Badge>
                </Box>

                <CardBody p={5}>
                  <VStack align="start" spacing={3}>
                    <Heading
                      size="md"
                      color={COFFEE_SHOP_THEME.primary.darkBrown}
                      fontWeight="semibold"
                      noOfLines={2}
                      fontFamily="serif"
                    >
                      {product.name}
                    </Heading>

                    <Flex width="full" align="center">
                      <HStack spacing={1}>
                        <Icon
                          as={FiDollarSign}
                          color={COFFEE_SHOP_THEME.primary.accent}
                          boxSize={4}
                        />
                        <Text
                          fontSize="xl"
                          fontWeight="bold"
                          color={COFFEE_SHOP_THEME.primary.accent}
                        >
                          {product.price}
                        </Text>
                      </HStack>
                      <Spacer />
                      <Text
                        fontSize="sm"
                        color={COFFEE_SHOP_THEME.primary.mediumBrown}
                      >
                        ID: {product._id.slice(-6)}
                      </Text>
                    </Flex>

                    <HStack spacing={2} width="full" justify="space-between">
                      <IconButton
                        aria-label="Edit product"
                        icon={<FiEdit />}
                        size="sm"
                        colorScheme="orange"
                        variant="outline"
                        onClick={() => handleUpdate(product._id)}
                        flex={1}
                      />
                      <IconButton
                        aria-label="Delete product"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDelete(product._id)}
                        flex={1}
                      />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>

 
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader
            borderBottom="1px"
            borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
            bg={COFFEE_SHOP_THEME.primary.lightCream}
          >
            Update Coffee Brew
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel
                  fontWeight="medium"
                  color={COFFEE_SHOP_THEME.primary.darkBrown}
                >
                  Coffee Name
                </FormLabel>
                <Input
                  name="name"
                  value={updatedProduct.name}
                  onChange={handleInputChange}
                  placeholder="Enter coffee name"
                  borderRadius="lg"
                  bg={COFFEE_SHOP_THEME.primary.white}
                />
              </FormControl>
              <FormControl>
                <FormLabel
                  fontWeight="medium"
                  color={COFFEE_SHOP_THEME.primary.darkBrown}
                >
                  Price ($)
                </FormLabel>
                <Input
                  name="price"
                  type="number"
                  value={updatedProduct.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  borderRadius="lg"
                  bg={COFFEE_SHOP_THEME.primary.white}
                />
              </FormControl>
              <FormControl>
                <FormLabel
                  fontWeight="medium"
                  color={COFFEE_SHOP_THEME.primary.darkBrown}
                >
                  Image URL
                </FormLabel>
                <Input
                  name="image"
                  value={updatedProduct.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  borderRadius="lg"
                  bg={COFFEE_SHOP_THEME.primary.white}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter
            borderTop="1px"
            borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
            bg={COFFEE_SHOP_THEME.primary.lightCream}
          >
            <Button
              onClick={onClose}
              mr={3}
              variant="outline"
              borderRadius="lg"
            >
              Cancel
            </Button>
            <Button
              bg={COFFEE_SHOP_THEME.primary.accent}
              color={COFFEE_SHOP_THEME.primary.cream}
              _hover={{ bg: COFFEE_SHOP_THEME.primary.darkBrown }}
              borderRadius="lg"
              onClick={handleUpdateSubmit}
            >
              Update Brew
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminHomePage;
