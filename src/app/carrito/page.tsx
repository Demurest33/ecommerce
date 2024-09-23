import Link from "next/link";

export default function Carrito() {
  return (
    <main className="h-screen flex justify-center items-center flex-col text-6xl">
      <h1 className="mb-6">
        <strong>Tu carrito está vacio</strong>
      </h1>
      <p>Explora nuestros productos y comprate algo bonito</p>

      <Link href="/" className="btn btn-primary text-xl my-6">
        Ir a la tienda
      </Link>
    </main>
  );
}
