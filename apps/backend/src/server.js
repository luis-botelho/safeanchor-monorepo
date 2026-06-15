import cors from "cors";
import express from "express";
import { modulesRouter } from "./routes/modulesRoutes.js";
import vesselRoutes from "./routes/vesselRoutes.js";


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.json({
    name: "SafeAnchor API",
    status: "online",
  });
});

app.use("/modules", modulesRouter);
app.use("/vessels", vesselRoutes);

app.listen(port, () => {
  console.log(`SafeAnchor API rodando em http://localhost:${port}`);
});
