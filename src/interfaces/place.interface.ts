export interface IPlace {
    name: string;
    address: string;
    description: string;
    coords: ICoordinate;
    tags: string[];
    brandUrl: string;
    backgroundUrl: string;
    bannerUrls: string[];
    markerUrl: string;
}

export interface ICoordinate {
    latitude: string;
    lonigitude: string;
}