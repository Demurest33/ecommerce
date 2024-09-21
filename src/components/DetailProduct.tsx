import { Product } from "@/types/Product";

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
        <h2 className="card-title">{product.name}</h2>
        <p>{product.description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Comprar</button>
        </div>
      </div>
    </div>
  );
}
