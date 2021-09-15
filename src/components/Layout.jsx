import Header from "./Header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="p-8">
        { children }
      </main>
    </>
  );
}