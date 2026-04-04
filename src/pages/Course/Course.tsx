import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { courseService } from "../../apis/course";
import CourseHeader from "../../components/course/CourseHeader";
import CourseList from "../../components/course/CourseList";
import Pagination from "../../components/ui/Pagination";
import type {
  Course,
  CourseAPIData,
  CourseCategoryAPIData,
} from "../../types/course.type";
import { color, DEFAULT_ITEMS_PER_PAGE } from "../../utils/constants";
import { MOCK_COURSES } from "../../utils/mockData";

const ITEMS_PER_PAGE = DEFAULT_ITEMS_PER_PAGE;

type CourseListResponse = {
  courses: CourseAPIData[];
  totalCourses: number;
  pagination: {
    page: number;
    itemsPerPage: number;
    total: number;
    totalPages: number;
  };
};

const normalizeQuery = (search: string) => {
  const params = new URLSearchParams(search);
  if (!params.get("page")) params.set("page", "1");
  if (!params.get("itemsPerPage"))
    params.set("itemsPerPage", String(ITEMS_PER_PAGE));
  if (!params.get("q")) params.set("q", "all");
  return params;
};

const mapCourseList = (
  apiCourses: CourseAPIData[],
  categories: CourseCategoryAPIData[],
) => {
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  return apiCourses.map((c, idx) => {
    const fallback = MOCK_COURSES[idx % MOCK_COURSES.length];
    const price = c.price ?? fallback.price;
    const fullName = [c.lecturer?.firstName, c.lecturer?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      id: c.id,
      title: c.name ?? fallback.title,
      category:
        c.category?.name ??
        categoryMap[c.categoryId ?? -1] ??
        fallback.category,
      author: c.lecturerName || fullName || fallback.author,
      lessons: c.totalLessons ?? fallback.lessons,
      hours: c.duration ?? fallback.hours,
      students: c.totalStudents ?? fallback.students,
      price,
      isFree: price === 0,
      image: c.thumbnail?.fileUrl ?? fallback.image,
    } as Course;
  });
};

const CoursePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [categories, setCategories] = useState<CourseCategoryAPIData[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(
    () => normalizeQuery(location.search),
    [location.search],
  );
  const page = Number(params.get("page")) || 1;
  const itemsPerPage = Number(params.get("itemsPerPage")) || ITEMS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(totalCourses / itemsPerPage));

  const table = useReactTable({
    data: courses,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: Math.max(0, page - 1),
        pageSize: itemsPerPage,
      },
    },
  });

  useEffect(() => {
    const normalized = normalizeQuery(location.search);
    if (normalized.toString() !== location.search.replace(/^\?/, "")) {
      navigate({ search: normalized.toString() }, { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    courseService
      .getCourseCategoriesAPI()
      .then(setCategories)
      .catch(() => {
        toast.error("Failed to load course category!");
      });
  }, []);

  useEffect(() => {
    setSearchValue(params.get("q") === "all" ? "" : params.get("q") || "");
  }, [params]);

  useEffect(() => {
    setIsLoading(true);
    courseService
      .getCoursesAPI({ searchPath: `?${params.toString()}` })
      .then((res: CourseListResponse) => {
        setCourses(mapCourseList(res.courses || [], categories));
        setTotalCourses(res.totalCourses || 0);
      })
      .catch((error) => {
        toast.error(error?.message || "Cannot get courses!");
      })
      .finally(() => setIsLoading(false));
  }, [params, categories]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > table.getPageCount()) return;
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    navigate({ search: next.toString() });
  };

  const updateSearch = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (!v) next.delete(k);
      else next.set(k, v);
    });
    next.set("page", "1");
    if (!next.get("itemsPerPage"))
      next.set("itemsPerPage", String(ITEMS_PER_PAGE));
    if (!next.get("q")) next.set("q", "all");
    navigate({ search: next.toString() });
  };

  const handleSearchSubmit = () => {
    const q = searchValue.trim();
    updateSearch({ q: q.length >= 2 ? q : "all" });
  };

  return (
    <div
      className="min-h-screen pb-20 font-sans bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_24%,#f7f4ff_100%)]"
      style={{ backgroundColor: color.bg }}
    >
      <CourseHeader
        value={searchValue}
        onChange={setSearchValue}
        onSubmit={handleSearchSubmit}
      />

      <div className="mx-auto mt-8 max-w-full px-4">
        <main className="mx-auto max-w-400 rounded-4xl border border-white/70 bg-white/80 p-4 shadow-[0_24px_70px_rgba(34,40,84,0.06)] backdrop-blur-sm sm:p-6 lg:p-7">
          <CourseList courses={courses} isLoading={isLoading} />
          {!isLoading && (
            <Pagination
              currentPage={page}
              totalPages={table.getPageCount()}
              onChange={handlePageChange}
              type="secondary"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
