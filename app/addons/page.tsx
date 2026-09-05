import { PageContainer } from "@/components/layout/page-container";
import { AddonForm } from "./components/addon-form";

export default function AddonsPage() {
  return (
    <PageContainer
      title="Addons"
      description="Cadastre acessórios (produção) e embalagens (logística)"
    >
      <AddonForm />
    </PageContainer>
  );
}
