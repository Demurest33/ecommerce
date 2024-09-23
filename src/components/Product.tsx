import { Product } from "../types/Product";
import Link from "next/link";

export default function Product({ product }: { product: Product }) {
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <Link href={`/${product.id}`}>
        <figure>
          <img src={product.image} alt="Shoes" className="rounded-xl" />
        </figure>
      </Link>
      <div className="card-body">
        <Link href={`/${product.id}`}>
          <h2 className="card-title">
            {product.name}{" "}
            <div className="badge badge-secondary">
              {product.stock} disponibles
            </div>
          </h2>
          <h3>
            <span className="badge badge-outline">${product.price}</span>
          </h3>

          <p>{product.description}</p>
        </Link>
        <div className="card-actions justify-end">
          {/* <div className="badge badge-outline">Calidad asegurada</div> */}
          {/* <div className="badge badge-outline">Products</div> */}
          {product.stock === 0 ? null : (
            <button className="btn btn-sm btn-primary">Comprar ahora</button>
          )}
        </div>
      </div>
    </div>
  );
}
