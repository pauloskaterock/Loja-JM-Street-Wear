import { Application } from "stimulus";
import CartController from "./controllers/cart_controller";

const app = Application.start();
app.register("cart", CartController);