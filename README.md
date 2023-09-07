# Installation and setup
You will need node and npm installed globally on your machine.
**Installation:**
npm install
**To Start Server:**
npm start

# About the app

Radar layer mentioned (**conus_cref_raw**) in the challenge was not available on the server, So I have used another (**conus_cref_qcd**) WMS from the same server. Links are below:

**Available:** https://opengeo.ncep.noaa.gov/geoserver/conus/conus_cref_qcd/ows?service=wms&version=1.3.0&request=GetCapabilities
**Not available:** https://opengeo.ncep.noaa.gov/geoserver/conus/conus_cref_raw/ows?service=wms&version=1.3.0&request=GetCapabilities

**Layers present**

    a. Radar Data: https://opengeo.ncep.noaa.gov/geoserver/conus/conus_cref_qcd/ows?service=wms&version=1.3.0&request=GetCapabilities
    b. County Boundary: https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NWS_Watches_Warnings_v1/FeatureServer/3
    c. Warning Layer: https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NWS_Watches_Warnings_v1/FeatureServer/6
        