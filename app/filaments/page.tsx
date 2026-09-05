import { PageContainer } from "@/components/layout/page-container";
import { FilamentForm } from "./components/filament-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function FilamentsPage() {
  return (
    <PageContainer
      title="Filamentos"
      description="Cadastre, consulte e edite seus filamentos"
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="packing-details">
          <AccordionTrigger>Cadastrar</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent>
                <FilamentForm />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* <FilamentsPage /> */}
    </PageContainer>
  );
}
