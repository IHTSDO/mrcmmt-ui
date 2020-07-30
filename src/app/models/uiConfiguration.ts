export class UIConfiguration {
    endpoints: {
        imsEndpoint: string;
        terminologyServerEndpoint: string;
        collectorEndpoint: string;
    };

    constructor(imsEndpoint, terminologyServerEndpoint, collectorEndpoint) {
        this.endpoints = {
            imsEndpoint: imsEndpoint,
            terminologyServerEndpoint: terminologyServerEndpoint,
            collectorEndpoint: collectorEndpoint
        };
    }
}
