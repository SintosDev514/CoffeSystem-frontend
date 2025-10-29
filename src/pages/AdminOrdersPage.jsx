import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Center,
  Button,
  useToast,
  HStack,
} from "@chakra-ui/react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import Navbar from "../components/Navbar";

const THEME = {
  darkBrown: "#5D4037",
  mediumBrown: "#8D6E63",
  lightBrown: "#A1887F",
  cream: "#F5E6D3",
  white: "#FFFFFF",
  lightCream: "#FDF5E6",
  accent: "#D2691E",
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
      else throw new Error("Unexpected response from server");
    } catch (err) {
      toast({
        title: "Failed to load orders",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order status");
      const updated = await res.json();

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: newStatus } : o))
      );

      toast({
        title: `Order ${updated._id.slice(-6)} updated`,
        description: `Status changed to "${newStatus}"`,
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "paid":
        return "green";
      case "ready to serve":
        return "orange";
      case "served":
        return "purple";
      default:
        return "yellow";
    }
  };

  return (
    <Box minH="100vh" bg={THEME.lightCream}>
      <Navbar role="admin" />

      <Container maxW="container.xl" pt={20} pb={10}>
        <VStack spacing={2} mb={8} textAlign="center">
          <Heading color={THEME.darkBrown}>Customer Orders</Heading>
          <Text color={THEME.mediumBrown}>
            Manage customer orders — confirm payment, mark ready to serve, or mark as served.
          </Text>
        </VStack>

        {loading ? (
          <Center py={20}>
            <Spinner size="xl" color={THEME.accent} />
          </Center>
        ) : orders.length === 0 ? (
          <Center py={20}>
            <Text color={THEME.mediumBrown}>No orders found yet.</Text>
          </Center>
        ) : (
          <Box
            overflowX="auto"
            bg={THEME.white}
            borderRadius="xl"
            boxShadow="md"
            p={2}
          >
            <Table variant="simple" size="md">
              <Thead bg={THEME.mediumBrown}>
                <Tr>
                  <Th color={THEME.cream}>Order ID</Th>
                  <Th color={THEME.cream}>Customer ID</Th>
                  <Th color={THEME.cream}>Items</Th>
                  <Th color={THEME.cream} isNumeric>Total (₱)</Th>
                  <Th color={THEME.cream}>Status</Th>
                  <Th color={THEME.cream}>Date</Th>
                  <Th color={THEME.cream} textAlign="center">
                    Action
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order._id} _hover={{ bg: THEME.lightCream }}>
                    <Td fontWeight="medium">{order._id.slice(-6)}</Td>
                    <Td>{order.customerId}</Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        {order.items?.map((item, i) => (
                          <Text key={i} fontSize="sm">
                            {item.name} × {item.quantity}
                          </Text>
                        ))}
                      </VStack>
                    </Td>
                    <Td isNumeric fontWeight="bold">
                      {order.total.toFixed(2)}
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={getBadgeColor(order.paymentStatus)}
                        px={3}
                        py={1}
                        borderRadius="full"
                        textTransform="capitalize"
                      >
                        {order.paymentStatus}
                      </Badge>
                    </Td>
                    <Td>{new Date(order.createdAt).toLocaleString("en-PH")}</Td>
                    <Td textAlign="center">
                      <HStack spacing={2} justify="center">
                        {order.paymentStatus === "pending" && (
                          <Button
                            size="sm"
                            bg="green.500"
                            color="white"
                            _hover={{ bg: "green.600" }}
                            onClick={() => updateOrderStatus(order._id, "paid")}
                          >
                            Mark as Paid
                          </Button>
                        )}

                        {order.paymentStatus === "paid" && (
                          <Button
                            size="sm"
                            bg="orange.400"
                            color="white"
                            _hover={{ bg: "orange.500" }}
                            onClick={() => updateOrderStatus(order._id, "ready to serve")}
                          >
                            Ready to Serve
                          </Button>
                        )}

                        {order.paymentStatus === "ready to serve" && (
                          <Button
                            size="sm"
                            bg={THEME.accent}
                            color="white"
                            _hover={{ bg: THEME.mediumBrown }}
                            onClick={() => updateOrderStatus(order._id, "served")}
                          >
                            Mark as Served
                          </Button>
                        )}

                        {order.paymentStatus === "served" && (
                          <Text color={THEME.mediumBrown} fontWeight="medium">
                            ✅ Served
                          </Text>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminOrdersPage;
