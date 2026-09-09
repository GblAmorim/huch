ALTER TABLE "filaments" RENAME COLUMN "cost" TO "roll_price";--> statement-breakpoint
ALTER TABLE "filaments" RENAME COLUMN "quantity_bought_g" TO "roll_quantity";--> statement-breakpoint
DROP INDEX "filaments_brand_material_type_color_unique";--> statement-breakpoint
ALTER TABLE "filaments" ADD COLUMN "roll_size" real NOT NULL;--> statement-breakpoint
ALTER TABLE "filaments" ADD COLUMN "stock_quantity" real NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "filaments_brand_material_type_color_price_per_kg_unique" ON "filaments" USING btree ("brand","material","type","color","price_per_kg");