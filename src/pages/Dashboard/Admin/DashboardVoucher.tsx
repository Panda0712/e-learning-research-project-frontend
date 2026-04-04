import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  adminVoucherService,
  type VoucherCategoryItem,
  type VoucherDiscountUnit,
  type VoucherItem,
  type VoucherScope,
} from "../../../apis/adminVoucher";
import { adminCourseService } from "../../../apis/adminCourse";
import { courseService } from "../../../apis/course";
import { DEFAULT_ITEMS_PER_PAGE } from "../../../utils/constants";
import { toast } from "react-toastify";

const toDateInput = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

interface CourseOption {
  id: number;
  name: string;
}

const DashboardVoucher = () => {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [voucherCategories, setVoucherCategories] = useState<
    VoucherCategoryItem[]
  >([]);
  const [courseCategories, setCourseCategories] = useState<VoucherCategoryItem[]>(
    [],
  );
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

  const goToNext = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const goToPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVoucherId, setCurrentVoucherId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    discountUnit: "percent" as VoucherDiscountUnit,
    code: "",
    scope: "ALL_COURSES" as VoucherScope,
    scopeCategoryId: "",
    courseId: "",
    usageLimit: "",
    usagePerUser: "",
    minOrderValue: "",
    description: "",
    status: "active" as "active" | "inactive" | "scheduled" | "expired",
    maxValue: "",
    categoryId: "",
    startingDate: "",
    startingTime: "",
    endingDate: "",
    endingTime: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedCategoryLabel = useMemo(() => {
    const id = Number(formData.categoryId);
    if (!id) return "";
    return voucherCategories.find((c) => c.id === id)?.name || "";
  }, [formData.categoryId, voucherCategories]);

  const selectedScopeCategoryLabel = useMemo(() => {
    const id = Number(formData.scopeCategoryId);
    if (!id) return "";
    return courseCategories.find((c) => c.id === id)?.name || "";
  }, [formData.scopeCategoryId, courseCategories]);

  const selectedCourseLabel = useMemo(() => {
    const id = Number(formData.courseId);
    if (!id) return "";
    return courses.find((c) => c.id === id)?.name || "";
  }, [formData.courseId, courses]);

  const fetchVoucherCategories = async () => {
    try {
      const categories = await adminVoucherService.getVoucherCategoriesAPI();
      setVoucherCategories(categories);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch voucher categories.");
    }
  };

  const fetchCourseCategories = async () => {
    try {
      const categories = await courseService.getCourseCategoriesAPI();
      const rows = Array.isArray(categories) ? categories : categories?.data;
      setCourseCategories(Array.isArray(rows) ? rows : []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch course categories.");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await adminCourseService.getAdminCoursesAPI({
        page: 1,
        itemsPerPage: 200,
        status: "all",
      });
      const rows = Array.isArray(response?.data) ? response.data : [];
      setCourses(
        rows.map((course: any) => ({
          id: Number(course.id),
          name: String(course.name || `Course #${course.id}`),
        })),
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch courses.");
    }
  };

  const fetchVouchers = async (page: number) => {
    try {
      setLoading(true);
      const response = await adminVoucherService.getVouchersAPI({
        page,
        itemsPerPage,
      });

      setVouchers(response.data || []);
      setTotalPages(response.pagination?.totalPages || 0);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch vouchers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoucherCategories();
    fetchCourseCategories();
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchVouchers(currentPage);
  }, [currentPage]);

  const toggleMenu = (id: number) => {
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const discount = Number(formData.discount);
    const usageLimit = Number(formData.usageLimit);
    const usagePerUser = Number(formData.usagePerUser);
    const minOrderValue = Number(formData.minOrderValue);
    const maxValue = Number(formData.maxValue);

    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.discount || discount <= 0) newErrors.discount = "> 0";
    if (formData.discountUnit === "percent" && discount > 100)
      newErrors.discount = "1-100%";
    if (!formData.code.trim()) newErrors.code = "Required";
    if (!formData.usageLimit || usageLimit <= 0)
      newErrors.usageLimit = "> 0";
    if (formData.usagePerUser && usagePerUser <= 0)
      newErrors.usagePerUser = "> 0";
    if (!formData.minOrderValue || minOrderValue < 0)
      newErrors.minOrderValue = ">= 0";
    if (!formData.maxValue || maxValue < 0) newErrors.maxValue = ">= 0";

    if (formData.scope === "CATEGORY" && !formData.scopeCategoryId) {
      newErrors.scopeCategoryId = "Required";
    }
    if (formData.scope === "SPECIFIC_COURSE" && !formData.courseId) {
      newErrors.courseId = "Required";
    }

    if (!formData.endingDate) {
      newErrors.endingDate = "Required";
    } else if (new Date(formData.endingDate) < today) {
      newErrors.endingDate = "Future date required";
    }

    if (formData.startingDate && formData.endingDate) {
      const start = new Date(formData.startingDate);
      const end = new Date(formData.endingDate);
      if (start > end) {
        newErrors.startingDate = "Start date must be before end date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      discount: "",
      discountUnit: "percent",
      code: "",
      scope: "ALL_COURSES",
      scopeCategoryId: "",
      courseId: "",
      usageLimit: "",
      usagePerUser: "",
      minOrderValue: "",
      description: "",
      status: "active",
      maxValue: "",
      categoryId: "",
      startingDate: "",
      startingTime: "",
      endingDate: "",
      endingTime: "",
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditClick = (item: VoucherItem) => {
    setIsEditing(true);
    setCurrentVoucherId(item.id);
    setFormData({
      name: item.name,
      discount: String(item.discount ?? ""),
      discountUnit: (item.discountUnit || "percent") as VoucherDiscountUnit,
      code: item.code,
      scope: (item.scope || "ALL_COURSES") as VoucherScope,
      scopeCategoryId: String(item.scopeCategoryId || ""),
      courseId: String(item.courseId || ""),
      usageLimit: String(item.usageLimit ?? ""),
      usagePerUser: String(item.usagePerUser ?? ""),
      minOrderValue: String(item.minOrderValue ?? ""),
      description: item.description || "",
      status: (item.status || "active") as
        | "active"
        | "inactive"
        | "scheduled"
        | "expired",
      maxValue: String(item.maxValue ?? ""),
      categoryId: String(item.categoryId || ""),
      startingDate: toDateInput(item.startingDate),
      startingTime: item.startingTime || "",
      endingDate: toDateInput(item.endingDate),
      endingTime: item.endingTime || "",
    });
    setErrors({});
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        discount: Number(formData.discount),
        discountUnit: formData.discountUnit,
        code: formData.code.trim(),
        scope: formData.scope,
        usageLimit: Number(formData.usageLimit),
        ...(formData.usagePerUser
          ? { usagePerUser: Number(formData.usagePerUser) }
          : {}),
        minOrderValue: Number(formData.minOrderValue),
        description: formData.description.trim(),
        status: formData.status,
        maxValue: Number(formData.maxValue),
        ...(formData.categoryId ? { categoryId: Number(formData.categoryId) } : {}),
        ...(formData.scope === "CATEGORY" && formData.scopeCategoryId
          ? { scopeCategoryId: Number(formData.scopeCategoryId) }
          : {}),
        ...(formData.scope === "SPECIFIC_COURSE" && formData.courseId
          ? { courseId: Number(formData.courseId) }
          : {}),
        ...(formData.startingDate ? { startingDate: formData.startingDate } : {}),
        ...(formData.startingTime ? { startingTime: formData.startingTime } : {}),
        ...(formData.endingDate ? { endingDate: formData.endingDate } : {}),
        ...(formData.endingTime ? { endingTime: formData.endingTime } : {}),
      };

      if (isEditing && currentVoucherId !== null) {
        await adminVoucherService.updateVoucherAPI(currentVoucherId, payload);
        toast.success("Updated voucher successfully.");
      } else {
        await adminVoucherService.createVoucherAPI(payload);
        toast.success("Created voucher successfully.");
        setCurrentPage(1);
      }

      setShowModal(false);
      await fetchVouchers(isEditing ? currentPage : 1);
    } catch (error: any) {
      toast.error(error?.message || "Failed to save voucher.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setVoucherToDelete(id);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (voucherToDelete !== null) {
      try {
        await adminVoucherService.deleteVoucherAPI(voucherToDelete);
        toast.success("Deleted voucher successfully.");

        setShowDeleteModal(false);
        setVoucherToDelete(null);
        const shouldMovePrev = vouchers.length === 1 && currentPage > 1;
        if (shouldMovePrev) {
          setCurrentPage((prev) => prev - 1);
          return;
        }

        await fetchVouchers(currentPage);
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete voucher.");
      }
    }
  };

  const currentItems = vouchers;

  return (
    <div
      className="p-6 min-h-screen font-poppins relative"
      onClick={() => setOpenMenuId(null)}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Voucher</h1>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#FFD130] hover:bg-[#eec225] 
          text-black font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Plus size={20} /> Create New Voucher
        </button>
      </div>

      {/* TABLE */}
      <div
        className="bg-white rounded-xl shadow-sm overflow-visible 
      border border-gray-100 mb-6"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#EBEBEB]">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600 pl-6">
                Voucher Name
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">Discount</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Scope</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Target</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Code</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">
                Limit
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Min Order
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">Max Value</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="p-8 text-center text-gray-500">
                  Loading vouchers...
                </td>
              </tr>
            ) : null}
            {currentItems.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <td className="p-4 pl-6 text-sm font-medium text-gray-800">
                  {item.name}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {item.discount ?? 0}
                  {item.discountUnit === "percent" ? "%" : ""}
                </td>
                <td className="p-4 text-sm text-gray-700 font-medium">
                  {item.scope || "ALL_COURSES"}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {item.scope === "CATEGORY"
                    ? item.scopeCategory?.name || "-"
                    : item.scope === "SPECIFIC_COURSE"
                      ? item.course?.name || "-"
                      : "All courses"}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {item.category?.name || "-"}
                </td>
                <td className="p-4 text-sm font-bold text-gray-700">
                  {item.code}
                </td>
                <td className="p-4 text-sm text-gray-600 text-center">
                  {item.usageLimit ?? 0}
                </td>
                <td className="p-4 text-sm text-gray-800 font-medium">
                  ${item.minOrderValue ?? 0}
                </td>
                <td className="p-4 text-sm text-gray-800 font-medium">
                  ${item.maxValue ?? 0}
                </td>
                <td className="p-4 text-sm text-gray-800 font-medium">
                  ${item.amount ?? 0}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {(item.status || "active").toUpperCase()}
                </td>

                <td className="p-4 relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(item.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded text-gray-500"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  {openMenuId === item.id && (
                    <div
                      className={`absolute right-8 w-32 bg-white rounded-lg 
                    shadow-xl border border-gray-100 z-20 overflow-hidden animate-fade-in ${
                      index >= currentItems.length - 2 ? "bottom-10" : "top-10"
                    }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm 
                        text-yellow-600 hover:bg-yellow-50 font-medium"
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item.id);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 
                        text-sm text-gray-600 hover:bg-gray-50 font-medium"
                      >
                        <Trash size={16} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!loading && vouchers.length === 0 && (
              <tr>
                <td colSpan={12} className="p-8 text-center text-gray-500">
                  No vouchers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex justify-center mt-6 pb-8">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white"
            aria-label="Pagination"
          >
            <button
              onClick={goToPrev}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-3 py-2 
              text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 
              focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm 
                    font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0
                            ${
                              currentPage === pageNum
                                ? "z-10 bg-black text-white ring-black"
                                : "text-gray-900 ring-gray-300 hover:bg-gray-50"
                            }`}
                >
                  {pageNum}
                </button>
              ),
            )}

            <button
              onClick={goToNext}
              disabled={totalPages <= 1 || currentPage >= totalPages}
              className="relative inline-flex items-center rounded-r-md px-3 py-2 
              text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 
              focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center 
        bg-black/20 backdrop-blur-[1px]"
        >
          <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl animate-scale-up p-6 relative mx-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {isEditing ? "Edit Voucher" : "Add New Voucher"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Voucher Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none 
                    focus:border-blue-500 ${errors.name ? "border-red-500" : "border-gray-200"}`}
                  placeholder="Enter Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Discount (%)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className={`col-span-2 w-full border rounded-lg p-3 text-sm focus:outline-none 
                      focus:border-blue-500 ${errors.discount ? "border-red-500" : "border-gray-200"}`}
                    placeholder="0"
                  />
                  <select
                    value={formData.discountUnit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountUnit: e.target.value as VoucherDiscountUnit,
                      })
                    }
                    className="w-full border rounded-lg p-3 text-sm border-gray-200"
                  >
                    <option value="percent">%</option>
                    <option value="amount">Amount</option>
                  </select>
                </div>
                {errors.discount && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.discount}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Voucher Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none 
                    focus:border-blue-500 ${errors.code ? "border-red-500" : "border-gray-200"}`}
                  placeholder="Enter Code"
                />
                {errors.code && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.code}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Voucher Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full border rounded-lg p-3 text-sm border-gray-200"
                >
                  <option value="">Select category</option>
                  {voucherCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {selectedCategoryLabel ? (
                  <p className="text-xs text-gray-500">Selected: {selectedCategoryLabel}</p>
                ) : null}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-500">Voucher Scope</label>
                <select
                  value={formData.scope}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scope: e.target.value as VoucherScope,
                      scopeCategoryId: "",
                      courseId: "",
                    })
                  }
                  className="w-full border rounded-lg p-3 text-sm border-gray-200"
                >
                  <option value="ALL_COURSES">ALL_COURSES</option>
                  <option value="CATEGORY">CATEGORY</option>
                  <option value="SPECIFIC_COURSE">SPECIFIC_COURSE</option>
                </select>
              </div>

              {formData.scope === "CATEGORY" && (
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">Target Category</label>
                  <select
                    value={formData.scopeCategoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, scopeCategoryId: e.target.value })
                    }
                    className={`w-full border rounded-lg p-3 text-sm ${
                      errors.scopeCategoryId ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select category</option>
                    {courseCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.scopeCategoryId && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.scopeCategoryId}
                    </p>
                  )}
                  {selectedScopeCategoryLabel ? (
                    <p className="text-xs text-gray-500">
                      Selected: {selectedScopeCategoryLabel}
                    </p>
                  ) : null}
                </div>
              )}

              {formData.scope === "SPECIFIC_COURSE" && (
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">Target Course</label>
                  <select
                    value={formData.courseId}
                    onChange={(e) =>
                      setFormData({ ...formData, courseId: e.target.value })
                    }
                    className={`w-full border rounded-lg p-3 text-sm ${
                      errors.courseId ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  {errors.courseId && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.courseId}
                    </p>
                  )}
                  {selectedCourseLabel ? (
                    <p className="text-xs text-gray-500">Selected: {selectedCourseLabel}</p>
                  ) : null}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm text-gray-500">Usage Limit</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none 
                    focus:border-blue-500 ${errors.usageLimit ? "border-red-500" : "border-gray-200"}`}
                  placeholder="1"
                />
                {errors.usageLimit && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.usageLimit}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Usage Per User (optional)</label>
                <input
                  type="number"
                  name="usagePerUser"
                  value={formData.usagePerUser}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none 
                    focus:border-blue-500 ${errors.usagePerUser ? "border-red-500" : "border-gray-200"}`}
                  placeholder="No limit"
                />
                {errors.usagePerUser && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.usagePerUser}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">
                  Min Order Value
                </label>
                <input
                  type="number"
                  name="minOrderValue"
                  value={formData.minOrderValue}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none 
                    focus:border-blue-500 ${errors.minOrderValue ? "border-red-500" : "border-gray-200"}`}
                  placeholder="0"
                />
                {errors.minOrderValue && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.minOrderValue}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-500">Max Value</label>
                <input
                  type="number"
                  name="maxValue"
                  value={formData.maxValue}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none 
                    focus:border-blue-500 ${errors.maxValue ? "border-red-500" : "border-gray-200"}`}
                  placeholder="0"
                />
                {errors.maxValue && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.maxValue}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-500">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 text-sm border-gray-200"
                  placeholder="Voucher description"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-500">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "active"
                        | "inactive"
                        | "scheduled"
                        | "expired",
                    })
                  }
                  className="w-full border rounded-lg p-3 text-sm border-gray-200"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-500">Start Date</label>
                <input
                  type="date"
                  name="startingDate"
                  value={formData.startingDate}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none 
                    focus:border-blue-500 text-gray-500 ${
                      errors.startingDate ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {errors.startingDate && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.startingDate}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-500">Start Time</label>
                <input
                  type="time"
                  name="startingTime"
                  value={formData.startingTime}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 text-sm border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-500">Expiry Date</label>
                <input
                  type="date"
                  name="endingDate"
                  value={formData.endingDate}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none 
                    focus:border-blue-500 text-gray-500 ${
                      errors.endingDate ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {errors.endingDate && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.endingDate}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-500">Expiry Time</label>
                <input
                  type="time"
                  name="endingTime"
                  value={formData.endingTime}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 text-sm border-gray-200"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full md:col-span-2 bg-[#3B82F6] hover:bg-blue-600 text-white 
                font-bold py-3 rounded-lg mt-4 shadow-blue-200 shadow-md transition-all"
              >
                {submitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Voucher"
                    : "Add Voucher"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center 
        bg-black/20 backdrop-blur-[1px]"
        >
          <div
            className="bg-white rounded-xl p-6 w-87.5 shadow-2xl 
          text-center animate-scale-up border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Voucher?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this voucher? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 
                text-gray-600 font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 
                text-white font-bold shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardVoucher;
