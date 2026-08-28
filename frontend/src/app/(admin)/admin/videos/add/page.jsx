// app/(admin)/admin/videos/add/page.jsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { FileVideo } from "lucide-react";
import { VideoUploadFields } from "@/components/admin/VideoUploadFields";

export default function AddVideoPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [selectedVideoName, setSelectedVideoName] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    videoPublicId: null,
    videoStoragePath: null,

    // Custom Upload is selected by default
    sourceType: "upload",

    thumbnail: "",
    thumbnailPublicId: null,

    // UI type
    type: "custom",

    productId: "",
    isActive: true,
    order: 0,
  });

  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);

  // Load products
  useEffect(() => {
    adminService
      .getProducts({ limit: 200 })
      .then((data) => {
        setProducts(data.items || data.products || []);
      })
      .catch(() => {
        setProducts([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Video type change
    if (name === "type") {
      let sourceType = "upload";

      if (value === "instagram") {
        sourceType = "instagram";
      } else if (value === "youtube") {
        sourceType = "direct";
      }

      setFormData((prev) => ({
        ...prev,
        type: value,
        sourceType,
        url: "",
        videoPublicId: null,
        videoStoragePath: null,
      }));

      setSelectedVideoName("");

      setErrors((prev) => ({
        ...prev,
        url: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.productId) {
      newErrors.productId = "Please select a product";
    }

    // Custom uploaded video
    if (formData.type === "custom") {
      if (!formData.url.trim()) {
        newErrors.url = "Please upload a video file";
      }
    }

    // Instagram
    if (formData.type === "instagram") {
      const instagramRegex =
        /^https?:\/\/(?:www\.)?instagram\.com\/reel\/[^/?#]+\/?/i;

      if (!instagramRegex.test(formData.url.trim())) {
        newErrors.url = "Enter a valid Instagram Reel URL";
      }
    }

    // YouTube
    if (formData.type === "youtube") {
      const youtubeRegex =
        /^https?:\/\/(?:www\.)?(youtube\.com|youtu\.be)\/.+/i;

      if (!youtubeRegex.test(formData.url.trim())) {
        newErrors.url = "Enter a valid YouTube video URL";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // VIDEO UPLOAD
  // --------------------------------------------------
  // This is the ONLY manual video upload button.
  // Video -> Backend -> Supabase Storage
  // Thumbnail remains handled separately by VideoUploadFields.
  // --------------------------------------------------
  const handleVideoUpload = async (file) => {
    if (!file) return;

    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast(
        "Choose an MP4, WebM, or MOV video file.",
        "error"
      );
      return;
    }

    // Supabase bucket maximum = 50 MB
    if (file.size > 50 * 1024 * 1024) {
      showToast(
        "Video files must be 50MB or smaller.",
        "error"
      );
      return;
    }

    const uploadData = new FormData();

    // IMPORTANT:
    // Backend expects the multipart field name "video".
    uploadData.append("video", file);

    setUploadingVideo(true);

    try {
      const uploaded =
        await adminService.uploadVideoAsset(uploadData);

      if (!uploaded?.video?.url) {
        throw new Error(
          "Video upload completed but no video URL was returned."
        );
      }

      setFormData((previous) => ({
        ...previous,

        // Supabase public URL
        url: uploaded.video.url,

        // Uploaded video type
        sourceType: "upload",
        type: "custom",

        // Supabase storage path
        videoStoragePath:
          uploaded.video.path || null,

        // Video is NOT stored in Cloudinary
        videoPublicId: null,
      }));

      setSelectedVideoName(file.name);

      setErrors((previous) => ({
        ...previous,
        url: "",
      }));

      showToast(
        "Video uploaded successfully.",
        "success"
      );
    } catch (error) {
      console.error("Video upload failed:", error);

      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload video.",
        "error"
      );
    } finally {
      setUploadingVideo(false);
    }
  };

  // --------------------------------------------------
  // CREATE VIDEO
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadingVideo) {
      showToast(
        "Please wait until the video upload finishes.",
        "error"
      );
      return;
    }

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await adminService.createVideo(formData);

      showToast(
        "Video created successfully!",
        "success"
      );

      router.push("/admin/videos");
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Add Video
        </h1>

        <p className="text-sm text-gray-500">
          Add a new video
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl"
      >
        <div className="space-y-4">

          {/* TITLE */}
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

          {/* DESCRIPTION */}
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

          {/* VIDEO TYPE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white"
            >
              <option value="custom">
                Custom Upload
              </option>

              <option value="instagram">
                Instagram
              </option>

              <option value="youtube">
                YouTube
              </option>
            </select>
          </div>

          {/* PRODUCT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product *
            </label>

            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
            >
              <option value="">
                Select Product
              </option>

              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                >
                  {product.name}
                  {product.price !== undefined
                    ? ` - Rs ${product.price}`
                    : ""}
                </option>
              ))}
            </select>

            {errors.productId && (
              <p className="mt-1 text-xs text-red-600">
                {errors.productId}
              </p>
            )}
          </div>

          {/* ==========================================
              MANUAL VIDEO UPLOAD
              ONLY ONE VIDEO UPLOAD BUTTON
             ========================================== */}
          {formData.type === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video
              </label>

              <label
                className={`inline-flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg transition-colors text-sm text-gray-600 ${
                  uploadingVideo
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer hover:bg-gray-50"
                }`}
              >
                {uploadingVideo ? (
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FileVideo className="w-4 h-4" />
                )}

                <span>
                  {uploadingVideo
                    ? "Uploading video..."
                    : selectedVideoName
                    ? "Change Video"
                    : "Upload Video File"}
                </span>

                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  disabled={uploadingVideo}
                  onChange={(event) => {
                    const file =
                      event.target.files?.[0];

                    handleVideoUpload(file);

                    // Allow selecting the same file again
                    event.target.value = "";
                  }}
                  className="hidden"
                />
              </label>

              {selectedVideoName && (
                <p className="mt-2 text-xs text-gray-500">
                  Selected: {selectedVideoName}
                </p>
              )}

              {errors.url && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.url}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-400">
                MP4, WebM or MOV — maximum 50MB
              </p>
            </div>
          )}

          {/* INSTAGRAM / YOUTUBE URL */}
          {formData.type !== "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === "instagram"
                  ? "Instagram Reel URL"
                  : "YouTube Video URL"}
              </label>

              <Input
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder={
                  formData.type === "instagram"
                    ? "https://www.instagram.com/reel/..."
                    : "https://www.youtube.com/watch?v=..."
                }
                error={errors.url}
              />
            </div>
          )}

          {/* ==========================================
              EXISTING THUMBNAIL SYSTEM
              DO NOT REMOVE
              
              This component is responsible for the
              OPTIONAL thumbnail upload.
              
              Thumbnail -> Cloudinary
              Video -> Supabase
             ========================================== */}
          <VideoUploadFields
            formData={formData}
            setFormData={setFormData}
            setErrors={setErrors}
          />

          {/* DISPLAY ORDER */}
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

          {/* ACTIVE */}
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />

              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d9006c]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:bg-[#d9006c] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all">
              </div>

              <span className="ms-3 text-sm font-medium text-gray-700">
                Active
              </span>
            </label>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <Button
              type="submit"
              disabled={loading || uploadingVideo}
            >
              {uploadingVideo
                ? "Uploading video..."
                : loading
                ? "Creating..."
                : "Create Video"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={loading || uploadingVideo}
              onClick={() =>
                router.push("/admin/videos")
              }
            >
              Cancel
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
}