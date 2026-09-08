"use client";

import { PageContainer } from "@/components/layout/page-container";
import { FilamentForm } from "./components/filament-form";
import { useState } from "react";
import { FilamentTable } from "./components/filament-table";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Filament } from "@/lib/types";

export default function FilamentsPage() {
  const [registerFilament, setRegisterFilament] = useState<boolean>(false);
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null);

  const showForm = registerFilament || editingFilament !== null;

  function handleClose() {
    setRegisterFilament(false);
    setEditingFilament(null);
  }

  function handleNew() {
    setRegisterFilament(true);
    setEditingFilament(null);
  }

  return (
    <PageContainer
      title="Filamentos"
      description="Cadastre, consulte e edite seus filamentos"
    >
      <div className="flex justify-end mb-2">
        {registerFilament || showForm ? (
          <Button size="icon-sm" type="button" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="icon-sm" type="button" onClick={handleNew}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showForm ? (
        <FilamentForm filament={editingFilament} onSaved={handleClose} />
      ) : (
        <FilamentTable onEdit={setEditingFilament} />
      )}
    </PageContainer>
  );
}
