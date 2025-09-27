export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image?: string
  gradient: string
  stock?: number
  description?: string
  videoUrl?: string
  carousel?: string[] 
}

// Interfaz simplificada para productos en selects
export interface SimpleProduct {
  id: string
  name: string
}

export interface CartItem extends Product {
  quantity: number
}

// Backend cart item structure (from database)
export interface BackendCartItem {
  producto_id: number
  cantidad: number
  nombre: string
  precio: number
  precio_original?: number
  precio_con_descuento?: number
  descuento?: number
  descuento_aplicado?: number
  descuento_individual?: number
  descuento_cantidad?: number
  imagen_url?: string
  video_url?: string
  stock: number
}

export interface User {
  id: number
  name: string
  email: string
  username: string
  rol?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface Order {
  id: string
  date: string
  total: number
  status: "completada" | "pendiente" | "cancelada"
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

// Backend history item structure
export interface BackendHistoryItem {
  id: number
  fecha: string
  total: number
  payment_id: string | null
  estado: string
  detalles: Array<{
    producto_id: number
    producto: string
    imagen_url: string | null
    cantidad: number
    precio_unitario: number
    descuento: number
    subtotal: number
  }>
}

export interface RegisterData {
  username: string
  name: string
  email: string
  password: string
  rut: string
  phone: string
  address: string
  comuna: string
  region: string
}

export type ApiUser = {
  id: number;
  username: string;
  email?: string;
  nombreCompleto?: string;
  rol?: string;
};

// API Response types
export interface LoginResponse {
  message: string;
  user: ApiUser;
  redirectUrl?: string;
}

export interface RegisterResponse {
  message: string;
  user?: ApiUser;
}

// User response type
export type UserResponse = ApiUser;

export interface LogoutResponse {
  message: string;
}

// Cart response type
export type CartResponse = BackendCartItem[];

export interface CartActionResponse {
  mensaje: string;
}

// History response type
export type HistoryResponse = BackendHistoryItem[];

// Discount interfaces
export interface Discount {
  id: string
  productId: string
  productName: string
  minQuantity: number
  percentage: number
  active: boolean
}

export interface BackendDiscount {
  id: number
  producto_id: number
  productName?: string
  minQuantity: number
  percentage: number
  active?: boolean
}

export interface DiscountFormData {
  productId: number
  minQuantity: number
  percentage: number
  active: boolean
}

export type DiscountsResponse = BackendDiscount[];

export interface DiscountActionResponse {
  message: string
  id?: number
}

// Admin interfaces
export interface AdminPingResponse {
  message: string
  timestamp?: string
}

// Category interfaces
export interface Category {
  id: number
  nombre: string
}

export type CategoriesResponse = Category[];

export interface CategoryFormData {
  nombre: string
}

export interface CategoryActionResponse {
  mensaje: string
  categoria?: Category
}

// Product management interfaces
export interface ProductFormData {
  nombre: string
  precio: number
  stock: number
  descripcion: string
  estado: string
  descuento: number
  imagen_url: string
  video_url?: string
  img_carrusel: string
  categorias: number[]
}

// Admin Product interface - específica para el panel de administración
export interface AdminProduct {
  id: string
  name: string
  price: number
  stock: number
  description: string
  categories: Category[]
  status: "activo" | "inactivo" | "mantenimiento"
  discount: number
  image: string
  video?: string
  carouselImages: string[]
}

export interface ProductActionResponse {
  message: string
  id?: number
}

// Order management interfaces
export interface OrderItem {
  producto_id: string
  producto: string
  imagen_url: string
  cantidad: number
  precio_unitario: number
  descuento: number
  subtotal: number
}

export interface AdminOrder {
  id: string
  customerName: string
  customerEmail: string
  customerRut?: string
  customerPhone?: string
  customerAddress?: string
  customerCity?: string
  customerRegion?: string
  date: string
  total: number
  status: "completada" | "pendiente" | "cancelada"
  items: OrderItem[]
}

export interface BackendAdminOrder {
  id: number
  usuario_nombre: string
  usuario_email: string
  usuario_rut?: string
  usuario_telefono?: string
  usuario_direccion?: string
  usuario_ciudad?: string
  usuario_region?: string
  fecha: string
  total: number
  estado: string
  detalles: OrderItem[]
}

export type AdminOrdersResponse = BackendAdminOrder[];

export interface OrderStatusUpdateResponse {
  message: string
}

export interface PaymentResponse {
  init_point: string
}
