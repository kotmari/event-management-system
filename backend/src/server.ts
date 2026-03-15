import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import { errorHandler } from "./middleware/errorHandler"
import authRoutes from "./routes/authRoute";
import eventRoute from "./routes/eventRoute";
import { swaggerUi, swaggerDocument } from "./config/swagger";
import userRoute from "./routes/userRoute";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5001

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use('/api/events', eventRoute)
app.use('/api/user', userRoute)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler)

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})



