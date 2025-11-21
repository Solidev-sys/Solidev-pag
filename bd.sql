-- =========================================================
-- Base de datos y configuración
-- =========================================================
CREATE DATABASE IF NOT EXISTS solidev
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE solidev;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- =========================================================
-- Tabla: planes
-- =========================================================
CREATE TABLE planes (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo          VARCHAR(32)  NOT NULL UNIQUE,      -- BASIC / STANDARD / PREMIUM
  nombre          VARCHAR(64)  NOT NULL,
  precio_centavos INT UNSIGNED NOT NULL,             -- precio en centavos
  moneda          CHAR(3)      NOT NULL DEFAULT 'CLP',
  ciclo_fact      ENUM('mensual','anual') NOT NULL DEFAULT 'mensual',
  mp_preapproval_plan_id VARCHAR(64) NULL UNIQUE,
  activo          TINYINT(1)   NOT NULL DEFAULT 1,
  mensaje_rapido  TINYINT(1)   NOT NULL DEFAULT 1,
  mensaje_seguro  TINYINT(1)   NOT NULL DEFAULT 1,
  resumen         VARCHAR(255) NULL,
  enlace_imagen   VARCHAR(255) NULL,
  creado_en       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- Tabla: caracteristicas_plan
-- =========================================================
CREATE TABLE caracteristicas_plan (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id    BIGINT UNSIGNED NOT NULL,
  etiqueta   VARCHAR(160) NOT NULL,
  posicion   INT          NOT NULL DEFAULT 0,        -- orden de despliegue
  CONSTRAINT fk_carac_plan_plan
    FOREIGN KEY (plan_id) REFERENCES planes(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT uq_plan_posicion UNIQUE (plan_id, posicion)
) ENGINE=InnoDB;

-- =========================================================
-- Tabla: usuarios
-- =========================================================
CREATE TABLE usuarios (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email            VARCHAR(191) NOT NULL UNIQUE,
  hash_password    VARCHAR(255) NOT NULL,
  nombre_completo  VARCHAR(120) NULL,
  telefono         VARCHAR(30)  NULL,
  estado           ENUM('activo','bloqueado','pendiente') NOT NULL DEFAULT 'activo',
  rol              ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
  mp_customer_id   VARCHAR(64) NULL,
  creado_en        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- =========================================================
-- Tabla: suscripciones
-- =========================================================
CREATE TABLE suscripciones (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id         BIGINT UNSIGNED NOT NULL,
  plan_id            BIGINT UNSIGNED NOT NULL,
  estado             ENUM('pendiente','autorizada','activa','pausada','cancelada','expirada') NOT NULL DEFAULT 'pendiente',
  mp_preapproval_id  VARCHAR(64) NULL UNIQUE,
  fecha_inicio       DATE NULL,
  proximo_cobro      DATE NULL,
  motivo_cancelacion VARCHAR(255) NULL,
  cancelada_en       DATETIME NULL,
  creado_en          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subs_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_subs_plan
    FOREIGN KEY (plan_id) REFERENCES planes(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_subs_usuario (usuario_id),
  INDEX idx_subs_plan (plan_id)
) ENGINE=InnoDB;

-- =========================================================
-- Tabla: pagos
-- =========================================================
CREATE TABLE pagos (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  suscripcion_id   BIGINT UNSIGNED NOT NULL,
  usuario_id       BIGINT UNSIGNED NOT NULL,
  mp_payment_id    VARCHAR(64) NULL UNIQUE,
  estado           ENUM('pendiente','aprobado','autorizado','en_proceso','rechazado','reembolsado','contracargo','cancelado') NOT NULL,
  monto_centavos   INT UNSIGNED NOT NULL,
  moneda           CHAR(3) NOT NULL DEFAULT 'CLP',
  intento_n        INT NOT NULL DEFAULT 1,
  pagado_en        DATETIME NULL,
  motivo_fallo     VARCHAR(255) NULL,
  payload_crudo    JSON NULL,
  creado_en        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pagos_subs
    FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pagos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_pagos_usuario_fecha (usuario_id, creado_en),
  INDEX idx_pagos_subs_fecha    (suscripcion_id, creado_en),
  INDEX idx_pagos_estado        (estado)
) ENGINE=InnoDB;

-- =========================================================
-- Tabla: facturas
-- =========================================================
CREATE TABLE facturas (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pago_id     BIGINT UNSIGNED NOT NULL UNIQUE,
  numero      VARCHAR(64)  NOT NULL,
  ruta_pdf    VARCHAR(255) NOT NULL,
  emitida_en  DATETIME     NOT NULL,
  impuesto_cent INT UNSIGNED NOT NULL DEFAULT 0,
  neto_cent     INT UNSIGNED NOT NULL,
  total_cent    INT UNSIGNED NOT NULL,
  CONSTRAINT fk_facturas_pago
    FOREIGN KEY (pago_id) REFERENCES pagos(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Trigger opcional: impedir factura si el pago no está aprobado
DELIMITER $$
CREATE TRIGGER trg_factura_solo_pago_aprobado
BEFORE INSERT ON facturas
FOR EACH ROW
BEGIN
  DECLARE v_estado VARCHAR(20);
  SELECT estado INTO v_estado FROM pagos WHERE id = NEW.pago_id;
  IF v_estado <> 'aprobado' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'No se puede emitir factura: el pago no está aprobado';
  END IF;
END$$
DELIMITER ;

-- =========================================================
-- Tabla: webhooks
-- =========================================================
CREATE TABLE webhooks (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id     BIGINT UNSIGNED NULL,
  proveedor      ENUM('mercadopago') NOT NULL,
  topico         VARCHAR(64) NOT NULL,
  id_externo     VARCHAR(64) NULL,
  id_evento      VARCHAR(64) NULL,
  recibido_en    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payload        JSON NOT NULL,
  procesado      TINYINT(1) NOT NULL DEFAULT 0,
  procesado_en   DATETIME NULL,
  error_proceso  VARCHAR(255) NULL,
  CONSTRAINT fk_webhook_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_wh_usuario (usuario_id),
  INDEX idx_wh_topico_ext (topico, id_externo),
  INDEX idx_wh_procesado  (procesado)
) ENGINE=InnoDB;

-- =========================================================
-- Tabla: notificaciones
-- =========================================================
CREATE TABLE notificaciones (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id      BIGINT UNSIGNED NOT NULL,
  tipo            ENUM('pago_fallido','pago_pendiente','pago_exitoso','suscripcion_cancelada') NOT NULL,
  canal           ENUM('email','whatsapp','sms','in_app') NOT NULL DEFAULT 'email',
  mensaje         VARCHAR(500) NOT NULL,
  id_relacionado  BIGINT UNSIGNED NULL,         -- id de pago o suscripción
  leida           TINYINT(1) NOT NULL DEFAULT 0,
  enviada_en      DATETIME NULL,
  creado_en       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_notif_usuario_fecha (usuario_id, creado_en),
  INDEX idx_notif_no_leidas     (leida)
) ENGINE=InnoDB;

-- =========================================================
-- Tabla: paginas_sitio
-- =========================================================
CREATE TABLE paginas_sitio (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(64)  NOT NULL UNIQUE,   -- 'index', 'sobre-nosotros'
  titulo        VARCHAR(120) NOT NULL,
  hero_titulo   VARCHAR(160) NULL,
  hero_texto    VARCHAR(500) NULL,
  tema_color    VARCHAR(64)  NOT NULL DEFAULT 'azul_verde_suave',
  imagenes      JSON NULL,
  creado_en     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;