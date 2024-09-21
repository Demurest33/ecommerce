import Image from "next/image";
export default function Login() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          // className="dark:invert"
          // src="https://nextjs.org/icons/next.svg"
          src="https://www.ucc.mx/wp-content/themes/ucc_site/public/images/xlogo.svg"
          alt="Next.js logo"
          width={300}
          height={38}
          priority
        />

        <h1 className="text-4xl font-[family-name:var(--font-geist-mono)]">
          Login/Register Page
        </h1>
        {/* 
        <h1 className="text-4xl font-[family-name:var(--font-font-geist-sans)]">
          Welcome to Next.js!
        </h1> */}

        <form
          action=""
          className="flex flex-col bg-primary p-8 gap-3 rounded-md"
        >
          <label htmlFor="email">Coreo Electrónico</label>
          <input
            type="email"
            name="email"
            id="email"
            className="input"
            placeholder="Coreo Electrónico"
          />
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            name="password"
            id="password"
            className="input"
            placeholder="Contraseña"
          />
          <button className="btn btn-primary">Login</button>
          <button className="btn btn-primary">Register</button>
        </form>
      </main>
    </div>
  );
}
