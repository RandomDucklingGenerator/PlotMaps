import { Cluster } from "./cluster";
import { Plot } from "./plot";

export type PlotData = {
    points: Plot[];
    clusters: Cluster[];
    message: string
  }
  