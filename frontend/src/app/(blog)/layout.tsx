import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import ScrollToTopBottom from "../../components/common/ScrollToTopBottom";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
      <ScrollToTopBottom />
    </div>
  );
}
