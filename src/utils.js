import fs from "fs";
import axios from "axios";
//LLAMADO A LA API
/* export const getApi = async () => {
  const api = await axios("http://localhost:3001/productos");
  const data = api.data;
  console.log(data);
}; */
//getApi();
///////////PRODUCTOS///////////
export const leerProductos = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("productos.json", "utf8", (error, data) => {
      if (error) {
        reject("Problema al cargar Productos: " + JSON.stringify(error));
      } else resolve(JSON.parse(data));
      //console.log(data);
    });
  });
};

export const crearProdcto = (producto) => {
  return new Promise((resolve, reject) => {
    leerProductos()
      .then((data) => {
        //console.log(data);
        data.productos.push(producto);
        fs.writeFile(
          "productos.json",
          JSON.stringify(data, null, 2),
          "utf-8",
          (error) => {
            if (error) {
              reject("Error en guardar Porducto", error);
            } else {
              resolve(" Realizado con Exito");
            }
          }
        );
      })
      .catch((error) => {
        reject("Error en guardar el producto", error);
      });
  });
};

export const borrarProducto = (id) => {
  return new Promise((resolve, reject) => {
    fs.readFile("productos.json", "utf8", (error, data) => {
      if (error) reject(error);
      const productos = JSON.parse(data);
      if (id) {
        productos.productos = productos.productos.filter(
          (producto) => producto.id !== id
        );
      } else {
        console.log("no tengo");
      }

      fs.writeFile(
        "productos.json",
        JSON.stringify(productos, null, 2),
        "utf8",
        (error) => {
          if (error) reject(error);
          else resolve("Borrado con exito");
        }
      );
    });
  });
};

export const actualizarProducto = (
  id,
  nombre,
  descripcion,
  stock,
  precio,
  imagen
) => {
  return new Promise((resolve, reject) => {
    fs.readFile("productos.json", "utf8", (error, data) => {
      if (error) return reject(error);
      const productos = JSON.parse(data);

      productos.productos.map((product) => {
        if (product.id === id) {
          product.id = id;
          product.nombre = nombre;
          product.descripcion = descripcion;
          product.stock = stock;
          product.precio = precio;
          product.imagen = imagen;

          return productos.productos;
        }
      });

      fs.writeFile(
        "productos.json",
        JSON.stringify(productos, null, 2),
        "utf8",
        (error) => {
          if (error) reject(error);
          else resolve({ message: "Actualizado con exito" });
        }
      );
    });
  });
};

/////////////////////VENTAS//////////////
//LEER VENTAS
export const leerVentas = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("ventas.json", "utf8", (error, data) => {
      if (error) {
        reject("Problema al cargar ventas: " + JSON.stringify(error));
      } else resolve(JSON.parse(data));
      //console.log(data);
    });
  });
};
//CREAR VENTA

export const crearVenta = (producto) => {
  return new Promise((resolve, reject) => {
    leerVentas()
      .then((data) => {
        //console.log(data);
        data.ventas.push(producto);
        fs.writeFile(
          "ventas.json",
          JSON.stringify(data, null, 2),
          "utf-8",
          (error) => {
            if (error) {
              reject("Error en guardar ventas", error);
            } else {
              resolve("Venta realizada con exito ¡¡¡ FELICIDADES !!!");
            }
          }
        );
      })
      .catch((error) => {
        reject("Error en guardar el producto", error);
      });
  });
};
