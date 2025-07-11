import toast from "react-hot-toast";

const baseStyle = {
  background: "linear-gradient(to right, #2563EB, #7C3AED, #4F46E5)",
  color: "#fff",
  borderRadius: "12px",
  padding: "14px 18px",
  fontWeight: "500",
  fontSize: "15px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
};

export const Toast = {
  success: (msg) =>
    toast.success(msg, {
      position: "top-center",
      duration: 3000,
      style: baseStyle,
      iconTheme: {
        primary: "#10B981", // Green icon
        secondary: "#fff",
      },
    }),

  error: (msg) =>
    toast.error(msg, {
      position: "top-center",
      duration: 3000,
      style: baseStyle,
      iconTheme: {
        primary: "#EF4444", // Red icon
        secondary: "#fff",
      },
    }),
};
