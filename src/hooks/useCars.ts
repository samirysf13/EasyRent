import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Car } from '../lib/database.types'

export const OFFICE_ID = 'f05d033e-d16e-40ac-99a9-cc1e1fcb977c'

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none"><rect width="120" height="80" fill="%231e293b"/><text x="60" y="45" text-anchor="middle" fill="%2364748b" font-size="10" font-family="sans-serif">EasyRent</text></svg>')

/** Shape expected by Dashboard UI (CarRow, expense dropdown, etc.) */
export interface CarDisplay {
  id: string
  name: string
  plate: string
  status: string
  price: string
  image: string
  insurance_expiry: string | null
  maintenance_date: string | null
  mileage: number | null
  is_ready: boolean
}

function mapCarToDisplay(car: Car): CarDisplay {
  return {
    id: car.id,
    name: car.name,
    plate: car.plate ?? '',
    status: car.status,
    price: String(car.daily_price),
    image: car.image_url?.trim() ? car.image_url : PLACEHOLDER_IMAGE,
    insurance_expiry: car.insurance_expiry ?? null,
    maintenance_date: car.maintenance_date ?? null,
    mileage: car.mileage ?? null,
    is_ready: car.is_ready ?? true,
  }
}

export { PLACEHOLDER_IMAGE }

export function useCars() {
  const [cars, setCars] = useState<CarDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCars = async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('cars')
      .select('*')
      .eq('office_id', OFFICE_ID)

    if (fetchError) {
      setError(fetchError.message)
      setCars([])
      setLoading(false)
      return
    }

    setCars((data ?? []).map(mapCarToDisplay))
    setLoading(false)
  }

  useEffect(() => {
    fetchCars()
  }, [])

  return { cars, loading, error, refetch: fetchCars }
}
