"use client";

import { PageContainer } from "@/components/layout/page-container";
import { FilamentForm } from "./components/filament-form";
import { useState } from "react";
import { FilamentTable } from "./components/filament-table";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FilamentsPage() {
  const [registerFilament, setRegisterFilament] = useState<boolean>(false);

  return (
    <PageContainer
      title="Filamentos"
      description="Cadastre, consulte e edite seus filamentos"
    >
      {registerFilament ? (
        <div className="flex justify-end mb-2">
          <Button
            size="icon-sm"
            type="button"
            onClick={() => setRegisterFilament(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex justify-end mb-2">
          <Button
            size="icon-sm"
            type="button"
            onClick={() => setRegisterFilament(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {registerFilament ? <FilamentForm /> : <FilamentTable />}
    </PageContainer>
  );
}
