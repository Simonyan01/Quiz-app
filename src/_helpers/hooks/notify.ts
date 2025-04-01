import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"

export const notify = (type: string, message: string) => {
  const isSuccess = type === "success"

  ;(toast as any)[type](message, {
    position: "top-center",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    style: {
      backgroundColor: isSuccess ? "oklch(0.723 0.219 149.579)" : "oklch(0.723 0.5 27)",
      backgroundImage: isSuccess ? "linear-gradient(to right, #08b46b, #15bf3f)" : "linear-gradient(to right, #f93b15, #f09819)",
      color: "#ffffff",
      fontSize: "18px",
      borderRadius: "8px",
      padding: "16px",
      letterSpacing: "1px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  })
}
