import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { errorHandler } from "./middleware/errorHandler"
import testRoute from "./routes/testRoute"
import { swaggerUi, swaggerDocument } from "./config/swagger";

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "API is running" })
})

app.use("/api/test", testRoute)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler)

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})



