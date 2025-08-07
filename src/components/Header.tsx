import { Shield, FileSearch } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-gradient-primary shadow-soft">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-1">
              CPF Consulta
            </h1>
            <p className="text-white/90 text-sm flex items-center gap-2 justify-center">
              <FileSearch className="w-4 h-4" />
              Sistema de Consulta de Dados Cadastrais
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;