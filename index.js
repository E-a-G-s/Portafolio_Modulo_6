import express from "express";
import { create } from "express-handlebars";
import { v4 as uuid } from "uuid";
import {
  leerProductos,
  crearProdcto,
  borrarProducto,
  actualizarProducto,
  leerVentas,
  crearVenta,
} from "./src/utils.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static("public"));

//HANDLEBARS
const hbs = create({
  partialsDir: ["views/partials"],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

//BD
app.listen(3001, () => {
  console.log("Conectado al puerto 3001");
});

app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/inventario", (req, res) => {
  leerProductos()
    .then((response) => {
      res.render("inventario", {
        productos: response.productos,
      });
      // console.log(response.productos.imagen);
      //console.log(response.cartonesingresados[0].numeros[0]);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

  //console.log(response.cartonesingresados[0].numeros[0]);
});
app.get("/carrito", (req, res) => {
  res.render("carrito");
});
app.get("/ventas", (req, res) => {
  res.render("ventas");
});

app.get("/", (req, res) => {
  //console.log(leerProductos());
  leerProductos()
    .then((response) => {
      res.render("productos", {
        productos: response.productos,
      });
      // console.log(response.productos.imagen);
      //console.log(response.cartonesingresados[0].numeros[0]);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
///////////////////////PRODUCTOS
app.get("/productos", async (req, res) => {
  try {
    const productos = await leerProductos();
    res.status(200).json(productos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/productos", (req, res) => {
  try {
    const { nombre, descripcion, stock, precio, imagen } = req.body;
    if (!nombre || !descripcion || !stock || !precio || !imagen) {
      res.status(400).json("Debe enviar todos los datos requeridos");
    }
    let nuevoProducto = {
      id: uuid().slice(0, 5),
      nombre,
      descripcion,
      stock,
      precio,
      imagen,
    };
    crearProdcto(nuevoProducto)
      .then((response) => {
        res.json({
          code: 201,
          message: "Producto creado correctamente",
        });
      })
      .catch((error) => {
        res.status(500).json({
          code: 500,
          message: "Ha ocurrido un error al guardar el producto.",
        });
      });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Ha ocurrido un error ingresar el producto.",
    });
  }
});

app.delete("/productos/:id", async (req, res) => {
  try {
    let { id } = req.params;
    if (id) {
      if (!id) return res.status(400).json({ error: "Faltan datos el ID" });
      const result = await borrarProducto(id);
      console.log(result);
      res.status(200).json(result);
    } else {
      return res.status(400).json("FALTA EL ID");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.put("/productos", async (req, res) => {
  try {
    const { id, nombre, descripcion, stock, precio, imagen } = req.body;
    if (id) {
      console.log(id);
      if (!id || !nombre || !descripcion || !stock || !precio || !imagen)
        return res.status(400).json({ error: "Faltan datos" });
      const actualizado = await actualizarProducto(
        id,
        nombre,
        descripcion,
        stock,
        precio,
        imagen
      );
      res.status(200).json(actualizado);
    } else {
      res.status(500).json({
        code: 500,
        message: " FALTA ID.",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Ha ocurrido un error al actualizar el producto.",
    });
  }
});

////////////VENTAS
//app get ventas
app.get("/ventas/api", async (req, res) => {
  try {
    const productos = await leerVentas();
    res.status(200).json(productos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//post venta

app.post("/ventas/api", async (req, res) => {
  try {
    const { total, producto } = req.body;
    if (!total || !producto) {
      res.status(400).json("Debe enviar todos los datos requeridos");
    }
    let today = new Date();
    let nuevaVenta = {
      id: uuid().slice(0, 5),
      fecha: today.toLocaleString(),
      total,
      producto,
    };
    const venta = await crearVenta(nuevaVenta);
    res.status(200).json(venta);
  } catch (error) {
    res.status(400).json(error.message);
  }
});
