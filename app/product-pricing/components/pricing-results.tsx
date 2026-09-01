import React from "react";

type Props = {
    pricingResults: PricingResult | null;
};

export const PricingResults = React.memo(function PricingResults({ totalPrice }: Props) {
    return (
        <div>
            <h4>Resultado da Precificação</h4>
            <p>Preço total: {totalPrice.toFixed(2)}</p>
        </div>
    );
});