export class UIConfiguration {
    endpoints: {
        imsEndpoint: string;
        terminologyServerEndpoint: string;
        collectorEndpoint: string;
    };
    features: {
        mrcmmtEditableBranches: string;
    }

    constructor(imsEndpoint, terminologyServerEndpoint, collectorEndpoint, mrcmmtEditableBranches) {
        this.endpoints = {
            imsEndpoint: imsEndpoint,
            terminologyServerEndpoint: terminologyServerEndpoint,
            collectorEndpoint: collectorEndpoint
        };
        this.features = {
            mrcmmtEditableBranches: mrcmmtEditableBranches
        };
    }
}
