CREATE TABLE "addons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"cost_per_unit" real NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "filament_brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"is_custom" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "filament_brands_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "filament_colors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"is_custom" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "filament_colors_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "filament_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"is_custom" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "filament_materials_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "filament_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"is_custom" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "filament_types_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "filaments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"material" text NOT NULL,
	"type" text NOT NULL,
	"color" text NOT NULL,
	"cost" real NOT NULL,
	"quantity_bought_g" real NOT NULL,
	"calibration_flow" real DEFAULT 0 NOT NULL,
	"price_per_kg" real NOT NULL,
	"note" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_baseline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"electricity_cost_per_kwh" real NOT NULL,
	"printer_power_watts" real NOT NULL,
	"labor_cost_per_hour" real NOT NULL,
	"packaging_cost_per_order" real DEFAULT 0 NOT NULL,
	"shipping_cost_per_km" real DEFAULT 0 NOT NULL,
	"profit_margin" real NOT NULL,
	"failure_rate" real DEFAULT 5 NOT NULL,
	"overhead_percentage" real DEFAULT 10 NOT NULL,
	"payment_fees" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"piece_name" text NOT NULL,
	"printing_data" jsonb NOT NULL,
	"addons" jsonb NOT NULL,
	"labor" jsonb NOT NULL,
	"baseline_snapshot" jsonb NOT NULL,
	"result" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
