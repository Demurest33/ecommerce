import Link from "next/link";

export default function notFound() {
  return (
    <main className="h-screen flex justify-center items-center flex-col text-6xl">
      <h1 className="mb-6">
        <strong>Error 404</strong>
      </h1>
      <p>No hemos podido encontrar lo que buscas :c</p>

      <Link href="/" className="btn btn-primary btn-lg mt-10">
        Regresar al inicio
      </Link>
    </main>
  );
}
