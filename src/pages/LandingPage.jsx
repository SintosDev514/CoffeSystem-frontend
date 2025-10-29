import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  HStack,
  Flex,
  Grid,
  GridItem,
  Icon,
  useBreakpointValue,
  Badge,
  Card,
  CardBody,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Fade,
  ScaleFade,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FiCoffee,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiRefreshCw,
  FiMapPin,
  FiGlobe,
  FiMenu,
  FiX,
  FiStar,
  FiUsers,
  FiZap,
  FiAward,
} from "react-icons/fi";



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
  coffee: {
    dark: "#3E2723",
    medium: "#5D4037",
    light: "#8D6E63",
    cream: "#F5E6D3",
    foam: "#F5F5DC",
  }
};

const NAVIGATION_ITEMS = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How It Works" },
  { id: "benefits", label: "Benefits" },
  { id: "testimonials", label: "Testimonials" }
];

const FEATURES = [
  {
    icon: FiGlobe,
    title: "Instant Browser Access",
    description: "Zero downloads required. Access instantly from any mobile browser with QR code scanning.",
    gradient: "linear-gradient(135deg, #8D6E63 0%, #A1887F 100%)",
    iconBg: "#8D6E63",
  },
  {
    icon: FiRefreshCw,
    title: "Real-Time Tracking",
    description: "Live order status updates from preparation to completion with visual progress indicators.",
    gradient: "linear-gradient(135deg, #A1887F 0%, #D7CCC8 100%)",
    iconBg: "#A1887F",
  },
  {
    icon: FiZap,
    title: "Order Status",
    description: "It display you ID and status precisely when your order is ready for pickup.",
    gradient: "linear-gradient(135deg, #D7CCC8 0%, #F5E6D3 100%)",
    iconBg: "#D7CCC8",
  },
  {
    icon: FiUsers,
    title: "Queue Management",
    description: "Advanced queue optimization to minimize wait times and maximize efficiency.",
    gradient: "linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)",
    iconBg: "#5D4037",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Scan & Access",
    description: "Use your phone's camera to scan the QR code and instantly access the menu",
    icon: FiGlobe,
    delay: 0.1,
    gradient: "linear-gradient(135deg, #8D6E63 0%, #A1887F 100%)",
  },
  {
    step: "02",
    title: "Customize Order",
    description: "Browse the digital menu and customize your order with precise specifications",
    icon: FiCoffee,
    delay: 0.2,
    gradient: "linear-gradient(135deg, #A1887F 0%, #D7CCC8 100%)",
  },
  {
    step: "03",
    title: "Track Live Progress",
    description: "Monitor real-time preparation status with visual progress indicators",
    icon: FiRefreshCw,
    delay: 0.3,
    gradient: "linear-gradient(135deg, #D7CCC8 0%, #F5E6D3 100%)",
  },
  {
    step: "04",
    title: "Seamless Pickup",
    description: "Receive smart notifications and collect your order without waiting",
    icon: FiMapPin,
    delay: 0.4,
    gradient: "linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)",
  },
];

const BENEFITS = [
  "Reduce wait times by up to 70%",
  "Real-time order preparation tracking",
  "No mobile app installation required",
  "Secure digital payment processing",
  "Personalized order preferences saved"
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Tech Professional",
    content: "BrewFlow has transformed my morning routine. Saving 15+ minutes daily adds up to hours of productivity each month!",
    rating: 5,
    avatar: "👩‍💼",
  },
  {
    name: "Marcus Rodriguez",
    role: "Cafe Owner",
    content: "Implementation increased our customer throughput by 40% while improving order accuracy significantly.",
    rating: 5,
    avatar: "👨‍💼",
  },
  {
    name: "Emily Watson",
    role: "Student",
    content: "The real-time tracking means I can time my arrival perfectly between classes. Brilliant execution!",
    rating: 5,
    avatar: "👩‍🎓",
  }
];

const ORDER_STATUSES = ["Ordered", "Brewing", "Ready"];



