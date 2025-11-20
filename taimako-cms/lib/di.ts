// src/lib/di.ts
import { UserRepoSupabase } from '../repos/supabase/UserRepoSupabase'
import { AppointmentRepoSupabase } from '../repos/supabase/AppointmentRepoSupabase'
import { BookAppointmentUseCase } from '../use-cases/BookAppointmentUseCase'
import { User } from 'lucide-react'

export const makeBookAppointmentUseCase = () => {
  const userRepo =UserRepoSupabase.getInstance();
  const appointmentRepo = new AppointmentRepoSupabase()
  return new BookAppointmentUseCase(appointmentRepo, userRepo)
}
