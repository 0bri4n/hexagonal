import { createApp } from "./app"

const PORT = parseInt(
  process.env.NODE_ENV === "production"
    ? process.env.PROD_PORT || "3000"
    : process.env.DEV_PORT || "8080",
)

createApp(PORT)
