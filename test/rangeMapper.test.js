import {describe, it} from 'mocha';
import {expect, assert} from 'chai';

import RangeMapper from '../src/Polygonmap/utils/rangeMapper';

describe('rangeMapper', () => {
    describe('check returned colorMap', () => {
        it('should return array', () => {
            const rangeMapper = new RangeMapper(10, 154, 'cdom', 'rgbaString', 1);
            const expected = rangeMapper.getColorMap();
            assert.typeOf(expected, 'Array');
        });

        it('should return array of 10 elements', () => {
            const rangeMapper = new RangeMapper(10, 154, 'cdom', 'rgbaString', 1);
            const expected = rangeMapper.getColorMap();
            assert.lengthOf(expected, 10);
        });
    });

    describe('check returned color type', () => {
        it('should return rgba', () => {
            const rangeMapper = new RangeMapper(10, 154, 'cdom', 'rgbaString', 1);
            const color = rangeMapper.getColor(94);
            const expected = new RegExp('rgba').test(color);
            assert.equal(expected, true);
        });
        it('should return hex', () => {
            const rangeMapper = new RangeMapper(10, 154, 'cdom', 'hex', 1);
            const color = rangeMapper.getColor(94);
            const expected = new RegExp('#').test(color);
            assert.equal(expected, true);
        });
    });

    describe('check returned color value', () => {
        it('should return rgba(47,15,62,1)', () => {
            const rangeMapper = new RangeMapper(10, 154, 'cdom', 'rgbaString', 1);
            const expected = 'rgba(47,15,62,1)';
            const result = rangeMapper.getColor(94);
            expect(result).to.be.equal(expected);
        });

        it('should return correct alpha channel value', () => {
            const rangeMapper = new RangeMapper(10, 154, 'cdom', 'rba', 0.7);
            const expected = 0.7;
            const result = rangeMapper.getColor(94);
            expect(result[3]).to.be.equal(expected);
        });

        it('should return #2f0f3e', () => {
            const rangeMapper = new RangeMapper(10, 154, 'cdom', 'hex', 1);
            const expected = '#2f0f3e';
            const result = rangeMapper.getColor(94);
            expect(result).to.be.equal(expected);
        });
    });
});
