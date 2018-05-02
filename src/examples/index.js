import './../Polygonmap/Polygonmap';
import points from './data/bikeparking-moscow.geojson';
import polygons from './data/moscow-mo.geojson';
import RangeMapper from '../Polygonmap/utils/rangeMapper';

ymaps.ready(() => {
    // eslint-disable-next-line no-unused-vars
    const myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10,
        controls: ['zoomControl', 'typeSelector']
    });

    ymaps.modules.require(['Polygonmap'], (Polygonmap) => {
        const polygonmap = new Polygonmap({polygons, points});

        const rangeMapper = new RangeMapper(10, polygonmap.getData().pointsCountMaximum);
        
        polygonmap.options.set('mapper', (feature) => {
            const pointsCount = feature.properties.pointsCount;

            feature.options = { fillColor: rangeMapper.getColor(pointsCount) };

            return feature;
        });

        polygonmap.setMap(myMap);
    });
});
