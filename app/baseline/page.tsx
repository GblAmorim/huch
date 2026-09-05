import { PageContainer } from "@/components/layout/page-container";
import { BaselineForm } from "./components/baseline-form";

export default function BaselinePage() {
  return (
    <PageContainer
      title="Dados Fixos"
      description="Configure os custos base para o cálculo de precificação"
    >
      <BaselineForm />
    </PageContainer>
  );
}
