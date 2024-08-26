const mongooose = require("mongoose");
const app = require("./app");

const { DB_HOST, PORT = 8000 } = process.env;

mongooose
  .connect(DB_HOST)
  .then(app.listen(PORT, () => console.log(`Server start at port ${PORT}`)))
  .catch((error) => console.log(error.message));
