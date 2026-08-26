// backend/src/config/multer.js

import multer from 'multer';

// ============================================================
// MEMORY STORAGE
// ============================================================

const storage =
  multer.memoryStorage();

const imageMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

// ============================================================
// IMAGE FILE FILTER
// ============================================================

const fileFilter = (
  req,
  file,
  cb
) => {
  if (
    imageMimeTypes.includes(
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

// ============================================================
// VIDEO + THUMBNAIL UPLOADS
// ============================================================

const videoUploadFileFilter = (req, file, cb) => {
  const isVideo = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ].includes(file.mimetype);
  const isImage = imageMimeTypes.includes(file.mimetype);
  const expectedType = file.fieldname === 'video' ? isVideo : isImage;

  if (expectedType) {
    return cb(null, true);
  }

  const error = new Error(
    file.fieldname === 'video'
      ? 'Only MP4, WebM and MOV video files are allowed'
      : 'Only JPEG, JPG, PNG, GIF and WebP thumbnail images are allowed'
  );
  error.statusCode = 400;
  cb(error);
};

const videoUpload = multer({
  storage,
  fileFilter: videoUploadFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 2,
  },
});

export const uploadVideoFiles = videoUpload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

export default upload;
