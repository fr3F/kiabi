import { CLSHierrarchy } from "../../../models/cls-hierrarchy.model";

/** Flat node with expandable and level information */
export interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  value: string;
  type: string;
}
