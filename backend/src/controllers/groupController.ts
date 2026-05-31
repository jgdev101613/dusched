import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { z } from "zod";
import { groups } from "../db/schema";
import { eq } from "drizzle-orm";

// Validation schema for creating a group
const CreateGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(50, "Group name must be less than 50 characters")
    .trim(),
});

const UpdateGroupSchema = CreateGroupSchema;

// Validation schema for group ID parameter
const ParamsSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

// Validation schema for group name parameter
const GroupNameSchema = z.object({
  name: z.string().min(1).max(50).trim(),
});

export async function createGroup(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = CreateGroupSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { name } = parsed.data;

    const [newGroup] = await db
      .insert(groups)
      .values({ name })
      .onConflictDoNothing({ target: groups.name })
      .returning();

    if (!newGroup) {
      return res.status(409).json({
        error: "Conflict",
        details: "A group with this name already exists",
      });
    }

    res.status(201).json(newGroup);
  } catch (e) {
    next(e);
  }
}

export async function getGroups(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const allGroups = await db.select().from(groups);

    if (allGroups.length === 0) {
      return res.status(404).json({
        error: "Not found",
        details: "No groups found",
      });
    }

    res.status(200).json(allGroups);
  } catch (e) {
    next(e);
  }
}

export async function getGroupById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const paramsParsed = ParamsSchema.safeParse(req.params);

    if (!paramsParsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: paramsParsed.error.flatten().fieldErrors,
      });
    }

    const { id } = paramsParsed.data;

    const [group] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, id))
      .limit(1);

    if (!group) {
      return res.status(404).json({
        error: "Not Found",
        details: "Group not found.",
      });
    }

    return res.status(200).json(group);
  } catch (e) {
    next(e);
  }
}

export async function getGroupByName(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const paramsParsed = GroupNameSchema.safeParse(req.params);

    if (!paramsParsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: paramsParsed.error.flatten().fieldErrors,
      });
    }

    const { name } = paramsParsed.data;

    const [group] = await db
      .select()
      .from(groups)
      .where(eq(groups.name, name))
      .limit(1);

    if (!group) {
      return res.status(404).json({
        error: "Not Found",
        details: "Group not found.",
      });
    }

    return res.status(200).json(group);
  } catch (e) {
    next(e);
  }
}

export async function updateGroup(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = ParamsSchema.safeParse(req.params);
    const parsedBody = UpdateGroupSchema.safeParse(req.body);

    if (!parsedParams.success) {
      return res.status(400).json({
        error: "Invalid Parameter",
        details: parsedParams.error.flatten().fieldErrors,
      });
    }

    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsedBody.error.flatten().fieldErrors,
      });
    }

    const { id } = parsedParams.data;
    const { name } = parsedBody.data;

    const existingGroupWithName = await db
      .select()
      .from(groups)
      .where(eq(groups.name, name))
      .limit(1);

    if (
      existingGroupWithName.length > 0 &&
      existingGroupWithName[0].id !== id
    ) {
      return res.status(409).json({
        error: "Conflict",
        message: "A group with this name already exists.",
      });
    }

    const [updatedGroup] = await db
      .update(groups)
      .set({ name })
      .where(eq(groups.id, id))
      .returning();

    if (!updatedGroup) {
      return res.status(404).json({
        error: "Not Found",
        message: "Group not found.",
      });
    }

    return res.status(200).json(updatedGroup);
  } catch (e) {
    next(e);
  }
}

export async function deleteGroup() {}

export async function getGroupMembers() {}
