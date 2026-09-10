import { createServerFn } from "@tanstack/react-start";

export type BatchCard = {
  id: string;
  name: string;
  byName: string;
  startDate: string;
  endDate: string;
  language: string;
  image: string;
  fee: number;
};

export const listBatches = createServerFn({ method: "GET" })
  .inputValidator((input: { category: string; search?: string; page?: number }) => input)
  .handler(async ({ data }) => {
    const { allBatches, CATEGORY_MATCHERS } = await import("./pw-api.server");
    const all = await allBatches();
    const re = CATEGORY_MATCHERS[data.category];
    const q = (data.search ?? "").trim().toLowerCase();
    const filtered = all.filter((b) => {
      const hay = `${b.name} ${b.byName}`;
      if (re && !re.test(hay)) return false;
      if (q && !hay.toLowerCase().includes(q)) return false;
      return true;
    });
    const page = data.page ?? 1;
    const limit = 12;
    const items: BatchCard[] = filtered.slice(0, page * limit).map((b) => ({
      id: b._id,
      name: b.name,
      byName: b.byName,
      startDate: b.startDate,
      endDate: b.endDate,
      language: b.language || "Hinglish",
      image: b.previewImage || "",
      fee: b.feeTotal ?? 0,
    }));
    return { items, total: filtered.length, hasMore: filtered.length > page * limit };
  });

export const batchDetails = createServerFn({ method: "GET" })
  .inputValidator((input: { batchId: string }) => input)
  .handler(async ({ data }) => {
    const { apiGet } = await import("./pw-api.server");
    const d = await apiGet<Record<string, unknown>>(`/v3/batches/${data.batchId}/details`);
    if (!d) return null;
    const subjects = ((d["subjects"] as unknown[]) ?? []).map((s) => {
      const x = s as Record<string, unknown>;
      const img = x["imageId"] as Record<string, string> | undefined;
      return {
        id: String(x["_id"]),
        name: String(x["subject"] ?? ""),
        slug: String(x["slug"] ?? ""),
        tagCount: Number(x["tagCount"] ?? 0),
        image: img?.["baseUrl"] && img?.["key"] ? `${img["baseUrl"]}${img["key"]}` : "",
      };
    });
    return {
      id: String(d["_id"]),
      name: String(d["name"] ?? ""),
      byName: String(d["byName"] ?? ""),
      language: String(d["language"] ?? ""),
      image: String(d["previewImage"] ?? ""),
      subjects,
    };
  });

export const todaysSchedule = createServerFn({ method: "GET" })
  .inputValidator((input: { batchId: string }) => input)
  .handler(async ({ data }) => {
    const { apiGet } = await import("./pw-api.server");
    const list =
      (await apiGet<unknown[]>(
        `/v2/batches/${data.batchId}/todays-schedule?batchId=${data.batchId}&_t=${Date.now()}`,
      )) ?? [];
    return list.map((item) => {
      const x = (item as Record<string, unknown>)["data"] as Record<string, unknown>;
      const subj = x?.["subjectId"] as Record<string, string> | undefined;
      const teacher = x?.["teacherId"] as Record<string, unknown> | undefined;
      const timeline = x?.["timeline"] as Record<string, unknown> | undefined;
      const img = teacher?.["imageId"] as Record<string, string> | undefined;
      const start = String(x?.["startTime"] ?? "");
      const end = String(x?.["endTime"] ?? "");
      const raw = String(
        x?.["status"] ?? timeline?.["status"] ?? x?.["scheduleStatus"] ?? "",
      ).toUpperCase();
      const now = Date.now();
      const st = Date.parse(start);
      const en = Date.parse(end);
      let status: "LIVE" | "UPCOMING" | "COMPLETED" =
        raw.includes("LIVE") || raw === "ONGOING"
          ? "LIVE"
          : raw.includes("COMPLET") || raw === "ENDED"
            ? "COMPLETED"
            : "UPCOMING";
      if (!raw && !Number.isNaN(st)) {
        status = now < st ? "UPCOMING" : !Number.isNaN(en) && now > en ? "COMPLETED" : "LIVE";
      }
      return {
        id: String(x?.["_id"] ?? Math.random()),
        subjectId: String(subj?.["_id"] ?? ""),
        topic: String(x?.["topic"] ?? "Class"),
        subject: subj?.["name"] ?? "",
        teacher: String(
          `${teacher?.["firstName"] ?? ""} ${teacher?.["lastName"] ?? ""}`.trim(),
        ),
        teacherImage:
          img?.["baseUrl"] && img?.["key"] ? `${img["baseUrl"]}${img["key"]}` : "",
        startTime: start,
        endTime: end,
        status,
      };
    });

  });

