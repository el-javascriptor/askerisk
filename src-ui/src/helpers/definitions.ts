export type ParseStatus = "TEXT" | "THOUGHT" | "TOOL";
export type ContinuityStatus = "COMPLETE" | "PENDING";

// this type will need to be updated to use the CJF (Chat JSON Format)
// TODO: Needs new CJF format
export interface Chat {
    role: "user" | "assistant";
    content: string;
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
