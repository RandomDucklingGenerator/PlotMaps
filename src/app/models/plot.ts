export type Plot = {
  id: string;
  siteID: string;
  url: string;
  timeStampUnix: number;
  priceM2: number;
  areaM2: number;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  price: number;
  heatvalue?: number;
  invalidSetDate: number;
  isActive: boolean;
  density: number;
  type: number;
  scrappedDate: Date;
}
