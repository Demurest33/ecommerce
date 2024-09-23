"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Product } from "@/types/Product";

interface ModalEditProductProps {
  product: Product;
}

export default function ModalEditProduct({ product }: ModalEditProductProps) {
  const [name, setName] = useState(product.name);
  const [stock, setStock] = useState(product.stock);
  const [price, setPrice] = useState(product.price);
  const [image, setImage] = useState(product.image);
  const [description, setDescription] = useState(product.description);

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
    const { id } = product;

    const newProduct = {
      id,
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

      if (Socket) {
        Socket.emit("product-updated", newProduct);
      }
    }
  };

  return (
    <>
      <label htmlFor={"modal" + product.id} className="btn btn-sm btn-primary">
        Editar
      </label>

      <input
        type="checkbox"
        id={"modal" + product.id}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-2xl font-bold">{product.name}</h3>
          <p className="py-4">Edición de producto</p>

          <form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={product.id} />

            <div className="form-control">
              <label className="label" htmlFor="name">
                Nombre
              </label>
              <input
                required
                type="text"
                className="input input-bordered"
                name="name"
                value={name}
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
                name="stock"
                value={stock}
                className="input input-bordered"
                onChange={(e) => setStock(parseInt(e.target.value))}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="price">
                Precio
              </label>
              <input
                className="input input-bordered"
                required
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="image">
                Imagen
              </label>
              <input
                required
                className="input input-bordered"
                type="text"
                name="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="description">
                Descripción
              </label>
              <textarea
                required
                className="textarea textarea-bordered"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor={"modal" + product.id}>
          Close
        </label>
      </div>
    </>
  );
}