export const batchTests = createServerFn({ method: "GET" })
  .inputValidator((input: { batchId: string }) => input)
  .handler(async ({ data }) => {
    const { apiGet } = await import("./pw-api.server");
    const list =
      (await apiGet<unknown[]>(
        `/v3/test-service/tests?batchId=${data.batchId}&testType=All&testStatus=All&attemptStatus=All&isSubjective=false&isPurchased=true`,
      )) ?? [];
    return list.map((t) => {
      const x = t as Record<string, unknown>;
      return {
        id: String(x["_id"]),
        name: String(x["name"] ?? ""),
        totalQuestions: Number(x["totalQuestions"] ?? 0),
        totalMarks: Number(x["totalMarks"] ?? 0),
        maxDuration: Number(x["maxDuration"] ?? 0),
        startTime: String(x["startTime"] ?? ""),
        attempts: Number(x["attempts"] ?? 0),
        tag1: String(x["tag1"] ?? ""),
        tag2: String(x["tag2"] ?? "Start"),
      };
    });
  });

export const batchAnnouncements = createServerFn({ method: "GET" })
  .inputValidator((input: { batchId: string }) => input)
  .handler(async ({ data }) => {
    const { apiGet } = await import("./pw-api.server");
    const list =
      (await apiGet<unknown[]>(`/v1/batches/${data.batchId}/announcement?page=1`)) ?? [];
    return list.map((a) => {
      const x = a as Record<string, unknown>;
      const by = x["createdBy"] as Record<string, string> | undefined;
      return {
        id: String(x["_id"]),
        text: String(x["announcement"] ?? ""),
        author: `${by?.["firstName"] ?? "PW"} ${by?.["lastName"] ?? ""}`.trim(),
        createdAt: String(x["createdAt"] ?? ""),
      };
    });
  });

export const communityPosts = createServerFn({ method: "GET" })
  .inputValidator((input: { batchId: string }) => input)
  .handler(async ({ data }) => {
    const { apiGet } = await import("./pw-api.server");
    const channels =
      (await apiGet<unknown[]>(`/v3/community/channels/batch/${data.batchId}`)) ?? [];
    const first = channels[0] as Record<string, unknown> | undefined;
    if (!first) return { channel: "", posts: [] };
    const channelId = String(first["_id"]);
    const posts: unknown[] = [];
    for (let page = 1; page <= 4; page++) {
      const res =
        (await apiGet<{ posts?: unknown[] }>(
          `/v3/community/posts/v2?channelId=${channelId}&page=${page}&timestamp=${Math.floor(Date.now() / 1000)}`,
        )) ?? {};
      const chunk = Array.isArray(res) ? (res as unknown[]) : (res.posts ?? []);
      if (chunk.length === 0) break;
      posts.push(...chunk);
    }
    const clean = (s: string) => {
      let t = s;
      try {
        t = decodeURIComponent(s);
      } catch {
        /* keep raw */
      }
      return t.replace(/<[^>]*>/g, "").trim();
    };
    const seen = new Set<string>();
    return {
      channel: String(first["name"] ?? "Student Discussion Channel"),
      posts: posts
        .filter((p) => {
          const id = String((p as Record<string, unknown>)["_id"]);
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        })
        .map((p) => {
        const x = p as Record<string, unknown>;
        const user = (x["user"] ?? x["userId"]) as Record<string, unknown> | undefined;
        const name =
          `${(user?.["firstName"] as string) ?? ""} ${(user?.["lastName"] as string) ?? ""}`.trim() ||
          String(user?.["name"] ?? "Student");
        const views = x["views"];
        return {
          id: String(x["_id"]),
          name,
          text: clean(String(x["description"] ?? x["text"] ?? x["content"] ?? "")),
          views: Array.isArray(views)
            ? Number(views[0] ?? 0)
            : Number(x["totalUniqueViews"] ?? 0),
          comments: Number(x["total_comments"] ?? x["commentCount"] ?? 0),
          createdAt: String(x["createdAt"] ?? ""),
        };

      }),
    };
  });

