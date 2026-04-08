import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import routes from "./routes";
import { logger } from "./middlewares/logger.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
    res.send("Microsolvant API running 🚀");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", routes);

export default app;