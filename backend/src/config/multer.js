// backend/src/config/multer.js

import multer from 'multer';

// ============================================================
// MEMORY STORAGE
// ============================================================

const storage =
  multer.memoryStorage();

// ============================================================
// IMAGE FILE FILTER
// ============================================================

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (
    allowedMimeTypes.includes(
      file.mimetype
    )
  ) {
    return cb(
      null,
      true
    );
  }

  cb(
    new Error(
      'Only JPEG, JPG, PNG, GIF and WebP images are allowed'
    )
  );
};

// ============================================================
// MULTER LIMITS
// ============================================================

const limits = {
  fileSize:
    5 * 1024 * 1024, // 5MB
};

// ============================================================
// MULTER INSTANCE
// ============================================================

const upload = multer({
  storage,
  fileFilter,
  limits,
});

// ============================================================
// SINGLE FILE
// ============================================================

export const uploadSingle = (
  fieldName
) => {
  return upload.single(
    fieldName
  );
};

// ============================================================
// MULTIPLE FILES
// ============================================================

export const uploadMultiple = (
  fieldName,
  maxCount = 5
) => {
  return upload.array(
    fieldName,
    maxCount
  );
};

// ============================================================
// MULTIPLE FIELDS
// ============================================================

export const uploadFields = (
  fields
) => {
  return upload.fields(
    fields
  );
};

export default upload;