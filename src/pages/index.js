import React,{Component} from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf'
import './map.css'

class Map extends Component{
    loadMap=async()=>{
        var map = L.map('map', {
            center:[38.599677479644754, -101.59800649761495],
            zoom: 5})
        //Addding goggle basemap
        L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 19,
            subdomains:['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(map);
        //Loading Radar data conus_cref_raw does not exist so used conus_cref_qcd instead
        let radarLayer=L.tileLayer.wms("https://opengeo.ncep.noaa.gov/geoserver/conus/conus_cref_qcd/ows", {
            layers: 'conus_cref_qcd',
            format: 'image/png',
            transparent: true,
            version: '1.3.0',
        }).addTo(map)
        //Loading warnings data as geosjon
        let warningData=await fetch('https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NWS_Watches_Warnings_v1/FeatureServer/6/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=')
        warningData=await warningData.json()
        function warningStyle(feature) {
            return {
                fillColor: 'red',
                weight: 2,
                opacity: 1,
                color: 'red',  //Outline color
                fillOpacity: 0.7
            };
        }
        let warningLayer=L.geoJSON(warningData,{style:warningStyle}).addTo(map)
        //Loading county data as geojson
        let countyData=await fetch('https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NWS_Watches_Warnings_v1/FeatureServer/3/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=')
        countyData=await countyData.json()
        
        let countyLayer=L.geoJSON(countyData,{
            onEachFeature: function (feature, layer) {
                layer.on('click', function (e) {

                    let intersectList=[]
                    //destroy any old popups that might be attached
                    if (layer._popup !== undefined) {
                        layer.unbindPopup();
                    }
                    //Iterate over warning data
                    turf.featureEach(warningData, function (currentFeature, featureIndex) {
                        //checks intersection between county feature and warning layer features
                        if(turf.booleanIntersects(currentFeature, e.target.feature))
                        {
                            intersectList.push(currentFeature.properties.Event)
                        }
                        });
                    let itemData=[...new Set(intersectList)].join(',')
                    //close popup if already opened
                    layer.closePopup();
                    //bind popup
                    layer.bindPopup(
                        `<div id="detail-content">
                        <h4>Weather Warnings for ${e.target.feature.properties.Name}</h4>
                        <hr>
                            ${itemData}
                        </div>
                    `
                    )
                    //open popup
                    layer.openPopup();
                });
            
        }}).addTo(map)
        var overlayMaps = {
            '<b>Counties</b>': countyLayer,
            '<b>Warnings</b>':warningLayer,    
            '<b>Radar Data</b>': radarLayer,
        };
        var controls=L.control.layers(null, overlayMaps)
        controls.addTo(map);
    }
   
    componentDidMount(){
        this.loadMap()
    }
    render(){
        return(
            <div id='map'>
            </div>
        )
    }
}


export default Map;