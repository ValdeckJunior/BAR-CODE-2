export interface Course {
  id: number;
  code: string;
  title: string;
}

export interface User {
  id: number;
  name: string;
  matricule: string;
  email: string;
  role: "STUDENT" | "LECTURER" | string;
  faculty: string;
  department: string;
  semester: string; // e.g., "SEMESTER 2"
  level: string; // e.g., "LEVEL 300"
  academicYear: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  qrCodeImage?: string | null;
  verificationResult?: any | null;
  verificationLoading?: boolean;
  verificationError?: string | null;
}

export interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  filters: {
    semester: "SEMESTER 1" | "SEMESTER 2" | null;
    registrationStatus: "all" | "registered" | "unregistered";
    sortBy: "code" | "title";
    sortOrder: "asc" | "desc";
  };
}

// QR code payload as per backend
export interface StudentQRCodePayload {
  matricule: string;
  academicYear: string;
  semester: string;
  courses: string[];
}

export interface PendingScan {
  type: string;
  data: any;
  timestamp: number;
}
