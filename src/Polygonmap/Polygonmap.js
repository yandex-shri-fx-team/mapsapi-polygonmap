import normalizeFeature from './utils/normalizeFeature';
import defaultMapper from './utils/defaultMapper';
import defaultOnMouseEnter from './utils/defaultOnMouseEnter';
import defaultOnMouseLeave from './utils/defaultOnMouseLeave';
import defaultBalloonContent from './utils/defaultBalloonContent';
import inside from './utils/inside';
import Colorize from './utils/colorize/index';
import OptionsManager from './utils/optionsManager/index';

/**
 * Polygonmap module.
 *
 * @module Polygonmap
 * @requires option.Manager
 * @requires ObjectManager
 */
ymaps.modules.define('Polygonmap', [
    'meta',
    'ObjectManager'
], (provide, meta, ObjectManager) => {
    class Polygonmap {
        /**
         * @param {Object} [data] Polygons and points.
         *  {Object} data.polygons GeoJSON FeatureCollections.
         *  {Object} data.points GeoJSON FeatureCollections.
         * @param {Object} [options] Options for customization.
         */
        constructor(data, options) {
            const defaultOptions = {
                mapper: defaultMapper,
                color: {
                    rangesCount: 10,
                    colormap: 'cdom',
                    format: 'rgbaString',
                    alpha: 0.7
                },
                onMouseEnter: defaultOnMouseEnter,
                onMouseLeave: defaultOnMouseLeave,
                balloonContent: defaultBalloonContent
            };

            this.options = new OptionsManager(defaultOptions, options);

            const mapper = this.options.get('mapper');
            this.options.set('mapper', mapper.bind(this));
            this.setData(data);
        }

        /**
         * Get the data, polygons and points.
         *
         * @public
         * @returns {Object} Polygons and points.
         */
        getData() {
            return this._data || null;
        }

        /**
         * Set the data, polygons and points.
         *
         * @public
         * @param {Object} data Polygons and points.
         *  {Object} data.polygons GeoJSON FeatureCollections.
         *  {Object} data.points GeoJSON FeatureCollections.
         * @returns {Polygonmap} Self-reference.
         */
        setData(data) {
            this._data = data;

            if (data) {
                this._data = {
                    points: {type: 'FeatureCollection', features: []},
                    polygons: {type: 'FeatureCollection', features: []}
                };
                this._prepare(data);
            }

            return this;
        }

        /**
         * Get the Map instance.
         *
         * @public
         * @returns {Map} Reference to Map instance.
         */
        getMap() {
            return this._map;
        }

        /**
         * Set Map instance to render Polygonmap object.
         *
         * @public
         * @param {Map} map Map instance.
         * @returns {Heatmap} Self-reference.
         */
        setMap(map) {
            if (this._map !== map) {
                this._map = map;

                if (map && this._data) {
                    this._render();
                }
            }

            return this;
        }

        /**
         * Destructs Polygonmap instance.
         *
         * @public
         */
        destroy() {
            this.setData(null);
            this.setMap(null);
        }

        /**
         * Prepare for render Polygonmap.
         *
         * @private
         * @param {Object} data Polygons and points.
         *  {Object} data.polygons GeoJSON FeatureCollections.
         *  {Object} data.points GeoJSON FeatureCollections.
         * @returns {undefined}
         */
        _prepare(data) {
            const polygonFeatures = data.polygons.features;
            let pointFeatures = data.points.features;
            let pointsCountMaximum = 0;

            if (
                data.polygons.type === 'FeatureCollection' &&
                data.points.type === 'FeatureCollection'
            ) {
                for (let i = 0; i < polygonFeatures.length; i++) {
                    const restPointFeatures = [];
                    const polygonFeature = normalizeFeature(polygonFeatures[i], meta, {id: i});

                    let pointsCount = 0;

                    for (let j = 0; j < pointFeatures.length; j++) {
                        let pointFeature;

                        if (i === 0) {
                            pointFeature = normalizeFeature(pointFeatures[j], meta, {id: j});
                            this._data.points.features.push(pointFeature);
                        } else {
                            pointFeature = pointFeatures[j];
                        }

                        if (inside(polygonFeature.geometry, pointFeature.geometry)) {
                            pointsCount++;
                        } else {
                            restPointFeatures.push(pointFeature);
                        }
                    }

                    pointFeatures = restPointFeatures;

                    if (pointsCount > pointsCountMaximum) {
                        pointsCountMaximum = pointsCount;
                    }

                    polygonFeature.properties = polygonFeature.properties || {};
                    polygonFeature.properties.pointsCount = pointsCount;

                    this._data.polygons.features.push(polygonFeature);
                }
            }

            this.pointsCountMaximum = pointsCountMaximum;
        }

        /**
         * Render Polygonmap.
         *
         * @private
         */
        _render() {
            const mapper = this.options.get('mapper');

            this.colorize = new Colorize(this.pointsCountMaximum, this.options.get('color'));

            this._data.polygons.features = this._data.polygons.features.map(mapper);

            this.polygons = new ObjectManager();
            this.polygons.add(this._data.polygons);

            this._initInteractivity(this.polygons);

            this._map.geoObjects.add(this.polygons);
        }

        _initInteractivity(objectManager) {
            const balloon = new ymaps.Balloon(this._map);
            const onMouseEnter = this.options.get('onMouseEnter');
            const onMouseLeave = this.options.get('onMouseLeave');

            objectManager.events.add('mouseenter', (e) => {
                onMouseEnter(objectManager, e);
            });

            objectManager.events.add('mouseleave', (e) => {
                onMouseLeave(objectManager, e);
            });

            balloon.options.setParent(this._map.options);

            objectManager.events.add('click', (e) => {
                const objId = e.get('objectId');
                const object = objectManager.objects.getById(objId);
                const balloonContent = this.options.get('balloonContent');

                balloon.setData({
                    content: balloonContent(object)
                });

                balloon.open(e.get('coords'));
            });
        }
    }

    provide(Polygonmap);
});
