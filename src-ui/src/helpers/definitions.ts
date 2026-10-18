export type ParseStatus = "TEXT" | "THOUGHT" | "TOOL";
export type ContinuityStatus = "COMPLETE" | "PENDING";

// this type will need to be updated to use the CJF (Chat JSON Format)
// TODO: Needs new CJF format
export interface Chat {
    role: "user" | "assistant";
    content: DataBundle[];
}

// a small piece of chat (text, thought, tools, etc)
export interface ChatFragment {
    content: string;
    type: ParseStatus;
    info: string; // this would contain the name of the tool;
    status: ContinuityStatus;
}

// just holds a coordinate
export interface PositionType {
    x: number;
    y: number;
}

// holds a coordinate and the cursor type (i-beam for text, block for commmand)
export interface CursorProps extends PositionType {
    commandMode: boolean;
    visible: boolean;
}

// The following types are related to what we receive from the backend
// during the stream. This is the new CJF (Bundle) format.
export interface ToolBundle {
    type: "tool";
    name: string;
    arguments: string;
    result: string;
}

export interface EventBundle {
    type: "event";
    status: "success" | "error";
    content: string;
}

export interface TokenBundle {
    type: "token";
    content: string
}

export type DataBundle = ToolBundle | EventBundle | TokenBundle;
