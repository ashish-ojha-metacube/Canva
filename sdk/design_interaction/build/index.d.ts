/**
 * @public
 * A callback that runs when an app element's data is created or updated,
 * or when the user selects an existing app element.
 */
export declare type AppElementChangeHandler<A extends AppElementData> = (appElement: {
    data: A;
    version: number;
} | undefined) => void;

/**
 * @public
 * The data an app can attach to an app element.
 */
export declare type AppElementData = Record<string, Value>;

/**
 * @public
 * A callback that runs when an app's element is changed.
 *
 * @remarks
 * This callback must return one or more elements to render within the app element.
 */
export declare type AppElementRenderer<A extends AppElementData> = (appElementData: A) => AppElementRendererOutput;

/**
 * @public
 * A return value of {@link AppElementRenderer} function.
 * It is an array of elements to render within an app element.
 */
export declare type AppElementRendererOutput = Exclude<NativeSimpleElementWithBox, NativeVideoElementWithBox>[];

/**
 * @public
 * The dimensions, position, and rotation of an element.
 *
 * @remarks
 * Units are relative to the parent container both in terms of position and size
 */
declare type Box = Position & (WidthAndHeight | Width | Height);

/**
 * An API for interacting with the user's design.
 * @public
 */
export declare interface DesignInteraction<A extends AppElementData> {
    /**
     * Adds a native element to the user's design.
     * @param element - The element to add to the user's design.
     */
    addNativeElement(element: NativeElement | NativeElementWithBox): Promise<void>;
    /**
     * Attaches data to an app element. If data already exists, it's overwritten.
     * @param appElementData - The data to attach to the app element.
     */
    setAppElementData: (appElementData: A, placement?: Placement) => Promise<void>;
    /**
     * Registers a callback that runs when the app element's data is created or
     * updated and when the user selects an existing app element.
     * @param handler - The callback to run when the app element's data is changed
     * and when the user selects an existing app element.
     */
    onAppElementChange: (handler: AppElementChangeHandler<A>) => void;

    /**
     * Registers a callback that renders the app element when its data is created
     * or updated.
     * @param renderAppElement - The callback that renders the app element when
     * its data changes.
     */
    registerRenderAppElement(renderAppElement: AppElementRenderer<A>): void;

    /**
     * Allows to get the context of currently selected page.
     * @returns Page context of currently selected page
     */
    getCurrentPageContext: () => Promise<PageContext>;
}

/**
 * @public
 * The appearance of a path's interior.
 */
export declare type Fill = {
    /**
     * The color of the fill as a hex code.
     *
     * @remarks
     * The hex code must include all six characters and be prefixed with a # symbol (e.g. #ff0099).
     */
    color: string | undefined;
};

export declare function getDesignInteraction<A extends AppElementData>(): DesignInteraction<A>;

declare type Height = {
    width: 'auto';
    height: number;
};

/**
 * @public
 * The media reference – a unique image identifier that Canva recognizes.
 */
declare type ImageRef = string & {
    __imageRef: never;
};

/**
 * @public
 * A native element.
 */
export declare type NativeElement = NativeImageElement | NativeVideoElement | NativeEmbedElement | NativeTextElement | NativeShapeElement | NativeGroupElement;

/**
 * @public
 * The types of elements an app can add to a user's design.
 */
export declare type NativeElementType = 'IMAGE' | 'EMBED' | 'TEXT' | 'SHAPE' | 'VIDEO';

/**
 * @public
 * An element that exists within an app or group element.
 */
export declare type NativeElementWithBox = NativeImageElementWithBox | NativeVideoElementWithBox | NativeEmbedElementWithBox | NativeTextElementWithBox | NativeShapeElementWithBox | NativeGroupElementWithBox;

/**
 * @public
 * An element that renders an embeddable piece of media, such as a YouTube video.
 */
export declare type NativeEmbedElement = {
    /**
     * The type of element.
     */
    type: 'EMBED';
    /**
     * The URL of the embed. This URL must be supported by the Iframely API.
     */
    url: string;
};

/**
 * @public
 * An element that renders an embeddable piece of media, such as a YouTube video.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions of the
 * element.
 * It will be positioned and sized relative to its parent container.
 * The parent container may be an app element, or the current page.
 */
export declare type NativeEmbedElementWithBox = {
    /**
     * The type of element.
     */
    type: 'EMBED';
    /**
     * The URL of the embed.
     *
     * @remarks
     * This URL must be supported by the Iframely API.
     */
    url: string;
} & Box;

/**
 * @public
 * An element containing two or more {@link NativeElementWithBox}.
 */
export declare type NativeGroupElement = {
    /**
     * The type of element.
     */
    type: 'GROUP';
    /**
     * The inner elements contained by the group element. These elements require a Box as they are
     * relatively positioned to the outer boundaries of the group element.
     */
    children: NativeSimpleElementWithBox[];
};

