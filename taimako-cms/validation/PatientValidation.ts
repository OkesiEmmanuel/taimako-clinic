import { z } from 'zod'

export const PatientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  age: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Enter a valid age'),
  gender: z.enum(['Male', 'Female', 'Other'], { 
    message: 'Select a gender' 
  }),
  phone: z
    .string()
    .min(10, 'Invalid phone number')
    .max(15, 'Phone number too long'),
  dob: z.string().min(1, 'Date of birth required'),
  address: z.string().optional(),
})

export type PatientFormData = z.infer<typeof PatientSchema>
