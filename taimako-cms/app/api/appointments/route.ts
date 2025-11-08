
import { NextRequest } from 'next/server'
import { makeBookAppointmentUseCase } from '../../../lib/di'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const uc = makeBookAppointmentUseCase()
    const created = await uc.execute(body)
    return new Response(JSON.stringify(created), { status: 201 })
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), { status: 400 })
  }
}