export const subjectTopics = createServerFn({ method: "GET" })
  .inputValidator((input: { batchId: string; subjectId: string }) => input)
  .handler(async ({ data }) => {
    const { apiGet } = await import("./pw-api.server");
    const list =
      (await apiGet<unknown[]>(
        `/batch-service/v1/batch-tags/${data.batchId}/subject/${data.subjectId}/topics?page=1&batchTagType=UNITS&limit=50`,
      )) ?? [];
    return list.map((t) => {
      const x = t as Record<string, unknown>;
      const id = String(x["_id"]);
      const name = String(x["name"] ?? "");
      const derived = `${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")}-${id.slice(-6)}`;
      return {
        id,
        name,
        slug: String(x["slug"] ?? derived),
        notes: Number(x["notes"] ?? 0),
        exercises: Number(x["exercises"] ?? 0),
        videos: Number(x["videos"] ?? 0),
      };
    });
  });

export const chapterContents = createServerFn({ method: "GET" })
  .inputValidator(
    (input: {
      batchId: string;
      subjectId: string;
      chapterId: string;
      contentType: "LECTURES" | "NOTES" | "DPP_PDF" | "DPP_VIDEOS";
    }) => input,
  )
  .handler(async ({ data }) => {
    const { apiGet } = await import("./pw-api.server");
    const list =
      (await apiGet<unknown[]>(
        `/batch-service/v3/batch-subject-schedules/${data.batchId}/subject/${data.subjectId}/contents?skip=0&limit=30&contentType=${data.contentType}&tagId=${data.chapterId}`,
      )) ?? [];
    const out: {
      id: string;
      scheduleId: string;
      title: string;
      subtitle: string;
      image: string;
      date: string;
      kind: string;
    }[] = [];
    for (const item of list) {
      const wrap = item as Record<string, unknown>;
      const x = (wrap["data"] ?? {}) as Record<string, unknown>;
      const video = x["videoDetails"] as Record<string, unknown> | undefined;
      const homework = (x["homeworkIds"] as unknown[]) ?? [];
      const scheduleId = String(x["_id"] ?? "");
      if (data.contentType === "LECTURES") {
        out.push({
          id: scheduleId || String(out.length),
          scheduleId,
          title: String(x["topic"] ?? video?.["name"] ?? "Lecture"),
          subtitle: String(x["lectureType"] ?? "Video"),
          image: String(video?.["image"] ?? ""),
          date: String(x["date"] ?? x["startTime"] ?? ""),
          kind: "video",
        });
      } else {
        for (const h of homework) {
          const hw = h as Record<string, unknown>;
          const atts = (hw["attachmentIds"] as unknown[]) ?? [];
          const att = atts[0] as Record<string, string> | undefined;
          out.push({
            id: String(hw["_id"] ?? out.length),
            scheduleId,
            title: String(hw["topic"] ?? "Note"),
            subtitle: att?.["name"] ?? String(hw["note"] ?? "PDF"),
            image: "",
            date: String(x["date"] ?? ""),
            kind: "pdf",
          });
        }
      }
    }
    return out;
  });