const NavigationBar = ({ scrolled, isMobile, onMenuToggle, scrollToSection, navigate }) => {
  const handleLogoClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box
      as="nav"
      bg={scrolled ? "rgba(93, 64, 55, 0.95)" : COFFEE_SHOP_THEME.primary.darkBrown}
      backdropFilter={scrolled ? "blur(10px)" : "none"}
      py={3}
      position="sticky"
      top={0}
      zIndex={1000}
      transition="all 0.3s ease"
      boxShadow={scrolled ? "0 4px 20px rgba(93, 64, 55, 0.2)" : "none"}
      borderBottom={scrolled ? "1px solid rgba(255,255,255,0.1)" : "none"}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <HStack 
            spacing={3} 
            cursor="pointer" 
            onClick={handleLogoClick}
            role="button"
            aria-label="Scroll to top"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
          >
            <Box
              bg={COFFEE_SHOP_THEME.gradients.accent}
              w={12}
              h={12}
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="all 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
              boxShadow="0 4px 12px rgba(141, 110, 99, 0.3)"
            >
              <FiCoffee size={24} color={COFFEE_SHOP_THEME.primary.cream} />
            </Box>
            <VStack spacing={0} align="start">
              <Heading size="lg" color={COFFEE_SHOP_THEME.primary.cream} fontWeight="bold">
                BrewFlow
              </Heading>
              <Text fontSize="xs" color={COFFEE_SHOP_THEME.coffee.foam} opacity={0.9}>
                ARTISAN COFFEE EXPERIENCE
              </Text>
            </VStack>
          </HStack>

       
          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            {NAVIGATION_ITEMS.map((item) => (
              <Text
                key={item.id}
                color={COFFEE_SHOP_THEME.primary.cream}
                fontWeight="medium"
                fontSize="sm"
                letterSpacing="wide"
                _hover={{ color: COFFEE_SHOP_THEME.coffee.foam, cursor: "pointer" }}
                onClick={() => scrollToSection(item.id)}
                transition="color 0.2s ease"
                aria-label={`Navigate to ${item.label}`}
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && scrollToSection(item.id)}
              >
                {item.label}
              </Text>
            ))}
            <Button
              bg={COFFEE_SHOP_THEME.primary.accent}
              color={COFFEE_SHOP_THEME.primary.cream}
              _hover={{ 
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(210, 105, 30, 0.3)" 
              }}
              _active={{ transform: "translateY(0)" }}
              onClick={() => navigate("/login")}
              size="md"
              fontWeight="bold"
              transition="all 0.2s ease"
              px={6}
            >
              Start Ordering
            </Button>
          </HStack>

          
          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label={isMobile ? "Close menu" : "Open menu"}
            icon={isMobile ? <FiX /> : <FiMenu />}
            onClick={onMenuToggle}
            variant="ghost"
            color={COFFEE_SHOP_THEME.primary.cream}
            _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
            size="lg"
          />
        </Flex>
      </Container>
    </Box>
  );
};

const MobileNavigation = ({ isOpen, onClose, scrollToSection, navigate }) => (
  <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
    <DrawerOverlay />
    <DrawerContent bg={COFFEE_SHOP_THEME.primary.darkBrown}>
      <DrawerCloseButton color={COFFEE_SHOP_THEME.primary.cream} size="lg" mt={4} mr={4} />
      <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255,255,255,0.1)" pt={16}>
        <HStack spacing={3}>
          <Box
            bg={COFFEE_SHOP_THEME.gradients.accent}
            w={10}
            h={10}
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiCoffee size={20} color={COFFEE_SHOP_THEME.primary.cream} />
          </Box>
          <VStack spacing={0} align="start">
            <Text color={COFFEE_SHOP_THEME.primary.cream} fontSize="xl" fontWeight="bold">
              BrewFlow
            </Text>
           
          </VStack>
        </HStack>
      </DrawerHeader>
      <DrawerBody py={8}>
        <VStack spacing={4} align="start">
          {NAVIGATION_ITEMS.map((item) => (
            <Box
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              py={3}
              width="100%"
              borderBottom="1px solid rgba(255,255,255,0.05)"
            >
              <Text
                color={COFFEE_SHOP_THEME.primary.cream}
                fontSize="lg"
                fontWeight="medium"
                _hover={{ color: COFFEE_SHOP_THEME.coffee.foam, cursor: "pointer" }}
                transition="color 0.2s ease"
              >
                {item.label}
              </Text>
            </Box>
          ))}
          <Button
            bg={COFFEE_SHOP_THEME.primary.accent}
            color={COFFEE_SHOP_THEME.primary.cream}
            _hover={{ bg: COFFEE_SHOP_THEME.primary.lightBrown }}
            onClick={() => navigate("/login")}
            size="lg"
            fontWeight="bold"
            width="100%"
            mt={6}
          >
            Start Ordering
          </Button>
        </VStack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

