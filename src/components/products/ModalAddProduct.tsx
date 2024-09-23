"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function ModalAddProduct() {
  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0.0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [Socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io("http://localhost:8080");

    setSocket(socket);
    socket.on("connect", () => {
      console.log("Conectado al servidor de WebSockets");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newProduct = {
      name,
      stock,
      price,
      image,
      description,
    };

    console.log(newProduct);

    const res = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      //cerrar modal
      const modal = document.getElementById(
        "addProductModal"
      ) as HTMLInputElement;
      modal.checked = false;

      //limpiar campos
      setName("");
      setStock(0);
      setPrice(0.0);
      setImage("");
      setDescription("");

      if (Socket) {
        Socket.emit("product-updated", newProduct);
      }
    }
  };

  return (
    <>
      <label
        htmlFor={"addProductModal"}
        className="btn btn-md btn-primary text-xl"
      >
        Nuevo producto
      </label>

      <input type="checkbox" id={"addProductModal"} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-2xl font-bold">Dar de alta producto</h3>
          {/* <p className="py-4">Edición de usuario</p> */}

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label" htmlFor="name">
                Nombre
              </label>
              <input
                required
                type="text"
                id="name"
                name="name"
                className="input input-bordered"
                placeholder="Nombre del producto"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="stock">
                Stock
              </label>
              <input
                required
                type="number"
                id="stock"
                name="stock"
                className="input input-bordered"
                placeholder="Stock del producto"
                onChange={(e) => setStock(parseInt(e.target.value))}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="price">
                Precio
              </label>
              <input
                required
                type="number"
                id="price"
                name="price"
                className="input input-bordered"
                placeholder="Precio del producto"
                onChange={(e) => setPrice(parseFloat(e.target.value))}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="image">
                Imagen
              </label>
              <input
                required
                type="text"
                id="image"
                name="image"
                className="input input-bordered"
                placeholder="URL de la imagen"
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="description">
                Descripción
              </label>
              <textarea
                required
                id="description"
                name="description"
                className="textarea textarea-bordered"
                placeholder="Descripción del producto"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor={"addProductModal"}>
          Close
        </label>
      </div>
    </>
  );
}
