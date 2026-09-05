import { PageContainer } from "@/components/layout/page-container";
import { ProductsTable } from "@/app/products/components/products-table";

export default function ProductsPage() {
  return (
    <PageContainer
      title="Produtos"
      description="Lista de peças precificadas e salvas"
    >
      <ProductsTable />
    </PageContainer>
  );
}
