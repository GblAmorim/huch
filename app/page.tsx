"use client";

import { FixedConfigForm } from "@/components/forms/fixed-config-form";
import { PricingTable } from "@/components/common/pricing-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto max-w-6xl py-8 space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">HUCH</h1>
        <p className="text-muted-foreground">
          Sistema de cálculo de preço para peças impressas em 3D
        </p>
      </div>

      <div>
        <Link href="/product-pricing">
          <Button>Precificar Produto</Button>
        </Link>
        <Button>Cadastrar Filamentos</Button>
        <Button>Configurar Valores</Button>
        <Button>Listar Produtos</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Fixos (Configuração)</CardTitle>
          </CardHeader>
          <CardContent>
            <FixedConfigForm />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Precificações</CardTitle>
        </CardHeader>
        <CardContent>
          <PricingTable />
        </CardContent>
      </Card>
    </main>
  );
}
