import connectDB from "./db/connection.js";
import { app } from "./app.js";
import { PORT } from "./utils/config.js";

const port = PORT || 3000;

connectDB()
.then(() => {
    app.on('error', (error) => {
        console.log(`Server ERROR : ${error}`);
    });

    app.listen(port, () => {
        console.log(`Server started on ${port}`);
    });
})
.catch((err) => {
    console.log(`MongoDB connection failed : ${err}`);
    process.exit(1);
});