export const scheduleDetails = createServerFn({ method: "GET" })
  .inputValidator(
    (input: { batchId: string; subjectId: string; scheduleId: string }) => input,
  )
  .handler(async ({ data }) => {
    const { apiGet } = await import("./pw-api.server");
    const d = await apiGet<Record<string, unknown>>(
      `/v1/batches/${data.batchId}/subject/${data.subjectId}/schedule/${data.scheduleId}/schedule-details`,
    );
    if (!d) return null;
    const notes = ((d["homeworkIds"] as unknown[]) ?? []).flatMap((h) => {
      const hw = h as Record<string, unknown>;
      return ((hw["attachmentIds"] as unknown[]) ?? []).map((a) => {
        const att = a as Record<string, string>;
        return {
          id: String(hw["_id"] ?? att["_id"]),
          homeworkId: String(hw["_id"] ?? ""),
          title: String(hw["topic"] ?? att["name"] ?? "Notes"),
          name: String(att["name"] ?? "PDF"),
          url:
            att["baseUrl"] && att["key"] ? `${att["baseUrl"]}${att["key"]}` : "",
        };
      });
    });
    const quizzes = ((d["exerciseIds"] as unknown[]) ?? []).flatMap((e) => {
      const ex = e as Record<string, unknown>;
      return ((ex["content"] as unknown[]) ?? []).map((c) => {
        const ct = (c as Record<string, unknown>)["exerciseId"] as
          | Record<string, unknown>
          | undefined;
        return {
          id: String(ct?.["_id"] ?? ex["_id"]),
          name: String(ct?.["name"] ?? ex["title"] ?? "DPP Quiz"),
          totalQuestions: Number(ct?.["totalQuestions"] ?? 0),
          totalMarks: Number(ct?.["totalMarks"] ?? 0),
          maxDuration: Number(ct?.["maxDuration"] ?? 0),
        };
      });
    });
    const video = d["videoDetails"] as Record<string, unknown> | undefined;
    return {
      id: String(d["_id"] ?? ""),
      topic: String(d["topic"] ?? "Lecture"),
      date: String(d["startTime"] ?? d["date"] ?? ""),
      status: String(d["status"] ?? ""),
      image: String(video?.["image"] ?? d["previewImageUrl"] ?? ""),
      duration: String(video?.["duration"] ?? ""),
      videoUrl: String(video?.["videoUrl"] ?? d["url"] ?? ""),
      notes,
      quizzes,
    };
  });

export const testInstructions = createServerFn({ method: "GET" })
  .inputValidator((input: { testId: string }) => input)
  .handler(async ({ data }) => {
    const { apiGet } = await import("./pw-api.server");
    const d = await apiGet<Record<string, unknown>>(
      `/v3/test-service/tests/${data.testId}/instructions`,
    );
    if (!d) return null;
    return {
      id: String(d["_id"] ?? data.testId),
      name: String(d["name"] ?? "Test"),
      maxDuration: Number(d["maxDuration"] ?? 0),
      totalMarks: Number(d["totalMarks"] ?? 0),
      totalQuestions: Number(d["totalQuestions"] ?? 0),
      isSubjective: Boolean(d["isSubjective"]),
      languages: ((d["languageCodes"] as unknown[]) ?? []).map((l) =>
        String((l as Record<string, unknown>)["language"] ?? ""),
      ),
    };
  });


export const chapterDpp = createServerFn({ method: "GET" })
  .inputValidator(
    (input: { batchId: string; subjectId: string; chapterId: string }) => input,
  )
  .handler(async ({ data }) => {
    const { apiGet } = await import("./pw-api.server");
    const list =
      (await apiGet<unknown[]>(
        `/v3/test-service/tests/new-dpp-list?page=1&batchId=${data.batchId}&batchSubjectId=${data.subjectId}&chapterId=${data.chapterId}&dppType=ALL&limit=20`,
      )) ?? [];
    return list.map((d) => {
      const x = d as Record<string, unknown>;
      const det = x["dppQuizDetails"] as Record<string, unknown> | undefined;
      const test = det?.["test"] as Record<string, unknown> | undefined;
      return {
        id: String(test?.["_id"] ?? x["_id"]),
        name: String(test?.["name"] ?? "DPP Quiz"),
        totalQuestions: Number(test?.["totalQuestions"] ?? 0),
        totalMarks: Number(test?.["totalMarks"] ?? 0),
        maxDuration: Number(test?.["maxDuration"] ?? 0),
      };
    });
  });
