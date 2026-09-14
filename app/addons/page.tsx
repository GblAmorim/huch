"use client";

import { PageContainer } from "@/components/layout/page-container";
import { AddonForm } from "./components/addon-form";
import { AddonTable } from "./components/addon-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Addon } from "@/lib/types";

export default function AddonsPage() {
  const [registerAddon, setRegisterAddon] = useState<boolean>(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);

  const showForm = registerAddon || editingAddon !== null;

  function handleClose() {
    setRegisterAddon(false);
    setEditingAddon(null);
  }

  function handleNew() {
    setRegisterAddon(true);
    setEditingAddon(null);
  }

  return (
    <PageContainer
      title="Adicionais"
      description="Cadastre, consulte e edite seus acessórios e embalagens"
    >
      <div className="flex justify-end mb-2">
        {registerAddon || showForm ? (
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
        <AddonForm
          key={editingAddon?.id ?? "novo"}
          addon={editingAddon}
          onSaved={handleClose}
        />
      ) : (
        <AddonTable onEdit={setEditingAddon} />
      )}
    </PageContainer>
  );
}
