// sessionUtils.js - Manage persistent customer ID across browser sessions
export const getCustomerId = () => {
  return localStorage.getItem("customerId");
};

export const setCustomerId = (id) => {
  localStorage.setItem("customerId", id);
};

export const hasCustomerId = () => {
  return !!localStorage.getItem("customerId");
};

export const clearCustomerId = () => {
  localStorage.removeItem("customerId");
};

export const generateCustomerId = () => {
  return "CUST-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
};
