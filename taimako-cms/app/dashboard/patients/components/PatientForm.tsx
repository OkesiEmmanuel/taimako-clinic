'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

import InputField from '@/app/auth/components/InputField'
import Button2 from '@/components/ui/Button2'
import { PatientFormData, PatientSchema } from '@/validation/PatientValidation'

interface PatientFormProps {
  selected?: Partial<PatientFormData>
  onSubmit: (data: PatientFormData) => Promise<void> | void
}

export default function PatientForm({ selected, onSubmit }: PatientFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      dob: '',
      address: '',
    },
  })

  // Prefill form when editing
  useEffect(() => {
    if (selected) {
      Object.entries(selected).forEach(([key, value]) => {
        if (key in PatientSchema.shape) setValue(key as keyof PatientFormData, value as string)
      })
    }
  }, [selected, setValue])

  const onFormSubmit = async (data: PatientFormData) => {
    try {
      await onSubmit(data)
      toast.success(selected ? 'Patient updated successfully!' : 'Patient added successfully!')
      reset()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save patient.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 p-4 bg-gray-50 border rounded-lg shadow-sm"
    >
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Full Name" {...register('name')} placeholder="Enter full name" error={errors.name?.message} />
        <InputField label="Age" {...register('age')} type="number" placeholder="Enter age" error={errors.age?.message} />

        {/* Gender */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-500">Gender</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-500 outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            )}
          />
          {errors.gender && <span className="text-xs text-red-500">{errors.gender.message}</span>}
        </div>

        <InputField label="Date of Birth" {...register('dob')} type="date" error={errors.dob?.message} />
        <InputField label="Phone" {...register('phone')} type="tel" placeholder="e.g. 09012345678" error={errors.phone?.message} />
      </div>

      {/* Address */}
      <div>
        <label className="text-sm font-medium text-gray-500">Address</label>
        <textarea
          {...register('address')}
          placeholder="Enter address"
          className="w-full border rounded-lg px-3 py-2 text-sm text-gray-500 outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        />
        {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
      </div>

      <Button2 label="Submit" type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
        {selected ? 'Update Patient' : 'Add Patient'}
      </Button2>
    </form>
  )
}
