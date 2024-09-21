import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <SearchBar />
      <main className="p-8">{children}</main>
    </>
  );
}
