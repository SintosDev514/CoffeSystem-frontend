import { create } from "zustand";

// Use Vite environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useProductStore = create((set) => ({
  products: [],

  // Fetch products (admin only)
  fetchProducts: async () => {
    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      if (!token) throw new Error("Admin token missing");

      const res = await fetch(`${API_URL}/api/products`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch products");

      set({ products: data.data || [] });
    } catch (err) {
      console.error("Error fetching products:", err);
      set({ products: [] });
      throw err;
    }
  },

  // Fetch products for users (no auth)
  fetchProductsForUsers: async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      set({ products: data.data || [] });
    } catch (err) {
      console.error("Error fetching products for users:", err);
      set({ products: [] });
    }
  },

  // Create product
  createProduct: async (newProduct) => {
    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      if (!token) throw new Error("Admin token missing");

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Product created successfully." };
    } catch (error) {
      console.error("Error creating product:", error);
      return { success: false, message: error.message || "Failed to create product." };
    }
  },

  // Update product
  updateProduct: async (pid, updatedProduct) => {
    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      if (!token) throw new Error("Admin token missing");

      const res = await fetch(`${API_URL}/api/products/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (res.status === 403) throw new Error("Not authorized. Please login again.");

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data.data : product
        ),
      }));

      return { success: true, message: "Product updated successfully." };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, message: error.message || "Failed to update product." };
    }
  },

  // Delete product
  deleteProduct: async (pid) => {
    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      if (!token) throw new Error("Admin token missing");

      const res = await fetch(`${API_URL}/api/products/${pid}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 403) throw new Error("Not authorized. Please login again.");

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, message: error.message || "Failed to delete product." };
    }
  },
}));
