import Colormap from 'colormap';

class RangeMapper {
    /**
     * @param {*} rangesCount count of ranges
     * @param {*} maxPointsCount max points
     * @param {*} colormap type of colormap
     */
    constructor(rangesCount, maxPointsCount, colormap = 'cdom') {
        this._rangesCount = rangesCount;
        this._maxPointsCount = maxPointsCount;
        this._colors = Colormap({
            colormap: colormap,
            nshades: this._rangesCount,
            format: 'hex',
            alpha: 1
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
