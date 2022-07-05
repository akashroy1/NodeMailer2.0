require("dotenv").config()
const app = require("./app");

const PORT = process.env.port || 8080

app.listen(8080, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
