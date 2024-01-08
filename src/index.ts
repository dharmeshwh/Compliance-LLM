import { configDotenv } from "dotenv";
import app from "./app";
import path from "path";

const T = path.join(__dirname, "/../.env");

configDotenv({ path: T });
const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`listning on port: ${PORT}`);
});
