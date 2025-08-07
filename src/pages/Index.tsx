import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CpfLookup from "@/components/CpfLookup";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <CpfLookup />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
