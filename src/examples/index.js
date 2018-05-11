import './../Polygonmap/Polygonmap';
import points from './data/bikeparking-moscow.geojson';
import polygons from './data/moscow-mo.geojson';

ymaps.ready(() => {
    // eslint-disable-next-line no-unused-vars
    const myMap = new ymaps.Map('map', {
        center: [37.64, 55.76],
        zoom: 10,
        controls: ['zoomControl', 'typeSelector']
    });

    ymaps.modules.require(['Polygonmap'], (Polygonmap) => {
        const polygonmap = new Polygonmap({polygons, points}, {
            color: {
                colormap: 'summer'
            }
        });
        polygonmap.setMap(myMap);
    });
});
