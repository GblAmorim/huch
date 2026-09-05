import "dotenv/config";

import { db } from "./index";
import {
  filamentBrands,
  filamentMaterials,
  filamentTypes,
  filamentColors,
} from "./schema";

// ── 1. MARCAS DE FILAMENTO ─────────────────────────────────────────
const brands = [
  { label: "Bambu Lab" },
  { label: "Prusa Research" },
  { label: "eSUN" },
  { label: "SUNLU" },
  { label: "Overture" },
  { label: "Polymaker" },
  { label: "Creality" },
  { label: "Anycubic" },
  { label: "Flashforge" },
  { label: "Hatchbox" },
  { label: "Geeetech" },
  { label: "Voolt3D" },
  { label: "3D Fila" },
  { label: "GTMax3D" },
  { label: "Fillamento" },
  { label: "Printalot" },
  { label: "Up3D" },
  { label: "FiberThree" },
];

// ── 2. MATERIAIS DE FILAMENTO ──────────────────────────────────────
const materials = [
  { label: "PLA" },
  { label: "PLA+" },
  { label: "PETG" },
  { label: "ABS" },
  { label: "ASA" },
  { label: "TPU" },
  { label: "Nylon (PA)" },
  { label: "PC (Policarbonato)" },
  { label: "PVA" },
  { label: "HIPS" },
  { label: "PET" },
  { label: "PP (Polipropileno)" },
];

// ── 3. TIPOS DE FILAMENTO (variações/acabamentos) ──────────────────
const types = [
  { label: "Padrão" },
  { label: "Matte (Fosco)" },
  { label: "Silk (Seda)" },
  { label: "Metal (Aparência metálica)" },
  { label: "Transparente" },
  { label: "Glow (Fosforescente)" },
  { label: "Madeira (Wood)" },
  { label: "Fibra de Carbono (CF)" },
  { label: "Rainbow (Multicolor)" },
  { label: "Holográfico" },
  { label: "Termocrômico" },
];

// ── 4. CORES MAIS USADAS ───────────────────────────────────────────
const colors = [
  { label: "Preto" },
  { label: "Branco" },
  { label: "Cinza" },
  { label: "Azul" },
  { label: "Vermelho" },
  { label: "Verde" },
  { label: "Amarelo" },
  { label: "Laranja" },
  { label: "Rosa" },
  { label: "Roxo" },
  { label: "Marrom" },
  { label: "Bege" },
  { label: "Transparente" },
  { label: "Prata" },
  { label: "Dourado" },
  { label: "Ciano" },
];

async function main() {
  // onConflictDoNothing: se o label já existir (seed rodado antes ou item
  // criado pelo fluxo "Outros"), o insert é ignorado — o seed é idempotente.
  await db.insert(filamentBrands).values(brands).onConflictDoNothing();
  await db.insert(filamentMaterials).values(materials).onConflictDoNothing();
  await db.insert(filamentTypes).values(types).onConflictDoNothing();
  await db.insert(filamentColors).values(colors).onConflictDoNothing();

  console.log("Seed concluído:");
  console.log(`  Marcas: ${brands.length} itens`);
  console.log(`  Materiais: ${materials.length} itens`);
  console.log(`  Tipos: ${types.length} itens`);
  console.log(`  Cores: ${colors.length} itens`);
}

main()
  .catch((err) => {
    console.error("Erro no seed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