const OrderTrackingDemo = () => (
  <ScaleFade in={true} initialScale={0.9}>
    <Box
      bg={COFFEE_SHOP_THEME.gradients.card}
      p={8}
      borderRadius="2xl"
      boxShadow="0 20px 40px rgba(93, 64, 55, 0.1)"
      border="1px solid rgba(141, 110, 99, 0.1)"
      transition="all 0.3s ease"
      _hover={{ transform: "translateY(-8px)", boxShadow: "0 25px 50px rgba(93, 64, 55, 0.15)" }}
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="100%"
        h="100%"
        bg="radial-gradient(circle at 30% 20%, rgba(141, 110, 99, 0.05) 0%, transparent 50%)"
        zIndex={0}
      />
      
      <VStack spacing={4} align="start" position="relative" zIndex={1}>
        <HStack>
          <Icon as={FiCoffee} color={COFFEE_SHOP_THEME.primary.mediumBrown} />
          <Text fontSize="lg" fontWeight="bold" color={COFFEE_SHOP_THEME.primary.mediumBrown}>
            Live Order Dashboard
          </Text>
        </HStack>
        <Box w="100%" bg={COFFEE_SHOP_THEME.primary.white} p={4} borderRadius="xl" boxShadow="sm">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color={COFFEE_SHOP_THEME.primary.mediumBrown} fontWeight="semibold">
              Order #BFL-2847
            </Text>
            <Badge bg={COFFEE_SHOP_THEME.primary.lightBrown} color={COFFEE_SHOP_THEME.primary.cream} fontSize="xs" borderRadius="full">
              In Progress
            </Badge>
          </HStack>
          <Text fontSize="xs" color={COFFEE_SHOP_THEME.primary.darkGray} mb={3}>
            Caramel Macchiato • Est. 3-5 min
          </Text>
          
          
          <Box bg={COFFEE_SHOP_THEME.primary.mediumGray} h="6px" borderRadius="full" position="relative" overflow="hidden">
            <Box
              bg={COFFEE_SHOP_THEME.gradients.accent}
              h="6px"
              borderRadius="full"
              width="65%"
              position="absolute"
              transition="all 0.3s ease"
            />
          </Box>
          
          <HStack justify="space-between" mt={4}>
            {ORDER_STATUSES.map((status, index) => (
              <VStack key={status} spacing={1}>
                <Box 
                  w="14px" 
                  h="14px" 
                  bg={index < 2 ? COFFEE_SHOP_THEME.gradients.accent : COFFEE_SHOP_THEME.primary.mediumGray} 
                  borderRadius="full"
                  border={index < 2 ? "2px solid white" : "none"}
                  boxShadow={index < 2 ? "0 2px 4px rgba(141, 110, 99, 0.3)" : "none"}
                />
                <Text 
                  fontSize="xs" 
                  color={index < 2 ? COFFEE_SHOP_THEME.primary.mediumBrown : COFFEE_SHOP_THEME.primary.darkGray} 
                  fontWeight={index < 2 ? "bold" : "medium"}
                >
                  {status}
                </Text>
              </VStack>
            ))}
          </HStack>
        </Box>
      </VStack>
    </Box>
  </ScaleFade>
);

const SectionHeader = ({ badge, title, description, centered = true }) => (
  <VStack spacing={4} textAlign={centered ? "center" : "left"} maxW="container.md" mx="auto">
    <Badge
      variant="subtle"
      bg={COFFEE_SHOP_THEME.gradients.light}
      color={COFFEE_SHOP_THEME.primary.mediumBrown}
      px={4}
      py={1}
      borderRadius="full"
      fontSize="xs"
      fontWeight="bold"
      letterSpacing="wide"
    >
      {badge}
    </Badge>
    <Heading size="2xl" color={COFFEE_SHOP_THEME.primary.mediumBrown} fontWeight="bold" lineHeight="1.1">
      {title}
    </Heading>
    {description && (
      <Text fontSize="xl" color={COFFEE_SHOP_THEME.primary.darkGray} opacity={0.9} lineHeight="1.6">
        {description}
      </Text>
    )}
  </VStack>
);

