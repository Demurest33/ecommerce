import { Product } from "@/types/Product";
import Link from "next/link";
interface Props {
  product: Product;
}

export default function DetailProduct({ product }: Props) {
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl border-y-2 max-w-[1700px] mx-auto">
      <figure>
        <img src={product.image} alt="Album" />
      </figure>
      <div className="card-body">
        <div className="h-full justify-between w-full p-8 ">
          <div className="flex flex-col mb-20">
            {product.stock > 0 ? (
              <h2 className="card-title">{product.name}</h2>
            ) : (
              <h2 className="card-title text-error">
                {product.name} - Sin stock
              </h2>
            )}
            <p>{product.description}</p>
          </div>

          <div className="flex ">
            <div className="card-actions">
              <span className="badge-lg rounded-badge badge-primary">
                <p className="text-xl ">${product.price}</p>
              </span>
              <span className="badge-lg rounded-lg badge-secondary">
                Stock: {product.stock}
              </span>
            </div>
          </div>
        </div>

        <div className="card-actions justify-end">
          {product.stock > 0 ? (
            <Link href={`/carrito/${product.id}`}>
              <button className="btn btn-primary">Comprar ahora</button>
            </Link>
          ) : (
            <button className="btn btn-primary" disabled>
              Sin stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
