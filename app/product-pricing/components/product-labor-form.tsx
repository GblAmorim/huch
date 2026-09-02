"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  dispatch: React.Dispatch<ProductPricingAction>;
  baselineData: PricingBaseline["labor"];
};

export function LaborDataForm({ dispatch, baselineData }: Props) {
  const [modelingTimeHours, setModelingTimeHours] = useState("");
  const [modelingTimeMinutes, setModelingTimeMinutes] = useState("");
  const [postPrintingTimeHours, setPostPrintingTimeHours] = useState("");
  const [postPrintTimeMinutes, setPostPrintTimeMinutes] = useState("");

  function updateModelingTime(hours: string, minutes: string) {
    const hoursValue = Number(hours) || 0;
    const minutesValue = Number(minutes) || 0;

    dispatch({
      type: "UPDATE_PRODUCT_LABOR",
      payload: {
        field: {
          modelingTimeHours: hoursValue,
          modelingTimeMinutes: minutesValue,
          totalModelingTimeMinutes: hoursValue * 60 + minutesValue,
        },
      },
    });
  }

  function updatePostPrintingTime(hours: string, minutes: string) {
    const hoursValue = Number(hours) || 0;
    const minutesValue = Number(minutes) || 0;

    dispatch({
      type: "UPDATE_PRODUCT_LABOR",
      payload: {
        field: {
          postPrintingTimeHours: hoursValue,
          postPrintTimeMinutes: minutesValue,
          totalPostPrintTimeMinutes: hoursValue * 60 + minutesValue,
        },
      },
    });
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <Info className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <PopoverHeader>
            <PopoverTitle>Custos:</PopoverTitle>
            <PopoverDescription>
              <p>Modelagem: {baselineData.modelingLaborCostPerHour} R$/h</p>
              <p>Montagem: {baselineData.postPrintingLaborCostPerHour} R$/h</p>
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
      <div className="space-y-1.5">
        <div className="space-y-1.5 flex justify-between">
          <div className="space-y-1.5">
            <Label htmlFor="modelingTimeHours">Tempo de Modelagem</Label>
            <div className="flex items-center gap-1">
              <div>
                <Input
                  className="w-15 text-center"
                  id="modelingTimeHours"
                  type="number"
                  placeholder="HHH"
                  value={modelingTimeHours}
                  onChange={(e) => {
                    setModelingTimeHours(e.target.value);
                    updateModelingTime(e.target.value, modelingTimeMinutes);
                  }}
                />
              </div>
              <span className="text-sm font-semibold">:</span>
              <div>
                <Input
                  className="w-13 text-center"
                  id="modelingTimeMinutes"
                  type="number"
                  max={59}
                  placeholder="MM"
                  value={modelingTimeMinutes}
                  onChange={(e) => {
                    setModelingTimeMinutes(e.target.value);
                    updateModelingTime(modelingTimeHours, e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5 flex gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="postPrintingTimeHours">Tempo de Montagem</Label>
              <div className="flex items-center gap-1">
                <div>
                  <Input
                    className="w-15 text-center"
                    id="postPrintingTimeHours"
                    type="number"
                    placeholder="HHH"
                    value={postPrintingTimeHours}
                    onChange={(e) => {
                      setPostPrintingTimeHours(e.target.value);
                      updatePostPrintingTime(
                        e.target.value,
                        postPrintTimeMinutes,
                      );
                    }}
                  />
                </div>
                <span className="text-sm font-semibold">:</span>
                <div>
                  <Input
                    className="w-13 text-center"
                    id="postPrintTimeMinutes"
                    type="number"
                    max={59}
                    placeholder="MM"
                    value={postPrintTimeMinutes}
                    onChange={(e) => {
                      setPostPrintTimeMinutes(e.target.value);
                      updatePostPrintingTime(
                        postPrintingTimeHours,
                        e.target.value,
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
