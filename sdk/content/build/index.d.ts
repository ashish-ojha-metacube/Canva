declare type AllOrNone<T> = T | Never<T>;

/**
 * @public
 * An API for operating the user's content.
 */
export declare interface Content {
    /**
     * This method creates a new media upload task and adds it to the upload queue.
     * It returns a media reference, and a function called `whenUploaded()` that can
     * be used to await the upload result.
     */
    queueMediaUpload(options: QueueImageUploadOptions): Promise<QueueImageUploadResult>;
    queueMediaUpload(options: QueueVideoUploadOptions): Promise<QueueVideoUploadResult>;
    queueMediaUpload(options: QueueMediaUploadOptions): Promise<QueueMediaUploadResult>;
}

/**
 * @public
 * The image dimensions
 */
export declare type Dimensions = {
    /**
     * Image width. Used only to calculate the aspect ratio.
     */
    readonly width: number;
    /**
     * Image height. Used only to calculate the aspect ratio.
     */
    readonly height: number;
};

export declare function getContent(): Content;

/**
 * @public
 * A string of any given supported image MIME type
 */
export declare type ImageMimeType = 'image/jpeg' | 'image/heic' | 'image/png' | 'image/svg+xml';

/**
 * @public
 * The image reference – a unique image identifier that Canva recognizes.
 */
export declare type ImageRef = string & {
    __imageRef: never;
};

/**
 * The error details of a failed media upload
 * when the reason is invalid image dimensions provided by the app.
 * Valid width and height must be positive integers and the entire
 * pixel area of the image must be less than 250 megapixels.
 */
declare type InvalidDimensions = {
    readonly type: 'invalid_dimensions';
};

/**
 * The error details of a failed media upload
 * when the reason is invalid resource id provided by the app.
 * A valid resource id must be an alphanumeric string of up to 100 characters.
 */
declare type InvalidId = {
    readonly type: 'invalid_id';
};

/**
 * The error details of a failed media upload
 * when the reason is invalid media type provided by the app.
 * Valid media types are:
 * - IMAGE
 */
declare type InvalidMediaType = {
    readonly type: 'invalid_media_type';
};

/**
 * The error details of a failed media upload
 * when the reason is invalid options provided by the app.
 */
declare type InvalidOptions = {
    readonly type: 'invalid_options';
};

/**
 * The error details of a failed media upload
 * when the reason is invalid preview image URL provided by the app.
 * A valid URL must be an HTTPS URL of up to 4096 characters.
 */
declare type InvalidThumbnailUrl = {
    readonly type: 'invalid_thumbnail_url';
};

/**
 * The error details of a failed media upload
 * when the reason is invalid image URL provided by the app.
 * A valid URL must be an HTTPS URL of up to 4096 characters.
 */
declare type InvalidUrl = {
    readonly type: 'invalid_url';
};

/**
 * The error details of a failed media upload
 * when the reason is the wrong MIME type provided by the app.
 */
declare type MismatchedMimeType = {
    readonly type: 'mismatched_mime_type';
};

declare type Never<T> = {
    [key in keyof T]?: never;
};

/**
 * The error details of a failed media upload
 * when the reason is the user being offline.
 */
declare type OfflineUser = {
    readonly type: 'offline';
};

/**
 * The error details of a failed media upload when the reason is the media file being too big.
 * The max supported media file size is 25 MB.
 */
declare type OversizedMedia = {
    readonly type: 'oversized_media';
};

/**
 * The error details of a failed media upload when the reason is the media having too much pixels.
 * We support only media of up to 250 megapixels.
 */
declare type OversizedMediaDimensions = {
    readonly type: 'oversized_media_dimensions';
};

/**
 * @public
 * The result of a failed image upload request.
 */
export declare type QueueImageUploadFailed = {
    /**
     * The type of the result. Always 'failed'.
     */
    readonly type: 'failed';
    /**
     * The details about the failure reason.
     */
    readonly reason: QueueImageUploadFailureReason;
};

/**
 * @public
 * The reason why the image upload failed.
 */
export declare type QueueImageUploadFailureReason = InvalidOptions | InvalidMediaType | InvalidId | InvalidUrl | UnsupportedMimeType | MismatchedMimeType | InvalidThumbnailUrl | InvalidDimensions | UnavailableThumbnail | QuotaExceeded | OfflineUser | UnknownError;

