export type MexicanState =
  | "AGUASCALIENTES"
  | "BAJA_CALIFORNIA"
  | "BAJA_CALIFORNIA_SUR"
  | "CAMPECHE"
  | "CHIAPAS"
  | "CHIHUAHUA"
  | "CDMX"
  | "COAHUILA"
  | "COLIMA"
  | "DURANGO"
  | "GUANAJUATO"
  | "GUERRERO"
  | "HIDALGO"
  | "JALISCO"
  | "MEXICO"
  | "MICHOACAN"
  | "MORELOS"
  | "NAYARIT"
  | "NUEVO_LEON"
  | "OAXACA"
  | "PUEBLA"
  | "QUERETARO"
  | "QUINTANA_ROO"
  | "SAN_LUIS_POTOSI"
  | "SINALOA"
  | "SONORA"
  | "TABASCO"
  | "TAMAULIPAS"
  | "TLAXCALA"
  | "VERACRUZ"
  | "YUCATAN"
  | "ZACATECAS";

export interface Destination {
  id: number;
  name: string;
  state: MexicanState;
  distanceKmFromCDMX: number;
  description: string;
  imageUrl: string;
  basePrice: number;
  featuredOrder: number | null;
  createdAt: string;
}