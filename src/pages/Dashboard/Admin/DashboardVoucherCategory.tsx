import { MoreHorizontal, Pencil, Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  adminVoucherService,
  type VoucherCategoryItem,
} from "../../../apis/adminVoucher";

const DashboardVoucherCategory = () => {
  const [categories, setCategories] = useState<VoucherCategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] =
    useState<VoucherCategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminVoucherService.getVoucherCategoriesAPI();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch voucher categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setNameError("");
    setEditingCategory(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (item: VoucherCategoryItem) => {
    setEditingCategory(item);
    setName(item.name);
    setNameError("");
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError("Category name is required.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingCategory?.id) {
        await adminVoucherService.updateVoucherCategoryAPI(editingCategory.id, {
          name: name.trim(),
        });
        toast.success("Updated voucher category successfully.");
      } else {
        await adminVoucherService.createVoucherCategoryAPI({
          name: name.trim(),
        });
        toast.success("Created voucher category successfully.");
      }

      setShowModal(false);
      resetForm();
      await fetchCategories();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save voucher category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await adminVoucherService.deleteVoucherCategoryAPI(categoryToDelete);
      toast.success("Deleted voucher category successfully.");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete voucher category.");
    }
  };

  return (
    <div
      className="p-6 min-h-screen font-poppins relative"
      onClick={() => setOpenMenuId(null)}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Voucher Category</h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#FFD130] hover:bg-[#eec225] 
          text-black font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Plus size={20} /> Create New Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-visible border border-gray-100 mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#EBEBEB]">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600 pl-6">#</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Slug</th>
              <th className="p-4 text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Loading voucher categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No voucher categories found.
                </td>
              </tr>
            ) : (
              categories.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="p-4 pl-6 text-sm font-medium text-gray-800">
                    {index + 1}
                  </td>
                  <td className="p-4 text-sm text-gray-800">{item.name}</td>
                  <td className="p-4 text-sm text-gray-600">{item.slug}</td>
                  <td className="p-4 relative">
                    <div className="flex justify-end">
                      <button
                        className="p-2 hover:bg-gray-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === item.id ? null : item.id);
                        }}
                      >
                        <MoreHorizontal size={20} className="text-gray-600" />
                      </button>
                    </div>

                    {openMenuId === item.id && (
                      <div
                        className={`absolute right-4 w-36 bg-white border 
                        border-gray-200 rounded-lg shadow-lg z-20 ${
                          index >= categories.length - 2 ? "bottom-12" : "top-12"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm 
                          hover:bg-gray-50 text-gray-700"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Pencil size={16} /> Edit
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm 
                          hover:bg-gray-50 text-red-500"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <Trash size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              {editingCategory ? "Edit Voucher Category" : "Add Voucher Category"}
            </h2>

            <div className="space-y-2">
              <label className="text-sm text-gray-500">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                className={`w-full border rounded-lg p-3 text-sm focus:outline-none 
                  focus:border-blue-500 ${nameError ? "border-red-500" : "border-gray-200"}`}
                placeholder="Enter category name"
              />
              {nameError ? (
                <p className="text-red-500 text-xs">{nameError}</p>
              ) : null}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 shadow-blue-200 shadow-md transition-all"
            >
              {submitting
                ? "Saving..."
                : editingCategory
                  ? "Update Category"
                  : "Add Category"}
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This voucher category will be permanently deleted.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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

export default DashboardVoucherCategory;
