import { Product } from "../types/Product";
import Link from "next/link";

export default function Product({ product }: { product: Product }) {
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <Link href={`/${product.id}`}>
        <figure>
          <img src={product.image} alt="Shoes" />
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
          <p>{product.description}</p>
        </Link>
        <div className="card-actions justify-end">
          {/* <div className="badge badge-outline">Calidad asegurada</div> */}
          {/* <div className="badge badge-outline">Products</div> */}
          <button className="btn btn-sm btn-primary">Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
}
