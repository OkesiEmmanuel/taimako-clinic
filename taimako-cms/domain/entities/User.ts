
export type Role = 'admin' | 'reception' | 'doctor' | 'nurse' | 'accountant' | 'patient'

export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  role: Role
  isActive: boolean
}