/**
 * @public
 * An element containing two or more {@link NativeSimpleElementWithBox}.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions
 * of the element
 */
declare type NativeGroupElementWithBox = {
    /**
     * The type of element.
     */
    type: 'GROUP';
    /**
     * The inner elements contained by the group element. These elements require a Box as they are
     * relatively positioned to the outer boundaries of the group element.
     */
    children: NativeSimpleElementWithBox[];
} & Box;

/**
 * @public
 * An element that renders an image, such as a PNG, JPEG, or SVG from a dataUrl,
 * or from a media reference (ref) returned from Content capability.
 */
export declare type NativeImageElement = {
    /**
     * The type of element.
     */
    type: 'IMAGE';
} & ({
    /**
     * A data URL that contains the image data.
     */
    dataUrl: string;
    /**
     * A media reference of an image that is previously imported using Content capability.
     */
    ref?: never;
} | {
    /**
     * A data URL that contains the image data.
     */
    dataUrl?: never;
    /**
     * A media reference of an image that is previously imported using Content capability.
     */
    ref: ImageRef;
});

/**
 * @public
 * An element that renders an image, such as a PNG, JPEG, or SVG from a dataUrl,
 * or from a media reference (ref) returned from Content capability.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions
 * of the element.
 * It will be positioned and sized relative to its parent container.
 * The parent container may be an app element, or the current page.
 */
export declare type NativeImageElementWithBox = NativeImageElement & Box;

/**
 * @public
 * An element that renders a vector shape.
 */
export declare type NativeShapeElement = {
    /**
     * The type of element.
     */
    type: 'SHAPE';
    /**
     * Properties for configuring the scale and cropping of a shape.
     *
     * @remarks
     * This is similar to the `viewBox` attribute of the <svg> element.
     */
    viewBox: ShapeViewBox;
    /**
     * The paths that define the shape of the element.
     *
     * @remarks
     * There must be between 1 and 30 paths. The maximum combined size of all paths must
     * not exceed 2kb. The maximum numbrer of unique fill colors across all paths is 6.
     */
    paths: ShapePath[];
};

/**
 * @public
 * An element that renders a vector shape.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions of the
 * element.
 * It will be positioned and sized relative to its parent container.
 * The parent container may be an app element, or the current page.
 */
export declare type NativeShapeElementWithBox = {
    /**
     * The type of element.
     */
    type: 'SHAPE';
    /**
     * Properties for configuring the scale and cropping of a shape.
     *
     * @remarks
     * This is similar to the `viewBox` attribute of the <svg> element.
     */
    viewBox: ShapeViewBox;
    /**
     * The paths that define the shape of the element.
     */
    paths: ShapePath[];
} & Box;

/**
 * @public
 * An element that exists within a group element.
 */
export declare type NativeSimpleElementWithBox = Exclude<NativeElementWithBox, NativeGroupElementWithBox>;

/**
 * @public
 * An element that renders text.
 */
export declare type NativeTextElement = {
    /**
     * The type of element.
     */
    type: 'TEXT';
    /**
     * The text to render within the element. In the future, each item in this
     * array will map to a paragraph. At the moment, only one item is supported.
     */
    children: string[];
} & TextAttributes;

/**
 * @public
 * An element that renders text.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions of the
 * element.
 * It will be positioned and sized relative to its parent container.
 * The parent container may be an app element, or the current page.
 */
export declare type NativeTextElementWithBox = {
    /**
     * The type of element.
     */
    type: 'TEXT';
    /**
     * The text to render within the element.
     *
     * @remarks
     * In the future, each item in this array will map to a paragraph. At the moment,
     * only one item is supported.
     */
    children: [string];
    /**
     * The width of the element. This must be an integer between 0 and 32767.
     */
    width?: number;
    /**
     * The distance from the top edge of the container.
     *
     * @remarks
     * This must be an integer between -32768 and 32767. This property doesn't have
     * any effect if the app element only contains a single element.
     */
    top: number;
    /**
     * The distance from the left edge of the container.
     *
     * @remarks
     * This must be an integer between -32768 and 32767. This property doesn't have
     * any effect if the app element only contains a single element.
     */
    left: number;
    /**
     * The rotation of the element, in degrees.
     *
     * @remarks
     * This must be an integer between -180 and 180.
     */
    rotation?: number;
} & TextAttributes;

/**
 * @public
 * An element that renders a video from a media reference (ref) returned from Content capability.
 */
export declare type NativeVideoElement = {
    /**
     * The type of element.
     */
    type: 'VIDEO';
    /**
     * A media reference of a video that is previously imported using Content capability.
     */
    ref: VideoRef;
};

