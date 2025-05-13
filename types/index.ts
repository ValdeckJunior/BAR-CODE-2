export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  isRegistered: boolean;
  semester: "SEMESTER 1" | "SEMESTER 2";
  lecturer: string;
  department: string;
}

export interface User {
  matricule: string;
  name: string;
  department: string;
  semester: "SEMESTER 1" | "SEMESTER 2";
  academicYear: string;
  level: "LEVEL 200" | "LEVEL 300" | "LEVEL 400";
  courses: Course[];
  qrCode?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

export interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  filters: {
    semester: "SEMESTER 1" | "SEMESTER 2" | null;
    registrationStatus: "all" | "registered" | "unregistered";
    sortBy: "code" | "title" | "credits";
    sortOrder: "asc" | "desc";
  };
}

export type QRCodeType = "student-id" | "course-registration";

export interface BaseQRData {
  type: QRCodeType;
}

export interface StudentIDQRData extends BaseQRData {
  type: "student-id";
  matricule: string;
  name: string;
  semester: "SEMESTER 1" | "SEMESTER 2";
  academicYear: string;
  department: string;
  level: string;
  courses: Course[];
}

export interface CourseRegistrationQRData extends BaseQRData {
  type: "course-registration";
  id: string;
  code: string;
  title: string;
  credits: number;
  semester: "SEMESTER 1" | "SEMESTER 2";
  department: string;
  lecturer: string;
}

export interface PendingScan {
  type: string;
  data: any;
  timestamp: number;
}
