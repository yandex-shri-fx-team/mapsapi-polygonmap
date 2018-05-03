import Colormap from 'colormap';

class RangeMapper {
    /**
     * @param {Number} rangesCount count of ranges
     * @param {Number} maxPointsCount max points
     * @param {String} colormap type of colormap
     * @param {String} format hex || rgbaString
     * @param {Number|Array} alpha alpha chanel
     */
    constructor(rangesCount = 10, maxPointsCount, colormap = 'cdom', format = 'rgbaString', alpha = 0.7) {
        this._rangesCount = rangesCount;

        if (maxPointsCount && typeof maxPointsCount === 'number' && maxPointsCount > 0) {
            this._maxPointsCount = maxPointsCount;
        } else {
            throw new Error('Wrong "maxPointsCount" value');
        }

        this._colors = Colormap({
            colormap: colormap,
            nshades: this._rangesCount,
            format: format,
            alpha: alpha
        }).reverse();

        this._ranges = this._createRangesArray();
    }

    _createRangesArray() {
        const arr = [];

        for (let i = 0; i < parseInt(this._maxPointsCount / this._rangesCount, 10); i++) {
            arr.push(i * this._rangesCount);
        }

        arr.push(this._maxPointsCount + 1);

        return arr;
    }

    getColorMap() {
        return this._colors;
    }

    getColor(pointsCount) {
        let color = '';

        for (let i = 0; i <= this._ranges.length; i++) {
            if (pointsCount >= this._ranges[i] && pointsCount < this._ranges[i + 1]) {
                color = this._colors[i];
            }
        }

        return color;
    }
}

export default RangeMapper;