/**
 * @public
 * Options that the app must supply to initiate the image upload.
 */
export declare type QueueImageUploadOptions = {
    /**
     * For image upload, the type is always 'IMAGE'
     */
    readonly type: 'IMAGE';
    /**
     * An id is a unique identifier specified by the developer,
     * It must be an alphanumeric string of up to 100 characters.
     * Each resource id uniquely identifies an external image.
     */
    readonly id: string;
    /**
     * A URL of the image to upload. Must be an HTTPS URL of up to 4096 characters.
     */
    readonly url: string;
    /**
     * A MIME type of the image. It must be one of these:
     * - image/jpeg
     * - image/heic
     * - image/png
     * - image/svg+xml
     */
    readonly mimeType: ImageMimeType;
    /**
     * A URL of a smaller image or a thumbnail that Canva will display while the image upload
     * is still in progress. Must be a valid HTTPS URL of up to 4096 characters.
     */
    readonly thumbnailUrl: string;
} & AllOrNone<Dimensions>;

/**
 * @public
 * The result of initiating an image upload
 */
export declare type QueueImageUploadResult = QueueImageUploadSucceeded | QueueImageUploadFailed;

/**
 * @public
 * The result of a successfully initiated image upload request.
 */
export declare type QueueImageUploadSucceeded = {
    /**
     * The type of the result. Always 'done'.
     */
    readonly type: 'done';
    /**
     * The image reference – a unique ID of an image file that Canva recognizes.
     */
    readonly ref: ImageRef;
    /**
     * A method that a developer can call to await the image upload completion.
     */
    readonly whenUploaded: () => Promise<WhenImageUploadedResult>;
};

/**
 * @public
 * Options that the app must supply to initiate the media upload.
 */
export declare type QueueMediaUploadOptions = QueueImageUploadOptions | QueueVideoUploadOptions;

/**
 * @public
 * The result of initiating a media upload
 */
export declare type QueueMediaUploadResult = QueueImageUploadResult | QueueVideoUploadResult;

/**
 * @public
 * The result of a failed video upload request.
 */
export declare type QueueVideoUploadFailed = {
    /**
     * The type of the result. Always 'failed'.
     */
    readonly type: 'failed';
    /**
     * The details about the failure reason.
     */
    readonly reason: QueueVideoUploadFailureReason;
};

/**
 * @public
 * The reason why the video upload failed.
 */
export declare type QueueVideoUploadFailureReason = InvalidOptions | InvalidMediaType | InvalidId | InvalidUrl | UnsupportedMimeType | MismatchedMimeType | InvalidThumbnailUrl | InvalidDimensions | UnavailableThumbnail | QuotaExceeded | OfflineUser | UnknownError;

/**
 * @public
 * Options that the app must supply to initiate the video upload.
 */
export declare type QueueVideoUploadOptions = {
    /**
     * For video upload, the type is always 'VIDEO'
     */
    readonly type: 'VIDEO';
    /**
     * An id is a unique identifier specified by the developer.
     * It must be an alphanumeric string of up to 100 characters.
     * Each resource id uniquely identifies an external video.
     */
    readonly id: string;
    /**
     * A URL of the video to upload. Must be an HTTPS URL of up to 4096 characters.
     */
    readonly url: string;
    /**
     * A MIME type of the video. It must be one of these:
     * - video/avi
     * - image/gif
     * - video/x-m4v
     * - video/x-matroska
     * - video/quicktime
     * - video/mp4
     * - video/mpeg
     * - video/webm
     */
    readonly mimeType: VideoMimeType;
    /**
     * A URL of a smaller video that Canva will display while the image upload
     * is still in progress. Must be a valid HTTPS URL of up to 4096 characters.
     */
    readonly thumbnailVideoUrl?: string;
    /**
     * A URL of a smaller image that Canva will display while the image upload
     * is still in progress. Must be a valid HTTPS URL of up to 4096 characters.
     */
    readonly thumbnailImageUrl: string;
} & AllOrNone<Dimensions>;

/**
 * @public
 * The result of initiating a video upload
 */
export declare type QueueVideoUploadResult = QueueVideoUploadSucceeded | QueueVideoUploadFailed;

/**
 * @public
 * The result of a successfully initiated video upload request.
 */
