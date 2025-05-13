import { storage, STORAGE_KEYS } from "./storage";
import { Course } from "@/types";

export const revalidation = {
  async revalidateAllData(): Promise<{ success: boolean; error?: string }> {
    try {
      const courses = await storage.getData(STORAGE_KEYS.COURSES);
      const user = await storage.getData(STORAGE_KEYS.USER);

      // Validate course data
      if (courses && Array.isArray(courses)) {
        const validCourses = courses.filter(
          (course) =>
            course.id &&
            course.code &&
            course.code.startsWith("CEF") &&
            course.title &&
            typeof course.credits === "number" &&
            ["SEMESTER 1", "SEMESTER 2"].includes(course.semester) &&
            course.lecturer &&
            course.department
        );

        if (validCourses.length !== courses.length) {
          await storage.saveData(STORAGE_KEYS.COURSES, validCourses);
          console.warn("Some invalid courses were removed during revalidation");
        }
      }

      // Validate user data
      if (user) {
        const isValidUser =
          user.matricule?.startsWith("FE") &&
          user.name &&
          user.department &&
          ["SEMESTER 1", "SEMESTER 2"].includes(user.semester) &&
          user.academicYear &&
          ["LEVEL 200", "LEVEL 300", "LEVEL 400"].includes(user.level) &&
          Array.isArray(user.courses);

        if (!isValidUser) {
          await storage.clearAllData();
          return {
            success: false,
            error: "Invalid user data detected, session cleared",
          };
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Data revalidation failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async revalidateCourseData(course: Course): Promise<boolean> {
    try {
      return !!(
        course.id &&
        course.code &&
        course.code.startsWith("CEF") &&
        course.title &&
        typeof course.credits === "number" &&
        ["SEMESTER 1", "SEMESTER 2"].includes(course.semester) &&
        course.lecturer &&
        course.department
      );
    } catch {
      return false;
    }
  },
};
