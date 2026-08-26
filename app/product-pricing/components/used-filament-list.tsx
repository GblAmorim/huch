import React from "react";
import { RegisteredFilaments } from "../../product-pricing/types";
import { UsedFilamentItem } from "./used-filament-item";

type Props = {
  usedFilaments: FilamentoUsado[];
  dispatch: React.Dispatch<ProductPricingAction>;
  registeredFilaments: RegisteredFilaments[];
};

export const UsedFilamentList = React.memo(function UsedFilamentList({
  usedFilaments,
  dispatch,
  registeredFilaments,
}: Props) {
  return (
    <div className="dynamic-list">
      <h4>Filamentos utilizados</h4>

      {registeredFilaments.map((filamento, index) => (
        <UsedFilamentItem
          key={filamento.id}
          filamento={filamento}
          index={index}
          registeredFilaments={registeredFilaments}
          onUpdate={(field) =>
            dispatch({
              type: "UPDATE_FILAMENTO",
              payload: { id: filamento.id, field },
            })
          }
          onRemove={() =>
            dispatch({
              type: "REMOVE_FILAMENTO",
              payload: { id: filamento.id },
            })
          }
          canRemove={usedFilaments.length > 1}
        />
      ))}

      <button
        type="button"
        className="btn-add"
        onClick={() => dispatch({ type: "ADD_FILAMENTO" })}
      >
        + Adicionar filamento
      </button>
    </div>
  );
});
