import e from "express";
import productRoutes from "./src/routes/productRoutes.js"
import { errorMiddleware } from "./src/middleware/errorMiddleware.js";
const app = e();

const port = process.env.PORT || 5000;

app.use(e.json())
app.use(e.urlencoded({extended:false}))

app.use('/api/products', productRoutes)

app.use(errorMiddleware)
app.listen(port, () => console.log(`server is running on port ${port}`));