const FeatureCard = ({ feature, index }) => (
  <GridItem>
    <Fade in={true} delay={index * 0.1}>
      <Card
        bg={COFFEE_SHOP_THEME.primary.white}
        border="1px solid"
        borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
        boxShadow="0 4px 20px rgba(93, 64, 55, 0.08)"
        transition="all 0.3s ease"
        _hover={{ transform: "translateY(-8px)", boxShadow: "0 20px 40px rgba(93, 64, 55, 0.12)" }}
        height="100%"
        borderRadius="2xl"
        overflow="hidden"
      >
        <CardBody p={8}>
          <VStack spacing={5} align="start">
            <Box
              bg={feature.gradient}
              p={4}
              borderRadius="xl"
              transition="all 0.3s ease"
              boxShadow="0 4px 12px rgba(93, 64, 55, 0.1)"
            >
              <Icon as={feature.icon} boxSize={6} color={COFFEE_SHOP_THEME.primary.cream} />
            </Box>
            <Text fontSize="xl" fontWeight="bold" color={COFFEE_SHOP_THEME.primary.mediumBrown}>
              {feature.title}
            </Text>
            <Text color={COFFEE_SHOP_THEME.primary.darkGray} lineHeight="1.7">
              {feature.description}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Fade>
  </GridItem>
);

const ProcessStep = ({ step }) => (
  <GridItem>
    <Fade in={true} delay={step.delay}>
      <VStack spacing={5} align="center" textAlign="center">
        <Box position="relative">
          <Box
            bg={step.gradient}
            w={20}
            h={20}
            borderRadius="2xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={COFFEE_SHOP_THEME.primary.cream}
            fontWeight="bold"
            fontSize="lg"
            mb={4}
            boxShadow="0 8px 20px rgba(93, 64, 55, 0.3)"
          >
            {step.step}
          </Box>
          <Box
            position="absolute"
            top={-2}
            right={-2}
            bg={COFFEE_SHOP_THEME.primary.white}
            w={10}
            h={10}
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 4px 12px rgba(93, 64, 55, 0.2)"
            border="2px solid"
            borderColor={COFFEE_SHOP_THEME.primary.lightBrown}
          >
            <Icon as={step.icon} color={COFFEE_SHOP_THEME.primary.lightBrown} boxSize={4} />
          </Box>
        </Box>
        <Text fontSize="xl" fontWeight="bold" color={COFFEE_SHOP_THEME.primary.mediumBrown}>
          {step.title}
        </Text>
        <Text color={COFFEE_SHOP_THEME.primary.darkGray} lineHeight="1.7">
          {step.description}
        </Text>
      </VStack>
    </Fade>
  </GridItem>
);

const BenefitsList = () => (
  <VStack spacing={4} align="start">
    {BENEFITS.map((benefit) => (
      <HStack key={benefit} spacing={4} align="start">
        <Box
          bg={COFFEE_SHOP_THEME.gradients.accent}
          w={6}
          h={6}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          mt={1}
        >
          <Icon as={FiCheckCircle} color={COFFEE_SHOP_THEME.primary.cream} boxSize={3} />
        </Box>
        <Text color={COFFEE_SHOP_THEME.primary.mediumBrown} fontSize="lg" fontWeight="medium">
          {benefit}
        </Text>
      </HStack>
    ))}
  </VStack>
);

const TestimonialCard = ({ testimonial }) => (
  <Card
    bg={COFFEE_SHOP_THEME.primary.white}
    border="1px solid"
    borderColor={COFFEE_SHOP_THEME.primary.mediumGray}
    borderRadius="2xl"
    boxShadow="0 4px 20px rgba(93, 64, 55, 0.08)"
    transition="all 0.3s ease"
    _hover={{ transform: "translateY(-4px)", boxShadow: "0 12px 28px rgba(93, 64, 55, 0.12)" }}
    height="100%"
  >
    <CardBody p={6}>
      <VStack spacing={4} align="start">
        <HStack spacing={2}>
          {[...Array(testimonial.rating)].map((_, i) => (
            <Icon key={i} as={FiStar} color={COFFEE_SHOP_THEME.primary.gold} boxSize={4} />
          ))}
        </HStack>
        <Text color={COFFEE_SHOP_THEME.primary.darkGray} fontStyle="italic" lineHeight="1.7">
          "{testimonial.content}"
        </Text>
        <HStack spacing={3}>
          <Text fontSize="2xl">{testimonial.avatar}</Text>
          <VStack spacing={0} align="start">
            <Text fontWeight="bold" color={COFFEE_SHOP_THEME.primary.mediumBrown}>
              {testimonial.name}
            </Text>
            <Text fontSize="sm" color={COFFEE_SHOP_THEME.primary.darkGray}>
              {testimonial.role}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </CardBody>
  </Card>
);