export declare type QueueVideoUploadSucceeded = {
    /**
     * The type of the result. Always 'done'.
     */
    readonly type: 'done';
    /**
     * The video reference – a unique ID of a video file that Canva recognizes.
     */
    readonly ref: VideoRef;
    /**
     * A method that a developer can call to await the video upload completion.
     */
    readonly whenUploaded: () => Promise<WhenVideoUploadedResult>;
};

/**
 * The error details of a failed media upload
 * when the reason is the upload quota exceeded for the user.
 */
declare type QuotaExceeded = {
    readonly type: 'quota_exceeded';
};

/**
 * @public
 * A generic type for all media references including images, videos, and audios.
 */
export declare type Ref = ImageRef | VideoRef;

/**
 * The error details of a failed media upload
 * when the reason is the upload timeout.
 */
declare type Timeout = {
    readonly type: 'timeout';
};

/**
 * This error occurs when the media being uploaded is either unavailable at the specified URL
 * or is not served with HTTP status code 200.
 */
declare type UnavailableMedia = {
    readonly type: 'unavailable_media';
};

/**
 * The error details of a failed media upload when the reason is not being able
 * to download the thumbnail image to get its dimensions or show it as a preview
 * while the upload is being processed.
 */
declare type UnavailableThumbnail = {
    readonly type: 'unavailable_thumbnail';
};

/**
 * The error details of a failed media upload
 * when the reason is unknown, or we don't want to expose it to the app.
 */
declare type UnknownError = {
    readonly type: 'unknown';
};

/**
 * The error details of a failed media upload
 * when the reason is invalid MIME type provided by the app.
 * A valid MIME type must be:
 * - For images:
 *   - image/jpeg
 *   - image/heic
 *   - image/png
 *   - image/svg+xml
 */
declare type UnsupportedMimeType = {
    readonly type: 'unsupported_mime_type';
};

/**
 * @public
 * A string of any given supported video MIME type
 */
export declare type VideoMimeType = 'video/avi' | 'image/gif' | 'video/x-m4v' | 'video/x-matroska' | 'video/quicktime' | 'video/mp4' | 'video/mpeg' | 'video/webm';

/**
 * @public
 * The video reference – a unique video identifier that Canva recognizes.
 */
export declare type VideoRef = string & {
    __videoRef: never;
};

/**
 * @public
 * The result of a failed image upload.
 */
export declare type WhenImageUploadedFailed = {
    /** */
    readonly type: 'failed';
    /**
     * The details about the failure reason.
     */
    readonly reason: WhenImageUploadedFailureReason;
};

/**
 * @public
 * The reason why the image upload failed.
 */
export declare type WhenImageUploadedFailureReason = OversizedMedia | OversizedMediaDimensions | MismatchedMimeType | UnavailableMedia | Timeout | UnknownError;

/**
 * @public
 * The result of awaiting the image upload completion.
 */
export declare type WhenImageUploadedResult = WhenImageUploadedSucceeded | WhenImageUploadedFailed;

/**
 * @public
 * The result of a successful image upload.
 */
export declare type WhenImageUploadedSucceeded = {
    /**
     * The type of the result. Always 'done'.
     */
    readonly type: 'done';
};

/**
 * @public
 * The result of awaiting the media upload completion.
 */
export declare type WhenMediaUploadedResult = WhenImageUploadedResult | WhenVideoUploadedResult;

/**
 * @public
 * The result of a failed video upload.
 */
export declare type WhenVideoUploadedFailed = {
    /** */
    readonly type: 'failed';
    /**
     * The details about the failure reason.
     */
    readonly reason: WhenVideoUploadedFailureReason;
};

/**
 * @public
 * The reason why the video upload failed.
 */
export declare type WhenVideoUploadedFailureReason = OversizedMedia | MismatchedMimeType | UnavailableMedia | Timeout | UnknownError;

/**
 * @public
 * The result of awaiting the video upload completion.
 */
export declare type WhenVideoUploadedResult = WhenVideoUploadedSucceeded | WhenVideoUploadedFailed;

/**
 * @public
 * The result of a successful video upload.
 */
export declare type WhenVideoUploadedSucceeded = {
    /**
     * The type of the result. Always 'done'.
     */
    readonly type: 'done';
};

export { }
