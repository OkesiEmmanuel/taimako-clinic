import { StaffLeaveRepoSupabase } from "@/repos/supabase/StaffLeaveRepoSupabase";

const staffLeaveRepo = StaffLeaveRepoSupabase.getInstance()

export async function createStaffLeave(staffId: string, input: { start_date: string; end_date: string; reason: string }) {
  return await staffLeaveRepo.create({
    staff_id: staffId,
    ...input,
  })
}
