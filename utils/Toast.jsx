import toast from "react-hot-toast";

const baseStyle = {
  background: "#ffffff",           // White background
  color: "#111827",                // Dark text for readability
  borderRadius: "12px",
  padding: "14px 18px",
  fontWeight: 500,
  fontSize: "15px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  minWidth: "250px",
};

export const Toast = {
  success: (msg) =>
    toast.success(msg, {
      position: "top-center",
      duration: 3500,
      style: baseStyle,
      iconTheme: {
        primary: "#10B981", // Green tick
        secondary: "#ffffff", // White background behind icon
      },
    }),

  error: (msg) =>
    toast.error(msg, {
      position: "top-center",
      duration: 3500,
      style: { ...baseStyle, color: "#fff", background: "#EF4444" }, // Red background for errors
      iconTheme: {
        primary: "#ffffff",
        secondary: "#EF4444",
      },
    }),

  info: (msg) =>
    toast(msg, {
      position: "top-center",
      duration: 3500,
      style: { ...baseStyle, color: "#ffffff", background: "#6366F1" }, // Indigo info
      iconTheme: {
        primary: "#ffffff",
        secondary: "#6366F1",
      },
    }),
};
