export interface BackendUsuario {
  id: number
  email: string
  hash_password: string
  nombre_completo?: string | null
  telefono?: string | null
  estado: 'activo' | 'bloqueado' | 'pendiente'
  rol: 'cliente' | 'admin'
  mp_customer_id?: string | null
  creado_en?: string
  actualizado_en?: string

  suscripciones?: BackendSuscripcion[]
  pagos?: BackendPago[]
  notificaciones?: BackendNotificacion[]
  webhooks?: BackendWebhook[]
}

export interface BackendPlan {
  id: number
  codigo: string
  nombre: string
  precio_centavos: number
  moneda: string
  dias_prueba_gratis?: number
  ciclo_fact: 'mensual' | 'anual'
  mp_preapproval_plan_id?: string | null
  activo: boolean
  mensaje_rapido: boolean
  mensaje_seguro: boolean
  resumen?: string | null
  enlace_imagen?: string | null
  creado_en?: string
  actualizado_en?: string

  caracteristicas?: BackendCaracteristicaPlan[]
}

export interface BackendCaracteristicaPlan {
  id: number
  plan_id: number
  etiqueta: string
  posicion: number
}

export interface BackendSuscripcion {
  id: number
  usuario_id: number
  plan_id: number
  estado: 'pendiente' | 'autorizada' | 'activa' | 'pausada' | 'cancelada' | 'expirada'
  mp_preapproval_id?: string | null
  fecha_inicio?: string | null
  proximo_cobro?: string | null
  motivo_cancelacion?: string | null
  cancelada_en?: string | null
  creado_en?: string
  actualizado_en?: string

  Usuario?: BackendUsuario
  Plan?: BackendPlan
  pagos?: BackendPago[]
}

export interface BackendPago {
  id: number
  suscripcion_id: number
  usuario_id: number
  mp_payment_id?: string | null
  estado:
    | 'pendiente'
    | 'aprobado'
    | 'autorizado'
    | 'en_proceso'
    | 'rechazado'
    | 'reembolsado'
    | 'contracargo'
    | 'cancelado'
  monto_centavos: number
  moneda: string
  intento_n: number
  pagado_en?: string | null
  motivo_fallo?: string | null
  payload_crudo?: unknown
  creado_en?: string
  actualizado_en?: string

  Suscripcion?: BackendSuscripcion
  Usuario?: BackendUsuario
  factura?: BackendFactura | null
}

export interface BackendFactura {
  id: number
  pago_id: number
  numero: string
  ruta_pdf: string
  emitida_en: string
  impuesto_cent: number
  neto_cent: number
  total_cent: number

  pago?: BackendPago
}

export interface BackendWebhook {
  id: number
  proveedor: 'mercadopago'
  topico: string
  id_externo?: string | null
  id_evento?: string | null
  recibido_en: string
  payload: unknown
  procesado: boolean
  procesado_en?: string | null
  error_proceso?: string | null

  usuario_id?: number
  Usuario?: BackendUsuario
}

export interface BackendNotificacion {
  id: number
  usuario_id: number
  tipo: 'pago_fallido' | 'pago_pendiente' | 'pago_exitoso' | 'suscripcion_cancelada'
  canal: 'email' | 'whatsapp' | 'sms' | 'in_app'
  mensaje: string
  id_relacionado?: number | null
  leida: boolean
  enviada_en?: string | null
  creado_en?: string

  Usuario?: BackendUsuario
}

export interface BackendPaginaSitio {
  id: number
  slug: string
  titulo: string
  hero_titulo?: string | null
  hero_texto?: string | null
  tema_color: string
  imagenes?: string[] | null
  creado_en?: string
  actualizado_en?: string
}

// Response aliases (listas por modelo)
export type UsuariosResponse = BackendUsuario[]
export type PlanesResponse = BackendPlan[]
export type CaracteristicasResponse = BackendCaracteristicaPlan[]
export type SuscripcionesResponse = BackendSuscripcion[]
export type PagosResponse = BackendPago[]
export type FacturasResponse = BackendFactura[]
export type WebhooksResponse = BackendWebhook[]
export type NotificacionesResponse = BackendNotificacion[]
export type PaginasResponse = BackendPaginaSitio[]
