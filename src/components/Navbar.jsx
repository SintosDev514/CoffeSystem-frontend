import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Avatar,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCoffee,
  FaSignOutAlt,
  FaUserCog,
  FaChartBar,
  FaBell,
  FaCog,
  FaArrowLeft,
} from "react-icons/fa";

const COFFEE_SHOP_THEME = {
  primary: {
    darkBrown: "#5D4037",
    mediumBrown: "#8D6E63",
    lightBrown: "#A1887F",
    cream: "#F5E6D3",
    white: "#FFFFFF",
    accent: "#D2691E",
  },
  gradients: {
    accent: "linear-gradient(135deg, #8D6E63 0%, #A1887F 100%)",
    card: "linear-gradient(145deg, #FFFFFF 0%, #FDF5E6 100%)",
    premium: "linear-gradient(135deg, #8D6E63 0%, #5D4037 100%)",
  },
};

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const bgColor = COFFEE_SHOP_THEME.primary.darkBrown;
  const borderColor = COFFEE_SHOP_THEME.primary.mediumBrown;
  const textColor = COFFEE_SHOP_THEME.primary.cream;
  const secondaryText = COFFEE_SHOP_THEME.primary.lightBrown;
  const accentColor = COFFEE_SHOP_THEME.primary.accent;
  const hoverBg = COFFEE_SHOP_THEME.primary.mediumBrown;
  const cardBg = COFFEE_SHOP_THEME.gradients.card;

  const handleLogout = () => {
    if (role === "admin") localStorage.removeItem("ADMIN_TOKEN");
    else localStorage.removeItem("USER_TOKEN");
    toast({
      title: "Signed out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
    navigate("/login");
  };

  const isActiveRoute = (path) => location.pathname === path;
  const handleProfile = () => navigate("/admin/profile");
  const handleChangePassword = () => navigate("/changepassword"); /////////
  const onCreatePage =
    location.pathname === "/create" || location.pathname === "/admin/create";

  const handleBack = () => {
    if (role === "admin" || location.pathname.startsWith("/admin")) {
      navigate("/adminhomepage");
    } else {
      navigate("/");
    }
  };

  const handleCreate = () => {
    if (role === "admin") navigate("/admin/create");
    else navigate("/create");
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
      boxShadow="0 4px 12px rgba(0,0,0,0.15)"
    >
      <Flex
        align="center"
        justify="space-between"
        maxW="1400px"
        mx="auto"
        gap={4}
      >
        <Flex
          align="center"
          gap={3}
          cursor="pointer"
          onClick={() => navigate(role === "admin" ? "/adminhomepage" : "/")}
        >
          <Box p={2} bg={accentColor} borderRadius="xl" color={bgColor}>
            <FaCoffee size="20px" />
          </Box>
          <VStack spacing={0} align="start">
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              color={textColor}
              letterSpacing="tight"
            >
              BrewTrack
            </Text>
            <Text fontSize="xs" color={secondaryText} fontWeight="medium">
              {role === "admin" ? "Admin Dashboard" : "Welcome"}
            </Text>
          </VStack>
          {role === "admin" && (
            <Badge
              bg={accentColor}
              color={bgColor}
              ml={2}
              fontSize="xs"
              fontWeight="bold"
              px={2}
              py={1}
              borderRadius="full"
            >
              ADMIN
            </Badge>
          )}
        </Flex>

        <HStack
          spacing={2}
          flex={1}
          justify="center"
          display={{ base: "none", md: "flex" }}
        >
          {!onCreatePage ? (
            <>
              {role === "admin" && (
                <>
                  <Button
                    variant="ghost"
                    color={
                      isActiveRoute("/adminhomepage") ? accentColor : textColor
                    }
                    onClick={() => navigate("/adminhomepage")}
                    size="md"
                    fontWeight={
                      isActiveRoute("/adminhomepage") ? "semibold" : "normal"
                    }
                    _hover={{
                      bg: hoverBg,
                      color: COFFEE_SHOP_THEME.primary.white,
                      transform: "translateY(-1px)",
                    }}
                    leftIcon={<FaUserCog />}
                    transition="all 0.2s"
                  >
                    Dashboard
                  </Button>

                  <Button
                    variant="ghost"
                    color={
                      isActiveRoute("/adminorders") ? accentColor : textColor
                    }
                    onClick={() => navigate("/adminorders")}
                    size="md"
                    fontWeight={
                      isActiveRoute("/adminorders") ? "semibold" : "normal"
                    }
                    _hover={{
                      bg: hoverBg,
                      color: COFFEE_SHOP_THEME.primary.white,
                      transform: "translateY(-1px)",
                    }}
                    leftIcon={<FaChartBar />}
                    transition="all 0.2s"
                  >
                    Orders
                  </Button>
                </>
              )}

              <Button
                bg={accentColor}
                color={bgColor}
                size="md"
                onClick={handleCreate}
                _hover={{
                  bg: COFFEE_SHOP_THEME.primary.mediumBrown,
                  color: textColor,
                  transform: "translateY(-1px)",
                }}
                fontWeight="semibold"
                transition="all 0.2s"
              >
                Create New
              </Button>
            </>
          ) : (
            <Button
              leftIcon={<FaArrowLeft />}
              bg={COFFEE_SHOP_THEME.primary.lightBrown}
              color={bgColor}
              size="md"
              onClick={handleBack}
              _hover={{
                bg: COFFEE_SHOP_THEME.primary.mediumBrown,
                color: COFFEE_SHOP_THEME.primary.cream,
              }}
              fontWeight="semibold"
            >
              Back
            </Button>
          )}
        </HStack>

        <HStack spacing={2} flexShrink={0}>
          <IconButton
            aria-label="Notifications"
            icon={<FaBell />}
            variant="ghost"
            color={secondaryText}
          />
          <IconButton
            aria-label="Change Pasword"
            icon={<FaCog />}
            variant="ghost"
            color={secondaryText}
            onClick={handleChangePassword}
          />

          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              borderRadius="full"
              p={1}
              _hover={{ bg: hoverBg }}
            >
              <HStack spacing={2}>
                <Avatar
                  size="sm"
                  name="Admin User"
                  src=""
                  bg={accentColor}
                  color={bgColor}
                />
                <VStack
                  spacing={0}
                  align="start"
                  display={{ base: "none", lg: "flex" }}
                >
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    {role === "admin" ? "Admin User" : "User"}
                  </Text>
                  <Text fontSize="xs" color={secondaryText}>
                    {role === "admin" ? "Administrator" : "Customer"}
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
            <MenuList
              border="1px"
              borderColor={borderColor}
              boxShadow="0 4px 20px rgba(0,0,0,0.1)"
              py={2}
              bg={cardBg}
              minW="200px"
            >
              <MenuItem
                icon={<FaUserCog />}
                onClick={handleProfile}
                _hover={{ bg: hoverBg, color: COFFEE_SHOP_THEME.primary.white }}
              >
                Profile
              </MenuItem>
              <MenuItem
                icon={<FaCog />}
                onClick={handleChangePassword}
                _hover={{ bg: hoverBg, color: COFFEE_SHOP_THEME.primary.white }}
              >
                Change Password
              </MenuItem>
              <MenuDivider borderColor={borderColor} />
              <MenuItem
                icon={<FaSignOutAlt />}
                onClick={handleLogout}
                _hover={{
                  bg: "#b33a3a",
                  color: COFFEE_SHOP_THEME.primary.white,
                }}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <HStack
        spacing={2}
        justify="center"
        mt={3}
        display={{ base: "flex", md: "none" }}
        overflowX="auto"
        pb={2}
      >
        {!onCreatePage ? (
          <>
            {role === "admin" && (
              <>
                <Button
                  variant="ghost"
                  color={
                    isActiveRoute("/adminhomepage") ? accentColor : textColor
                  }
                  onClick={() => navigate("/adminhomepage")}
                  size="sm"
                  fontWeight={
                    isActiveRoute("/adminhomepage") ? "semibold" : "normal"
                  }
                  _hover={{
                    bg: hoverBg,
                    color: COFFEE_SHOP_THEME.primary.white,
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  variant="ghost"
                  color={
                    isActiveRoute("/adminorders") ? accentColor : textColor
                  }
                  onClick={() => navigate("/adminorders")}
                  size="sm"
                  fontWeight={
                    isActiveRoute("/adminorders") ? "semibold" : "normal"
                  }
                  _hover={{
                    bg: hoverBg,
                    color: COFFEE_SHOP_THEME.primary.white,
                  }}
                >
                  Orders
                </Button>
              </>
            )}

            <Button
              bg={accentColor}
              color={bgColor}
              size="sm"
              onClick={handleCreate}
              _hover={{
                bg: COFFEE_SHOP_THEME.primary.mediumBrown,
                color: textColor,
              }}
              fontWeight="semibold"
            >
              Create
            </Button>
          </>
        ) : (
          <Button
            leftIcon={<FaArrowLeft />}
            bg={COFFEE_SHOP_THEME.primary.lightBrown}
            color={bgColor}
            size="sm"
            onClick={handleBack}
            _hover={{
              bg: COFFEE_SHOP_THEME.primary.mediumBrown,
              color: COFFEE_SHOP_THEME.primary.cream,
            }}
            fontWeight="semibold"
          >
            Back
          </Button>
        )}
      </HStack>
    </Box>
  );
};

export default Navbar;
