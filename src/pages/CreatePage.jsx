import { useState, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  useToast,
  useColorModeValue,
  Text,
  Image,
  Icon,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import CryptoJS from "crypto-js";

import Navbar from "../components/Navbar";
import { useProductStore } from "../store/product";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: null,
    category: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const createProduct = useProductStore((state) => state.createProduct);

  const AES_KEY = "GwapoAdminSine2";


  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setNewProduct((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, WebP, or GIF image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setNewProduct((prev) => ({ ...prev, image: file }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleImageChange({ target: { files } });
  };

  const handleRemoveImage = () => {
    setNewProduct((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      handleImageChange(e);
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: name === "price" ? Number(value) : value,
      }));
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) return reject("Invalid file");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const encryptAES = (data) => CryptoJS.AES.encrypt(data, AES_KEY).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let productToSend = { ...newProduct };

    if (newProduct.image && newProduct.image instanceof Blob) {
      try {
        const base64 = await fileToBase64(newProduct.image);
        productToSend.image = encryptAES(base64);
      } catch (err) {
        console.error("Error converting image:", err);
        toast({
          title: "Error",
          description: "Failed to process image",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    } else {
      toast({
        title: "No valid image",
        description: "Please select a valid image before submitting",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await createProduct(productToSend);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });

    if (result.success) {
      setNewProduct({ name: "", price: "", image: null, category: "" });
      setImagePreview(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    }
  };

  const bgColor = useColorModeValue("white", "#1A202C");
  const boxShadowColor = useColorModeValue("lg", "dark-lg");
  const headingColor = useColorModeValue("#6F4E37", "#F5DEB3");
  const inputBg = useColorModeValue("white", "#2D3748");
  const inputColor = useColorModeValue("black", "white");
  const buttonBg = useColorModeValue("#6F4E37", "#8B5E3C");
  const buttonHoverBg = useColorModeValue("#5a3d2b", "#6F4E37");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const dragBorderColor = useColorModeValue("#6F4E37", "#8B5E3C");
  const dragBgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <>
      <Navbar />
      <Box maxW="600px" mx="auto" mt={10} p={6} bg={bgColor} borderRadius="lg" boxShadow={boxShadowColor}>
        <Heading mb={6} textAlign="center" color={headingColor}>Add New Coffee Product</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel color={inputColor}>Product Name</FormLabel>
              <Input name="name" value={newProduct.name} onChange={handleChange} placeholder="E.g., Cappuccino" bg={inputBg} color={inputColor} />
            </FormControl>

            <FormControl id="price" isRequired>
              <FormLabel color={inputColor}>Price</FormLabel>
              <Input type="number" name="price" value={newProduct.price} onChange={handleChange} placeholder="E.g., 3.50" bg={inputBg} color={inputColor} />
            </FormControl>

            <FormControl id="image" isRequired>
              <FormLabel color={inputColor}>Product Image</FormLabel>
              <Input ref={fileInputRef} type="file" name="image" accept="image/*" onChange={handleChange} display="none" />

              {!imagePreview ? (
                <Box
                  border="2px dashed"
                  borderColor={isDragging ? dragBorderColor : borderColor}
                  borderRadius="lg"
                  p={8}
                  textAlign="center"
                  cursor="pointer"
                  transition="all 0.2s"
                  bg={isDragging ? dragBgColor : "transparent"}
                  _hover={{ borderColor: dragBorderColor, bg: dragBgColor }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleUploadClick}
                >
                  <VStack spacing={3}>
                    <Icon as={FiUpload} boxSize={8} color="gray.400" />
                    <Text fontWeight="medium" color={inputColor}>Click to upload or drag and drop</Text>
                    <Text fontSize="sm" color="gray.500">PNG, JPG, GIF, WebP up to 5MB</Text>
                    <Button size="sm" colorScheme="brown" variant="outline" onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}>Choose File</Button>
                  </VStack>
                </Box>
              ) : (
                <Box position="relative">
                  <Box border="1px solid" borderColor={borderColor} borderRadius="lg" p={4}>
                    <HStack spacing={4} align="center">
                      <Image src={imagePreview} alt="Product preview" boxSize="80px" objectFit="cover" borderRadius="md" fallback={<Box boxSize="80px" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center"><Icon as={FiImage} boxSize={6} color="gray.400" /></Box>} />
                      <Box flex={1}>
                        <Text fontWeight="medium" color={inputColor}>{newProduct.image?.name || "Product image"}</Text>
                        <Text fontSize="sm" color="gray.500">{newProduct.image ? `${(newProduct.image.size / 1024 / 1024).toFixed(2)} MB` : "Image selected"}</Text>
                      </Box>
                      <Tooltip label="Remove image">
                        <Button size="sm" variant="ghost" colorScheme="red" onClick={handleRemoveImage}><Icon as={FiX} /></Button>
                      </Tooltip>
                    </HStack>
                  </Box>
                  <Button size="sm" variant="outline" colorScheme="brown" mt={3} width="full" onClick={handleUploadClick} leftIcon={<FiUpload />}>Change Image</Button>
                </Box>
              )}
            </FormControl>

            <FormControl id="category" isRequired>
              <FormLabel color={inputColor}>Category</FormLabel>
              <Select placeholder="Select category" name="category" value={newProduct.category} onChange={handleChange} bg={inputBg} color={inputColor}>
                <option value="coffee">Coffee</option>
                <option value="tea">Tea</option>
                <option value="pastry">Pastry</option>
                <option value="dessert">Dessert</option>
              </Select>
            </FormControl>

            <Button type="submit" bg={buttonBg} color="white" width="full" mt={4} _hover={{ bg: buttonHoverBg }} isDisabled={!newProduct.image || !(newProduct.image instanceof Blob)}>Add Product</Button>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default CreatePage;
