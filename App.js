import React from 'react';
import {Text} from 'react-native';
import {
    DCVBarcodeReader,
    DCVCameraView,
    EnumBarcodeFormat,
    EnumBarcodeFormat_2
} from 'dynamsoft-capture-vision-react-native';

class App extends React.Component {
	state = {
        results: null
    };
	async componentWillUnmount() {
        // Stop the barcode decoding thread when your component is unmount.
        await this.reader.stopScanning();
        // Remove the result listener when your component is unmount.
        this.reader.removeAllResultListeners();
    }

    componentDidMount() {
        (async () => {
            // Initialize the license so that you can use full feature of the Barcode Reader module.
            try {
                await DCVBarcodeReader.initLicense("DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTEwMTIwMDkzNiIsIm9yZ2FuaXphdGlvbklEIjoiMjAwMDAxIn0=");
            } catch (e) {
                console.log(e);
            }
            // Create a barcode reader instance.
            this.reader = await DCVBarcodeReader.createInstance();

            // let settings = await this.reader.getRuntimeSettings();

            // // Set the expected barcode count to 0 when you are not sure how many barcodes you are scanning.
            // // Set the expected barcode count to 1 can maximize the barcode decoding speed.
            // settings.expectedBarcodesCount = 0;

            // // Set the barcode format to read.
            // settings.barcodeFormatIds = EnumBarcodeFormat.BF_NULL;
            // //EnumBarcodeFormat.BF_ONED |
            // //EnumBarcodeFormat.BF_QR_CODE |
            // //EnumBarcodeFormat.BF_PDF417 |
            // //EnumBarcodeFormat.BF_DATAMATRIX;

            // settings.barcodeFormatIds_2 = EnumBarcodeFormat_2.BF2_DOTCODE;

            // // Apply the new runtime settings to the barcode reader.
            // await this.reader.updateRuntimeSettings(settings);
            // settings.region.regionMeasuredByPercentage = 1;
            // settings.region.regionLeft = 25;
            // settings.region.regionTop = 25;
            // settings.region.regionRight = 75;
            // settings.region.regionBottom = 75;
            let template_json_str = "{\"ImageParameterContentArray\":[{\"Name\":\"read-dotcode\",\"ExpectedBarcodesCount\":0,\"BarcodeFormatIds\":[\"BF_NULL\"],\"BarcodeFormatIds_2\":[\"BF2_DOTCODE\"],\"LocalizationModes\":[\"LM_STATISTICS_MARKS\"],\"BinarizationModes\":[{\"BlockSizeX\":11,\"BlockSizeY\":11,\"EnableFillBinaryVacancy\":0,\"Mode\":\"BM_LOCAL_BLOCK\",\"ThresholdCompensation\":30}],\"GrayscaleTransformationModes\":[{\"Mode\":\"GTM_INVERTED\"}],\"ScaleUpModes\":[{\"Mode\":\"SUM_LINEAR_INTERPOLATION\",\"ModuleSizeThreshold\":4,\"TargetModuleSize\":8}],\"DeblurLevel\":9,\"Timeout\":10000}],\"CaptureVisionTemplates\":[{\"Name\":\"CV_0\",\"ImageROIProcessingNameArray\":[\"TA_0\"]}],\"TargetROIDefOptions\":[{\"Name\":\"TA_0\",\"Location\":{\"Offset\":{\"ReferenceObjectOriginIndex\":0,\"ReferenceObjectSizeType\":\"default\",\"MeasuredByPercentage\":1,\"FirstPoint\":[10,10],\"SecondPoint\":[90,10],\"ThirdPoint\":[90,90],\"FourthPoint\":[10,90]}},\"TaskSettingNameArray\":[\"BR_0\"]}],\"BarcodeReaderTaskSettingOptions\":[{\"Name\":\"BR_0\"}]}";

			await this.reader.updateRuntimeSettings(template_json_str);

            // Add a result listener. The result listener will handle callback when barcode result is returned. 
            this.reader.addResultListener((results) => {
                // Update the newly detected barcode results to the state.
                this.setState({results});
            });

            // Enable video barcode scanning.
            // If the camera is opened, the barcode reader will start the barcode decoding thread when you triggered the startScanning.
            // The barcode reader will scan the barcodes continuously before you trigger stopScanning.
            this.reader.startScanning();
        })();
    }

    render() {
        // Add code to fetch barcode text and format from the BarcodeResult
        let results = this.state.results;
        let resultBoxText = "";
        if (results && results.length>0){
            for (let i=0;i<results.length;i++){
                resultBoxText+=results[i].barcodeFormatString+"\n"+results[i].barcodeText+"\n";
            }
        }
        // Render DCVCameraView componment.
        return (
            <DCVCameraView
                style={
                    {
                        flex: 1
                    }
                }
                ref = {(ref)=>{this.scanner = ref}}
                overlayVisible={true}
            >
                {/*Add a text box to display the barcode result.*/}
                <Text style={
                    {
                        flex: 0.9,
                        marginTop: 100,
                        textAlign: "center",
                        color: "white",
                        fontSize: 18,
                    }
                }>{results && results.length > 0 ? resultBoxText : "No Barcode Detected"}</Text>
            </DCVCameraView>
        );
    }
}

export default App;

