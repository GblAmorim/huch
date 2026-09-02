import React from "react";
import { UsedFilamentItem } from "./used-filament-item";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  usedFilaments: UsedFilament[];
  dispatch: React.Dispatch<ProductPricingAction>;
  registeredFilaments: RegisteredFilament[];
};

export const UsedFilamentList = React.memo(function UsedFilamentList({
  usedFilaments,
  dispatch,
  registeredFilaments,
}: Props) {
  return (
    <div className="dynamic-list">
      <h4>Filamentos utilizados</h4>

      {usedFilaments.map((filament, index) => (
        <UsedFilamentItem
          key={filament.id}
          filament={filament}
          index={index}
          registeredFilaments={registeredFilaments}
          onUpdate={(field) => {
            if (
              field.filamentId &&
              usedFilaments.some(
                (item) =>
                  item.id !== filament.id &&
                  item.filamentId === field.filamentId,
              )
            ) {
              toast.error("Este filamento já foi adicionado.");
              dispatch({
                type: "UPDATE_FILAMENT",
                payload: { id: filament.id, field: { filamentId: "" } },
              });
              return;
            }

            dispatch({
              type: "UPDATE_FILAMENT",
              payload: { id: filament.id, field },
            });
          }}
          onRemove={() =>
            dispatch({
              type: "REMOVE_FILAMENT",
              payload: { id: filament.id },
            })
          }
          canRemove={usedFilaments.length > 1}
        />
      ))}

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          dispatch({ type: "ADD_FILAMENT" });
        }}
      >
        Adicionar filamento
      </Button>
    </div>
  );
});
