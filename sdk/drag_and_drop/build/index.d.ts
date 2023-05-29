declare type CommonImageDragData = {
    /**
     * The type of element.
     */
    type: 'IMAGE';
    /**
     * The dimensions of the preview image.
     *
     * @remarks
     * The preview image is the image that users see under their cursor while dragging
     * it into their design.
     */
    previewSize: Dimensions;
};

/**
 * @public
 * Represents a width and a height.
 */
export declare type Dimensions = {
    /**
     * Represents a width, in pixels.
     */
    width: number;
    /**
     * Represents a height, in pixels.
     */
    height: number;
};

/**
 * The methods for adding drag-and-drop behavior to an app.
 * @public
 */
export declare interface DragAndDrop {
    /**
     * Makes the specified node draggable.
     *
     * @param options - Options for making an element draggable.
     */
    makeDraggable(options: DraggableElementData): void;
}

/**
 * @public
 * Callbacks that run during the lifecycle of a drag and drop.
 */
export declare type DragCallback = {
    /**
     * A callback that runs when the user starts dragging an element into their design.
     *
     * @param element - The element being dragged into the user's design.
     */
    onDragStart: (element: HTMLElement) => void;
    /**
     * A callback that runs when the user finishes dragging an element into their design.
     *
     * @param element - The element being dragged into the user's design.
     */
    onDragEnd: (element: HTMLElement) => void;
};

/**
 * @public
 * Options for making an element draggable.
 */
export declare type DraggableElementData = ElementData | ImageElementData;

/**
 * @public
 * Options for making an `HTMLElement` draggable.
 */
export declare type ElementData = DragCallback & {
    /**
     * The element to be made draggable.
     */
    node: HTMLElement;
    /**
     * Options for defining the drag and drop behavior.
     *
     * @remarks
     * This data is required because it can't be inferred from the `node` property.
     */
    dragData: UserSuppliedDragData;
};

export declare function getDragAndDrop(): DragAndDrop;

/**
 * @public
 * Options for making an `HTMLImageElement` draggable.
 */
export declare type ImageElementData = DragCallback & {
    /**
     * The element to be made draggable.
     */
    node: HTMLImageElement;
    /**
     * Options for defining the drag and drop behavior.
     *
     * @remarks
     * If any of this data is omitted, it's inferred from the `node` property.
     */
    dragData?: Partial<UserSuppliedImageDragData> | (Partial<UserSuppliedVideoDragData> & Pick<UserSuppliedVideoDragData, 'type' | 'resolveVideoRef'>);
};

/**
 * @public
 *
 * The ref of an uploaded image. Used in conjunction with
 * external image Drag and Drop.
 */
export declare type ImageRef = {
    ref: string;
};

/**
 * @public
 * Represents X and Y coordinates.
 */
export declare type Position = {
    /**
     * Represents an X coordinate, in pixels.
     */
    x: number;
    /**
     * Represents a Y coordinate, in pixels.
     */
    y: number;
};

/**
 * @public
 *
 * Options for defining the Drag and Drop behaviour for images
 * which have been supplied as data urls
 */
export declare type UserSuppliedDataUrlImageDragData = CommonImageDragData & {
    /**
     * The dimensions of the full-size image.
     *
     * @remarks
     * The full-size image is the image that Canva uploads to the user's account and
     * adds to their design.
     *
     * If omitted, the value of the `previewSize` property is used as a fallback.
     */
    fullSize?: Dimensions;
    /**
     * The data URL of the preview image.
     *
     * @remarks
     * The preview image is the image that users see under their cursor while dragging
     * it into their design.
     *
     * If omitted, the value of the `fullSizeSrc` property is used as a fallback.
     */
    previewSrc?: string;
    /**
     * The data URL of the full-size image.
     *
     * @remarks
     * The full-size image is the image that Canva uploads to the user's account and
     * adds to their design.
     */
    fullSizeSrc: string;
};

/**
 * @public
 * Options for defining the drag and drop behavior that can be defined by an app developer.
 */
export declare type UserSuppliedDragData = UserSuppliedImageDragData | UserSuppliedTextDragData | UserSuppliedVideoDragData;

/**
 * @public
 *
 * Options for defining the Drag and Drop behaviour for images uploaded
 * via the Content capability.
 */
export declare type UserSuppliedExternalImageDragData = CommonImageDragData & {
    /**
     * The function that resolves an image ref
     * @remarks
     *
     * This function will be run during the drag process in order to fetch the media ref of the
     * external image being fetched. This function should return the result of `queueMediaUpload`
     * from the content capability.
     */
    resolveImageRef: () => Promise<ImageRef>;
    /**
     * The URL of the preview image.
     *
     * @remarks
     * The preview image is the image that users see under their cursor while dragging
     * it into their design.
     */
    previewSrc: string;
    /**
     * The dimensions of the full-size image.
     *
     * @remarks
     * The full-size image is the image that Canva uploads to the user's account and
     * adds to their design.
     *
     * If omitted, the value of the `previewSize` property is used as a fallback.
     */
    fullSize?: Dimensions;
};

/**
 * @public
 * Options for defining the drag and drop behavior of an image element that can be defined by an
 * app developer.
 */
export declare type UserSuppliedImageDragData = UserSuppliedDataUrlImageDragData | UserSuppliedExternalImageDragData;

/**
 * @public
 * Options for defining the drag and drop behavior of a text element.
 */
export declare type UserSuppliedTextDragData = {
    /**
     * The type of element.
     */
    type: 'TEXT';
    /**
     * The text content to drag.
     */
    children?: string[];
    /**
     * The alignment of the text. The default value is 'start'.
     */
    textAlign?: 'start' | 'center' | 'end';
    /**
     * The weight of the font. The default value is 'normal'.
     */
    fontWeight?: 'normal' | 'bold';
    /**
     * The style of the font. The default value is 'normal'.
     */
    fontStyle?: 'normal' | 'italic';
    /**
     * The decoration of the font. The default value is 'none'.
     */
    decoration?: 'none' | 'underline';
};

/**
 * @public
 * Options for defining the drag and drop behavior for videos.
 */
export declare type UserSuppliedVideoDragData = {
    /**
     * The type of element.
     */
    type: 'VIDEO';
    /**
     * The function used resolve the video ref.
     * This is used in conjuntion with content import.
     */
    resolveVideoRef: () => Promise<VideoRef>;
    /**
     * The dimensions of the preview image.
     * @remarks
     * The preview image is the image that users see under their cursor
     * while dragging it into their design.
     */
    previewSize: Dimensions;
    /**
     * The dimensions of the full-size video.
     * These dimensions are used when adding the video to the design
     *
     * If omitted, the value of the `previewSize` property is
     * used as a fallback.
     */
    fullSize?: Dimensions;
    /**
     * The URL of the preview image.
     *
     * @remarks
     * The preview image is the image that users see under their cursor while dragging
     * it into their design.
     */
    previewSrc: string;
};

/**
 * @public
 */
export declare type VideoRef = {
    ref: string & {
        __videoRef: never;
    };
};

export { }
