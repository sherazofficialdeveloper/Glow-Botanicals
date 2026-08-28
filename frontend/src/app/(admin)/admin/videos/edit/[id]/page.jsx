// app/(admin)/admin/videos/edit/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { VideoUploadFields } from "@/components/admin/VideoUploadFields";

export default function EditVideoPage({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    videoPublicId: null,
    videoStoragePath: null,
    sourceType: "instagram",
    thumbnail: "",
    thumbnailPublicId: null,
    type: "instagram",
    productId: "",
    isActive: true,
    order: 0,
  });
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    adminService
      .getProducts({ limit: 200 })
      .then((data) => setProducts(data.items || data.products || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const data = await adminService.getVideo(id);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          url: data.url || "",
          videoPublicId: data.videoPublicId || null,
          videoStoragePath: data.videoStoragePath || null,
          sourceType: data.sourceType || (data.type === "instagram" ? "instagram" : data.type === "custom" ? "upload" : "direct"),
          thumbnail: data.thumbnail || "",
          thumbnailPublicId: data.thumbnailPublicId || null,
          type: data.type || "instagram",
          productId: data.productId?._id || data.productId || "",
          isActive: data.isActive !== undefined ? data.isActive : true,
          order: data.order || 0,
        });
      } catch (error) {
        showToast("Failed to load video", "error");
        router.push("/admin/videos");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchVideo();
  }, [id, router, showToast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "type") {
      const sourceType = value === "custom" ? "upload" : value === "instagram" ? "instagram" : "direct";
      setFormData((prev) => ({ ...prev, sourceType }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.productId) newErrors.productId = "Please select a product";
    if (formData.type === "instagram" && !/^https?:\/\/(?:www\.)?instagram\.com\/reel\/[^/?#]+\/?/i.test(formData.url.trim()))
      newErrors.url = "Enter a valid Instagram Reel URL";
    if (formData.type === "youtube" && !/^https?:\/\/(?:www\.)?(youtube\.com|youtu\.be)\//i.test(formData.url.trim()))
      newErrors.url = "Enter a valid YouTube video URL";
    if (formData.type === "custom" && !formData.url.trim())
      newErrors.url = "Upload a video file";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await adminService.updateVideo(id, formData);
      showToast("Video updated successfully!", "success");
      router.push("/admin/videos");
    } catch (error) {
      showToast(error.message || "Failed to update video", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading video..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Video</h1>
        <p className="text-sm text-gray-500">Update video information</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Video title"
              error={errors.title}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
              placeholder="Brief description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL
            </label>
            <Input
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              error={errors.url}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail URL
            </label>
            <Input
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <VideoUploadFields
            formData={formData}
            setFormData={setFormData}
            setErrors={setErrors}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white">
              <option value="custom">Custom Upload</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
            <select name="productId" value={formData.productId} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
              <option value="">Select Product</option>
              {products.map((product) => <option key={product._id} value={product._id}>{product.name} - Rs {product.price}</option>)}
            </select>
            {errors.productId && <p className="mt-1 text-xs text-red-600">{errors.productId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <Input
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d9006c]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:bg-[#d9006c] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                Active
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Video"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/videos")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
