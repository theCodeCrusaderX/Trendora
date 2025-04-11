import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(
  cors({
    origin: ["http://localhost:5173","https://trendora-lyart.vercel.app"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//api for user
import userRouter from "./routes/user.route.js"
app.use("/api/v1/users",userRouter)

//api for admin 
import adminRouter from "./routes/admin/products.route.js"
app.use("/api/v1/admin",adminRouter)

//api for admin/order 
import adminOrderRouter from "./routes/admin/order.route.js"
app.use("/api/v1/admin/order",adminOrderRouter)






//api for shop/user
import shopRouter from "./routes/shop/product.route.js"
app.use("/api/v1/shop",shopRouter)

//api for shop/cart
import shopCartRouter from "./routes/shop/cart.route.js"
app.use("/api/v1/shop/cart",shopCartRouter)

//api for shop/address
import shopAddressRouter from "./routes/shop/address.route.js"
app.use("/api/v1/shop/address",shopAddressRouter)

//api for shop/order
import shopOrderRouter from "./routes/shop/order.route.js"
app.use("/api/v1/shop/order",shopOrderRouter)


export {app}