/**
 * @public
 * An element that renders a video from a media reference (ref) returned from Content capability.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions
 * of the element.
 * It will be positioned and sized relative to its parent container.
 * The parent container may be an app element, or the current page.
 */
export declare type NativeVideoElementWithBox = NativeVideoElement & Box;

/**
 * The types of object primitive values that can be stored within an app element's data.
 */
declare type ObjectPrimitive = Boolean | String;

/**
 * @public
 * Page context
 */
export declare type PageContext = {
    /**
     * Page dimensions in px
     *
     * @remarks
     * This value is undefined for Whiteboard and Docs
     */
    dimensions: PageDimensions | undefined;
};

/**
 * @public
 * Page Dimensions
 */
declare type PageDimensions = {
    width: number;
    height: number;
};

/**
 * @public
 * The outline of a path.
 */
export declare type PathStroke = {
    /**
     * The weight of the stroke. This must be an integer between 0 and 100.
     */
    weight: number;
    /**
     * The color of the stroke as a hex code.
     *
     * @remarks
     * The hex code must include all six characters and be prefixed with a # symbol (e.g. #ff0099).
     */
    color: string;
    /**
     * The alignment of the stroke. The only supported value is 'inset'.
     */
    strokeAlign: 'inset';
};

/**
 * @public
 * The dimensions, position, and rotation of an element.
 */
export declare type Placement = Position & (WidthAndHeight | Width | Height);

declare type Position = {
    /**
     * The distance from the top edge of the container.
     *
     * @remarks
     * This must be an integer between -32768 and 32767. This property doesn't
     * have any effect if the app element only contains a single element.
     */
    top: number;
    /**
     * The distance from the left edge of the container.
     *
     * @remarks
     * This must be an integer between -32768 and 32767. This property doesn't
     * have any effect if the app element only contains a single element.
     */
    left: number;
    /**
     * The rotation of the box, in degrees.
     *
     * @remarks
     * This must be an integer between -180 and 180.
     */
    rotation?: number;
};

/**
 * The types of primitive values that can be stored within an app element's data.
 *
 * @remarks
 * All types of primitives are supported except for symbols.
 */
declare type Primitive = undefined | null | number | boolean | string | bigint;

/**
 * @public
 * A path that defines the shape of a shape element.
 */
export declare type ShapePath = {
    /**
     * The shape of the path.
     *
     * @remarks
     * This accepts the same value as the `d` attribute of the SVG <path> element,
     * with some limitations.
     *
     * The path must:
     *
     * - start with an M command
     * - not have more than one M command
     * - not use the Q command
     * - be closed, either with a Z command at the end or by having the last
     * coordinate match the first coordinate
     */
    d: string;
    /**
     * The appearance of the path's interior.
     */
    fill: Fill;
    /**
     * The outline of the path.
     */
    stroke?: PathStroke;
};

/**
 * @public
 * Properties for configuring the scale and cropping of a shape.
 *
 * @remarks
 * This is similar to the `viewBox` attribute of the <svg> element.
 */
export declare type ShapeViewBox = {
    /**
     * The distance of the shape from the top edge of the element.
     */
    top: number;
    /**
     * The distance of the shape from the left edge of the element.
     */
    left: number;
    /**
     * The width of the view box.
     */
    width: number;
    /**
     * The height of the view box.
     */
    height: number;
};

/**
 * @public
 * Attributes for changing the appearance of text.
 */
declare type TextAttributes = {
    /**
     * The size of the text.
     *
     * @remarks
     * The default value is 16. This must be an integer between 1 and 1000.
     * This property will be ignored when adding native text elements without specifying placement.
     */
    fontSize?: number;
    /**
     * The alignment of the text. The default value is 'start'.
     */
    textAlign?: 'start' | 'center' | 'end';
    /**
     * The color of the text as a hex code.
     *
     * @remarks
     * The hex code must include all six characters and be prefixed with a # symbol
     * (e.g. #ff0099). The default value is #000000.
     */
    color?: string;
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
 * The types of values that can be stored within an app element's data.
 */
export declare type Value = Primitive | ObjectPrimitive | Value[] | {
    [key: string]: Value;
} | Map<Value, Value> | Set<Value>;

/**
 * @public
 * The media reference – a unique video identifier that Canva recognizes.
 */
declare type VideoRef = string & {
    __videoRef: never;
};

declare type Width = {
    width: number;
    height: 'auto';
};

declare type WidthAndHeight = {
    /**
     * The width of the box. If height is a number, this can be set to "auto".
     * Otherwise, it must be an integer between 0 and 32767.
     */
    width: number;
    /**
     * The height of the box. If width is a number, this can be set to "auto".
     * Otherwise, it must be an integer between 0 and 32767.
     */
    height: number;
};

export { }
