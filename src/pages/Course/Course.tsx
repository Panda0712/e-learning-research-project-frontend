import { useEffect, useMemo, useState } from "react";
import CourseHeader from "../../components/course/CourseHeader";
import CourseList from "../../components/course/CourseList";
import Sidebar, {
  type CourseFilters,
} from "../../components/course/CourseSidebar";
import Pagination from "../../components/ui/Pagination";
import { color, DEFAULT_ITEMS_PER_PAGE } from "../../utils/constants";
import { MOCK_COURSES } from "../../utils/mockData";
import type {
  Course,
  CourseAPIData,
  CourseCategoryAPIData,
  CourseListAPIResponse,
} from "../../types/course.type";
import { useLocation, useNavigate } from "react-router-dom";
import { courseService } from "../../apis/course";
import { toast } from "react-toastify";
import { usePagination } from "../../hooks/usePagination";

const ITEMS_PER_PAGE = DEFAULT_ITEMS_PER_PAGE;

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
    return {
      id: c.id,
      title: c.name ?? fallback.title,
      category:
        c.category?.name ??
        categoryMap[c.categoryId ?? -1] ??
        fallback.category,
      author:
        c.lecturerName ??
        [c.lecturer?.firstName, c.lecturer?.lastName]
          .filter(Boolean)
          .join(" ") ??
        fallback.author,
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

  const listData = courses.length ? courses : MOCK_COURSES;
  const { currentPage, setCurrentPage, currentData, totalPages } =
    usePagination({
      data: listData,
      itemsPerPage: ITEMS_PER_PAGE,
      totalData: totalCourses,
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
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSearchValue(params.get("q") === "all" ? "" : params.get("q") || "");
  }, [params]);

  useEffect(() => {
    setIsLoading(true);
    courseService
      .getCoursesAPI({ searchPath: `?${params.toString()}` })
      .then((res: CourseListAPIResponse) => {
        setCourses(mapCourseList(res.courses || [], categories));
        setTotalCourses(res.totalCourses || 0);
      })
      .catch((error) => {
        toast.error(error?.message || "Cannot get courses!");
      })
      .finally(() => setIsLoading(false));
  }, [params, categories]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page, setCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      const next = new URLSearchParams(params);
      next.set("page", String(newPage));
      setCurrentPage(newPage);
      navigate({ search: next.toString() });
    }
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

  const handleApplyFilters = (filters: CourseFilters) => {
    updateSearch({
      categoryId: filters.categoryId ? String(filters.categoryId) : "",
      level: filters.level || "",
      price: filters.price || "",
      rating: filters.rating ? String(filters.rating) : "",
    });
  };

  return (
    <div
      className="min-h-screen font-sans pb-20"
      style={{ backgroundColor: color.bg }}
    >
      <CourseHeader
        value={searchValue}
        onChange={setSearchValue}
        onSubmit={handleSearchSubmit}
      />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-10">
          <main className="lg:col-span-3">
            <CourseList courses={currentData} isLoading={isLoading} />
            {!isLoading && (
              <Pagination
                currentPage={page || currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
                type="secondary"
              />
            )}
          </main>
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar categories={categories} onApply={handleApplyFilters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
