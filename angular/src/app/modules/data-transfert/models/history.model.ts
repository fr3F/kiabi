import { HistoryStatus } from "../data";

export interface DataHistory{
    id: string;
    folder: string;
    designation: string;
    status: HistoryStatus;
}