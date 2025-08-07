import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Search, User, MapPin, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCpfLookup } from "@/hooks/useCpfLookup";

const CpfLookup = () => {
  const [cpf, setCpf] = useState("");
  const { data, loading, error, lookupCpf, clearData, validateCpf, formatCpf } = useCpfLookup();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
  };

  const handleSearch = async () => {
    if (!validateCpf(cpf)) {
      toast({
        variant: "destructive",
        title: "CPF Inválido",
        description: "Por favor, insira um CPF válido.",
      });
      return;
    }

    try {
      await lookupCpf(cpf);
      if (!error) {
        toast({
          title: "Consulta realizada com sucesso",
          description: "Dados do CPF encontrados.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro na consulta",
        description: error || "Não foi possível consultar o CPF. Tente novamente.",
      });
    }
  };

  const handleClear = () => {
    setCpf("");
    clearData();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Search Form */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Consulta de CPF
          </CardTitle>
          <p className="text-muted-foreground">
            Digite o CPF para consultar informações cadastrais
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium">
              CPF
            </Label>
            <div className="flex gap-3">
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                className="flex-1 transition-all duration-300 focus:shadow-soft"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !cpf}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 min-w-[120px]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Consultar
                  </>
                )}
              </Button>
              {(cpf || data) && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="transition-all duration-300"
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {data && (
        <Card className="bg-gradient-card shadow-card border-0 animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="w-5 h-5 text-primary" />
              Dados Encontrados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold text-primary mb-2">Informações Pessoais</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Nome:</span>
                      <span className="ml-2">{data.name}</span>
                    </div>
                    <div>
                      <span className="font-medium">CPF:</span>
                      <span className="ml-2">{data.cpf}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">Nascimento:</span>
                      <span className="ml-2">{data.birthDate}</span>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        data.status === 'Regular' 
                          ? 'bg-accent/20 text-accent' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {data.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {data.address && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Endereço
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>{data.address.street}</div>
                      <div>{data.address.city} - {data.address.state}</div>
                      <div>CEP: {data.address.zipCode}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CpfLookup;