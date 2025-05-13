import {
  Course,
  QRCodeType,
  StudentIDQRData,
  CourseRegistrationQRData,
} from "@/types";

interface QRCourseData {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  schedule: {
    day: string;
    time: string;
    room: string;
  };
}

interface CourseData {
  id: string;
  name: string;
  timestamp: number;
}

interface QRCodeData {
  courseId: string;
  sessionId: string;
  timestamp: number;
}

export function validateQRCode(data: string): boolean {
  try {
    const parsed = JSON.parse(data) as Partial<QRCodeData>;
    return (
      typeof parsed.courseId === "string" &&
      typeof parsed.sessionId === "string" &&
      typeof parsed.timestamp === "number" &&
      parsed.timestamp > 0
    );
  } catch {
    return false;
  }
}

export function parseQRCode(data: string): QRCodeData | null {
  try {
    const parsed = JSON.parse(data);
    if (validateQRCode(data)) {
      return parsed as QRCodeData;
    }
  } catch {
    // Invalid JSON format
  }
  return null;
}

const QR_PREFIX = "QR_UBA_COLTECH";

export const qrCodeUtils = {
  validateQRData(
    data: any
  ): data is StudentIDQRData | CourseRegistrationQRData {
    if (!data || typeof data !== "object") return false;

    // First check if it's a legacy format
    if (typeof data === "string" && data.startsWith(QR_PREFIX)) {
      try {
        const jsonData = JSON.parse(data.substring(QR_PREFIX.length));
        return (
          typeof jsonData === "object" &&
          typeof jsonData.id === "string" &&
          typeof jsonData.name === "string" &&
          typeof jsonData.timestamp === "number"
        );
      } catch {
        return false;
      }
    }

    // Check for new format
    if (!["student-id", "course-registration"].includes(data.type)) {
      return false;
    }

    if (data.type === "student-id") {
      return (
        typeof data.matricule === "string" &&
        data.matricule.startsWith("FE") &&
        typeof data.name === "string" &&
        ["SEMESTER 1", "SEMESTER 2"].includes(data.semester) &&
        typeof data.academicYear === "string" &&
        typeof data.department === "string" &&
        ["LEVEL 200", "LEVEL 300", "LEVEL 400"].includes(data.level) &&
        Array.isArray(data.courses)
      );
    }

    if (data.type === "course-registration") {
      return (
        typeof data.id === "string" &&
        typeof data.code === "string" &&
        data.code.startsWith("CEF") &&
        typeof data.title === "string" &&
        typeof data.credits === "number" &&
        ["SEMESTER 1", "SEMESTER 2"].includes(data.semester) &&
        typeof data.department === "string" &&
        typeof data.lecturer === "string"
      );
    }

    return false;
  },

  parseQRData(data: string): StudentIDQRData | CourseRegistrationQRData {
    try {
      const parsed = JSON.parse(data);
      if (this.validateQRData(parsed)) {
        return parsed;
      }
      throw new Error("Invalid QR code format");
    } catch (error) {
      throw new Error("Could not parse QR code data");
    }
  },

  generateStudentQRData(data: Omit<StudentIDQRData, "type">): string {
    const qrData: StudentIDQRData = {
      type: "student-id",
      ...data,
    };
    return JSON.stringify(qrData);
  },

  generateCourseQRData(data: Omit<CourseRegistrationQRData, "type">): string {
    const qrData: CourseRegistrationQRData = {
      type: "course-registration",
      ...data,
    };
    return JSON.stringify(qrData);
  },

  isQRCodeExpired(timestamp: number, expirationMinutes: number = 5): boolean {
    const now = Date.now();
    const expirationTime = timestamp + expirationMinutes * 60 * 1000;
    return now > expirationTime;
  },
};
