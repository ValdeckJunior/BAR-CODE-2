import { StudentQRCodePayload } from "@/types";

export function validateQRCode(data: string): boolean {
  try {
    const parsed = JSON.parse(data) as Partial<StudentQRCodePayload>;
    return (
      typeof parsed.matricule === "string" &&
      typeof parsed.academicYear === "string" &&
      ["SEMESTER 1", "SEMESTER 2"].includes(parsed.semester as string) &&
      Array.isArray(parsed.courses) &&
      parsed.courses.every((c) => typeof c === "string")
    );
  } catch {
    return false;
  }
}

export function parseQRCode(data: string): StudentQRCodePayload | null {
  try {
    const parsed = JSON.parse(data);
    if (validateQRCode(data)) {
      return parsed as StudentQRCodePayload;
    }
    return null;
  } catch {
    return null;
  }
}

export function generateStudentQRCode(data: StudentQRCodePayload): string {
  return JSON.stringify(data);
}
