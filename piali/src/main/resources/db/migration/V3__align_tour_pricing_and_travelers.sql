-- Alinea la tabla `tour` con la entidad Tour.
-- ddl-auto=update no pudo crear estas columnas NOT NULL sobre una tabla ya poblada,
-- por eso fallaban las consultas con "column adult_price does not exist".

-- 1) price_per_person (double precision) -> adult_price (numeric(10,2), como BigDecimal)
ALTER TABLE tour RENAME COLUMN price_per_person TO adult_price;
ALTER TABLE tour ALTER COLUMN adult_price TYPE numeric(10, 2);

-- 2) currentTravelers -> columna `travelers`, arranca en 0 (rellena filas existentes)
ALTER TABLE tour ADD COLUMN IF NOT EXISTS travelers integer NOT NULL DEFAULT 0;

-- 3) El enum TourType incluye 'OTRO', pero el CHECK original lo omitía.
ALTER TABLE tour DROP CONSTRAINT IF EXISTS tour_tour_type_check;
ALTER TABLE tour ADD CONSTRAINT tour_tour_type_check
    CHECK (tour_type IN ('CULTURAL', 'AVENTURA', 'GASTRONOMICO', 'NATURALEZA', 'HISTORICO', 'OTRO'));
