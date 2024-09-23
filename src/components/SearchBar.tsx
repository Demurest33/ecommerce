"use client";
import { getProductsByName } from "@/app/services/productsService";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;

    const products = await getProductsByName(search);

    if (products.length === 0) {
      alert("No se encontraron productos");
      return;
    }
    let url = `/${products[0].id}`;
    router.push(url);
  };

  return (
    <div className="form-control w-full my-12">
      <label className="input input-bordered md:w-2/3 max-md:w-1/2 max-sm:w-72 mx-auto flex items-center">
        <svg
          className="w-6 h-6 mr-2 opacity-70"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          />
        </svg>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="grow"
            name="search"
            placeholder="Busca en nuestro catálogo"
          />
        </form>
        {/* <kbd className="kbd kbd-sm">⌘</kbd>
        <kbd className="kbd kbd-sm">K</kbd> */}
      </label>
    </div>
  );
}
