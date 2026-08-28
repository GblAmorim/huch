import React from "react";
import { Button } from "@/components/ui/button";
import { UsedAddonItem } from "./used-addon-item";

interface Props {
  registeredAddons: PricingBaseline["addons"];
  dispatch: React.Dispatch<ProductPricingAction>;
  usedAddons: UsedAddon[];
}

export const UsedAddonsList = React.memo(function UsedAddonsList({
  registeredAddons,
  usedAddons,
  dispatch,
}: Props) {
  return (
    <div className="dynamic-list">
      {usedAddons.map((addon, index) => (
        <UsedAddonItem
          key={addon.id}
          addon={addon}
          index={index}
          registeredAddons={registeredAddons}
          onUpdate={(field) =>
            dispatch({
              type: "UPDATE_ADDON",
              payload: { id: addon.id, field },
            })
          }
          onRemove={() =>
            dispatch({
              type: "REMOVE_ADDON",
              payload: { id: addon.id },
            })
          }
          canRemove={usedAddons.length > 1}
        />
      ))}

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          dispatch({ type: "ADD_ADDON" });
        }}
      >
        Adicionar Complemento
      </Button>
    </div>
  );
});
