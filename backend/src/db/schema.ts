import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  boolean,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export type UserRole = "admin" | "student" | "professor" | "instructor";
export type AttendanceType = "class" | "duty";

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    role: text("role").$type<UserRole>().notNull().default("student"),
    email: text("email").notNull(),
    qrCode: text("qr_code"),
    schoolId: text("school_id"),
    displayName: text("display_name"),
    firstName: text("first_name"),
    middleName: text("middle_name"),
    lastName: text("last_name"),
    status: boolean("status").notNull().default(true),
    profileImage: text("profile_image").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_school_id_unique").on(table.schoolId),
  ],
);

// Student info table
export const studentInfo = pgTable(
  "student_info",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    groupId: uuid("group_id").references(() => groups.id, {
      onDelete: "set null",
    }),
    year: integer("year"),
    department: text("department"),
    course: text("course"),
    section: text("section"),
    fathersName: text("fathers_name"),
    mothersName: text("mothers_name"),
    guardiansName: text("guardians_name").notNull(),
    fathersContact: text("fathers_contact"),
    mothersContact: text("mothers_contact"),
    guardiansContact: text("guardians_contact").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("student_info_user_id_unique").on(table.userId),
    index("student_info_group_id_idx").on(table.groupId),
  ],
);

// Professors info table
export const professorInfo = pgTable(
  "professor_info",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    department: text("department"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("professor_info_user_id_unique").on(table.userId)],
);

// Instructor info table
export const instructorInfo = pgTable(
  "instructor_info",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    company: text("company"),
    companyId: text("company_id"),
    companyContact: text("company_contact"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("instructor_info_user_id_unique").on(table.userId)],
);

// Groups table
export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Duties table
export const duties = pgTable(
  "duties",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    place: text("place").notNull(),
    time: timestamp("time", { withTimezone: true }).notNull(),
    clinicalInstructor: uuid("clinical_instructor").references(
      () => instructorInfo.id,
      { onDelete: "set null" },
    ),
    area: text("area").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("duties_group_id_idx").on(table.groupId),
    index("duties_date_idx").on(table.date),
  ],
);

// Attendance table
export const studentAttendance = pgTable(
  "student_attendance",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    schoolId: text("school_id").notNull(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    attendanceType: text("attendance_type")
      .$type<AttendanceType>()
      .notNull()
      .default("class"),
    timeIn: timestamp("time_in", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("attendance_group_date_idx").on(table.groupId, table.date),
    index("attendances_group_date_idx").on(table.groupId, table.date),

    uniqueIndex("attendances_user_date_type_unique").on(
      table.userId,
      table.date,
      table.attendanceType,
    ),
  ],
);

// Relations
// Users relations
export const usersRelations = relations(users, ({ one, many }) => ({
  studentInfo: one(studentInfo, {
    fields: [users.id],
    references: [studentInfo.userId],
  }),

  professorInfo: one(professorInfo, {
    fields: [users.id],
    references: [professorInfo.userId],
  }),

  instructorInfo: one(instructorInfo, {
    fields: [users.id],
    references: [instructorInfo.userId],
  }),

  attendances: many(studentAttendance),
}));

// Student info relations
export const studentInfoRelations = relations(studentInfo, ({ one }) => ({
  user: one(users, {
    fields: [studentInfo.userId],
    references: [users.id],
  }),

  group: one(groups, {
    fields: [studentInfo.groupId],
    references: [groups.id],
  }),
}));

// Professor info relations
export const professorInfoRelations = relations(professorInfo, ({ one }) => ({
  user: one(users, {
    fields: [professorInfo.userId],
    references: [users.id],
  }),
}));

// Instructor info relations
export const instructorInfoRelations = relations(
  instructorInfo,
  ({ one, many }) => ({
    user: one(users, {
      fields: [instructorInfo.userId],
      references: [users.id],
    }),

    duties: many(duties),
  }),
);

// Groups relations
export const groupsRelations = relations(groups, ({ many }) => ({
  students: many(studentInfo),
  attendances: many(studentAttendance),
  duties: many(duties),
}));

// Duties relations
export const dutiesRelations = relations(duties, ({ one }) => ({
  group: one(groups, {
    fields: [duties.groupId],
    references: [groups.id],
  }),

  instructor: one(instructorInfo, {
    fields: [duties.clinicalInstructor],
    references: [instructorInfo.id],
  }),
}));