const CTASection = ({ navigate, scrollToSection }) => (
  <Box 
    py={24} 
    bg={COFFEE_SHOP_THEME.gradients.hero}
    position="relative"
    overflow="hidden"
  >
 
    <Box
      position="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      bg="radial-gradient(circle at 20% 80%, rgba(161, 136, 127, 0.1) 0%, transparent 50%)"
    />
    
    <Container maxW="container.md" position="relative" zIndex={1}>
      <VStack spacing={8} textAlign="center" color={COFFEE_SHOP_THEME.primary.cream}>
        <Heading size="2xl" fontWeight="bold" lineHeight="1.1">
          Ready to Transform Your Coffee Experience?
        </Heading>
        <Text fontSize="xl" opacity={0.9} lineHeight="1.6">
          Join thousands of coffee lovers who save time and enjoy seamless ordering with BrewFlow's intelligent platform.
        </Text>
        <HStack spacing={4} wrap="wrap" justify="center">
          <Button
            size="lg"
            bg={COFFEE_SHOP_THEME.primary.cream}
            color={COFFEE_SHOP_THEME.primary.mediumBrown}
            _hover={{ 
              transform: "translateY(-2px)",
              boxShadow: "0 12px 24px rgba(245, 230, 211, 0.3)" 
            }}
            _active={{ transform: "translateY(0)" }}
            px={8}
            fontWeight="bold"
            onClick={() => navigate("/login")}
            transition="all 0.2s ease"
            rightIcon={<FiArrowRight />}
          >
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            borderColor={COFFEE_SHOP_THEME.primary.cream}
            color={COFFEE_SHOP_THEME.primary.cream}
            _hover={{ bg: COFFEE_SHOP_THEME.primary.cream, color: COFFEE_SHOP_THEME.primary.mediumBrown }}
            onClick={() => scrollToSection("features")}
          >
            Learn More
          </Button>
        </HStack>
        <Text fontSize="sm" opacity={0.7}>
          No credit card required • Setup in 5 minutes
        </Text>
      </VStack>
    </Container>
  </Box>
);



