import { Shield, Lock, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-muted/50 border-t mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Dados protegidos e criptografados
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">
              Consulta segura e confiável
            </span>
          </div>
          
          <div className="flex items-center justify-center md:justify-end gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Disponível 24/7
            </span>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 CPF Consulta. Sistema desenvolvido com React e TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;