export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      offices: {
        Row: {
          id: string
          name: string
          owner_name: string | null
          phone: string | null
          email: string | null
          plan: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_name?: string | null
          phone?: string | null
          email?: string | null
          plan?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_name?: string | null
          phone?: string | null
          email?: string | null
          plan?: string
          created_at?: string
        }
      }
      cars: {
        Row: {
          id: string
          office_id: string
          name: string
          plate: string | null
          status: string
          daily_price: number
          image_url: string | null
          insurance_expiry: string | null
          maintenance_date: string | null
          mileage: number | null
          is_ready: boolean
        }
        Insert: {
          id?: string
          office_id: string
          name: string
          plate?: string | null
          status?: string
          daily_price?: number
          image_url?: string | null
          insurance_expiry?: string | null
          maintenance_date?: string | null
          mileage?: number | null
          is_ready?: boolean
        }
        Update: {
          id?: string
          office_id?: string
          name?: string
          plate?: string | null
          status?: string
          daily_price?: number
          image_url?: string | null
          insurance_expiry?: string | null
          maintenance_date?: string | null
          mileage?: number | null
          is_ready?: boolean
        }
      }
      customers: {
        Row: {
          id: string
          office_id: string
          full_name: string
          phone: string | null
          id_number: string | null
          status: string
        }
        Insert: {
          id?: string
          office_id: string
          full_name: string
          phone?: string | null
          id_number?: string | null
          status?: string
        }
        Update: {
          id?: string
          office_id?: string
          full_name?: string
          phone?: string | null
          id_number?: string | null
          status?: string
        }
      }
      contracts: {
        Row: {
          id: string
          office_id: string
          car_id: string
          customer_id: string
          days: number
          total: number
          daily_price: number
          status: string
          start_date: string
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          office_id: string
          car_id: string
          customer_id: string
          days?: number
          total?: number
          daily_price?: number
          status?: string
          start_date?: string
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          office_id?: string
          car_id?: string
          customer_id?: string
          days?: number
          total?: number
          daily_price?: number
          status?: string
          start_date?: string
          end_date?: string | null
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          office_id: string
          car_id: string | null
          category: string | null
          amount: number
          description: string | null
          date: string
          payment_method: string
        }
        Insert: {
          id?: string
          office_id: string
          car_id?: string | null
          category?: string | null
          amount?: number
          description?: string | null
          date?: string
          payment_method?: string
        }
        Update: {
          id?: string
          office_id?: string
          car_id?: string | null
          category?: string | null
          amount?: number
          description?: string | null
          date?: string
          payment_method?: string
        }
      }
      blacklist: {
        Row: {
          id: string
          office_id: string
          customer_name: string
          id_number: string | null
          reason: string | null
          date: string
        }
        Insert: {
          id?: string
          office_id: string
          customer_name: string
          id_number?: string | null
          reason?: string | null
          date?: string
        }
        Update: {
          id?: string
          office_id?: string
          customer_name?: string
          id_number?: string | null
          reason?: string | null
          date?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases for use in components
export type Office = Database['public']['Tables']['offices']['Row']
export type OfficeInsert = Database['public']['Tables']['offices']['Insert']
export type OfficeUpdate = Database['public']['Tables']['offices']['Update']

export type Car = Database['public']['Tables']['cars']['Row']
export type CarInsert = Database['public']['Tables']['cars']['Insert']
export type CarUpdate = Database['public']['Tables']['cars']['Update']

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type Contract = Database['public']['Tables']['contracts']['Row']
export type ContractInsert = Database['public']['Tables']['contracts']['Insert']
export type ContractUpdate = Database['public']['Tables']['contracts']['Update']

export type Expense = Database['public']['Tables']['expenses']['Row']
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert']
export type ExpenseUpdate = Database['public']['Tables']['expenses']['Update']

export type BlacklistEntry = Database['public']['Tables']['blacklist']['Row']
export type BlacklistInsert = Database['public']['Tables']['blacklist']['Insert']
export type BlacklistUpdate = Database['public']['Tables']['blacklist']['Update']