const LandingPage = () => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onClose();
  }, [onClose]);

  const handleMenuToggle = useCallback(() => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpen, onOpen, onClose]);

  return (
    <Box minH="100vh" bg={COFFEE_SHOP_THEME.primary.lightCream}>
      <NavigationBar
        scrolled={scrolled}
        isMobile={isOpen}
        onMenuToggle={handleMenuToggle}
        scrollToSection={scrollToSection}
        navigate={navigate}
      />

      <MobileNavigation
        isOpen={isOpen}
        onClose={onClose}
        scrollToSection={scrollToSection}
        navigate={navigate}
      />

      {/* Hero Section */}
      <Box
        bg={COFFEE_SHOP_THEME.gradients.hero}
        py={{ base: 20, md: 28 }}
        position="relative"
        overflow="hidden"
      >
        {/* Background Elements */}
        <Box
          position="absolute"
          top={0}
          right={0}
          w="100%"
          h="100%"
          bg="radial-gradient(circle at 80% 20%, rgba(161, 136, 127, 0.1) 0%, transparent 50%)"
        />
        
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <Grid templateColumns={{ base: "1fr", md: "1.1fr 0.9fr" }} gap={16} alignItems="center">
            <GridItem>
              <VStack align="start" spacing={8}>
                <Badge
                  variant="solid"
                  px={5}
                  py={2}
                  borderRadius="full"
                  bg="rgba(255,255,255,0.15)"
                  color={COFFEE_SHOP_THEME.primary.cream}
                  fontSize="sm"
                  fontWeight="bold"
                  backdropFilter="blur(10px)"
                  border="1px solid rgba(255,255,255,0.2)"
                >
                  ☕ NO APP REQUIRED • INSTANT BROWSER ACCESS
                </Badge>
                <Heading 
                  size="3xl" 
                  fontWeight="bold" 
                  color={COFFEE_SHOP_THEME.primary.cream} 
                  lineHeight="1.1"
                >
                  Artisan Coffee, 
                  <Box color={COFFEE_SHOP_THEME.coffee.foam}>Modern Experience</Box>
                </Heading>
                <Text 
                  fontSize="xl" 
                  color={COFFEE_SHOP_THEME.coffee.foam} 
                  opacity={0.9} 
                  lineHeight="1.7"
                >
                  Experience the future of coffee ordering with BrewFlow's intelligent platform. 
                  Order, track, and enjoy—all from your mobile browser. No downloads, no waiting, just perfect coffee timing.
                </Text>
                <HStack spacing={4} wrap="wrap">
                  <Button
                    size="lg"
                    onClick={() => navigate("/login")}
                    rightIcon={<FiArrowRight />}
                    bg={COFFEE_SHOP_THEME.primary.cream}
                    color={COFFEE_SHOP_THEME.primary.mediumBrown}
                    _hover={{ 
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 24px rgba(245, 230, 211, 0.3)" 
                    }}
                    _active={{ transform: "translateY(0)" }}
                    fontWeight="bold"
                    px={8}
                    transition="all 0.2s ease"
                  >
                    Start Ordering
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor={COFFEE_SHOP_THEME.primary.cream}
                    color={COFFEE_SHOP_THEME.primary.cream}
                    _hover={{ bg: COFFEE_SHOP_THEME.primary.cream, color: COFFEE_SHOP_THEME.primary.mediumBrown }}
                    onClick={() => scrollToSection("features")}
                  >
                    See How It Works
                  </Button>
                </HStack>
              </VStack>
            </GridItem>
            <GridItem>
              <OrderTrackingDemo />
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" py={24} bg={COFFEE_SHOP_THEME.primary.white}>
        <Container maxW="container.xl">
          <VStack spacing={20}>
            <SectionHeader
              badge="POWERFUL FEATURES"
              title="Designed for Modern Coffee Lovers"
              description="Experience cutting-edge technology that transforms your daily coffee ritual into a seamless, efficient experience"
            />

            <Grid 
              templateColumns={{ 
                base: "1fr", 
                md: "repeat(2, 1fr)", 
                lg: "repeat(4, 1fr)" 
              }} 
              gap={8} 
              w="100%"
            >
              {FEATURES.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box id="how-it-works" py={24} bg={COFFEE_SHOP_THEME.primary.lightCream}>
        <Container maxW="container.xl">
          <VStack spacing={20}>
            <SectionHeader
              badge="SIMPLE PROCESS"
              title="How BrewFlow Works"
              description="Get your perfect coffee in four simple steps—designed for speed and convenience"
            />

            <Grid 
              templateColumns={{ 
                base: "1fr", 
                md: "repeat(2, 1fr)", 
                lg: "repeat(4, 1fr)" 
              }} 
              gap={12} 
              w="100%"
            >
              {PROCESS_STEPS.map((step) => (
                <ProcessStep key={step.step} step={step} />
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box id="benefits" py={24} bg={COFFEE_SHOP_THEME.primary.white}>
        <Container maxW="container.lg">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="start">
            <GridItem>
              <VStack spacing={8} align="start" height="100%">
                <SectionHeader
                  badge="KEY BENEFITS"
                  title="Why Coffee Lovers Choose BrewFlow"
                  centered={false}
                />
                <BenefitsList />
              </VStack>
            </GridItem>
            <GridItem>
              <VStack spacing={6}>
                <Box
                  bg={COFFEE_SHOP_THEME.gradients.premium}
                  p={8}
                  borderRadius="2xl"
                  color={COFFEE_SHOP_THEME.primary.cream}
                  boxShadow="0 20px 40px rgba(93, 64, 55, 0.2)"
                >
                  <VStack spacing={4} align="start">
                    <HStack>
                      <Icon as={FiAward} />
                      <Text fontSize="lg" fontWeight="bold">
                        Business Impact
                      </Text>
                    </HStack>
                    <Text fontSize="xl" fontStyle="italic" opacity={0.9} lineHeight="1.7">
                      "BrewFlow increased our customer satisfaction by 45% while reducing peak-hour wait times by 70%. The ROI was immediate."
                    </Text>
                    <Text fontWeight="medium" opacity={0.8}>
                      - Michael Tan, Multi-Location Cafe Owner
                    </Text>
                  </VStack>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box id="testimonials" py={24} bg={COFFEE_SHOP_THEME.primary.lightCream}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <SectionHeader
              badge="CUSTOMER STORIES"
              title="Loved by Coffee Enthusiasts"
              description="Join thousands of satisfied customers who transformed their coffee experience"
            />
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={8} w="100%">
              {TESTIMONIALS.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      
      <CTASection navigate={navigate} scrollToSection={scrollToSection} />
    </Box>
  );
};

export default LandingPage;