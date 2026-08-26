CREATE TABLE "config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filament_cost_per_kg" real NOT NULL,
	"electricity_cost_per_kwh" real NOT NULL,
	"printer_power_watts" real NOT NULL,
	"labor_cost_per_hour" real NOT NULL,
	"profit_margin" real NOT NULL,
	"failure_rate" real DEFAULT 5,
	"overhead_percentage" real DEFAULT 10,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"piece_name" text NOT NULL,
	"filament_weight_g" real NOT NULL,
	"print_time_hours" real NOT NULL,
	"config_snapshot" jsonb NOT NULL,
	"material_cost" real NOT NULL,
	"energy_cost" real NOT NULL,
	"labor_cost" real NOT NULL,
	"overhead_cost" real NOT NULL,
	"total_cost" real NOT NULL,
	"final_price" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
