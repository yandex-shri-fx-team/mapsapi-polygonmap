import extend from 'extend';

/**
 * Options manager.
 * Calls to define additional options by default, and also has methods for setting and getting options.
 */
export default class OptionsManager {
    /**
     *
     * @param {object} defaultOptions - Default options
     * @param {object} userOptions - Custom user options
     */
    constructor(defaultOptions, userOptions) {
        const assign = extend(true, {}, defaultOptions, userOptions);

        //todo у меня версия node - 6, тесты валятся без полифила. оставить или грохнуть?
        if (!Object.entries) {
            Object.entries = function (obj) {
                const ownProps = Object.keys(obj);
                let i = ownProps.length;
                const resArray = new Array(i);

                while (i--)
                    resArray[i] = [ownProps[i], obj[ownProps[i]]];
                return resArray;
            };
        }

        this._options = new Map(Object.entries(assign));
    }

    /**
     * Get option.
     * You can get option as: value or value.value
     * @param {string} value - name of option
     * @returns {string|number|object|array} value of option
     */
    get(value) {
        const arr = value.split('.');
        if (arr.length > 1) {
            let entry = this._options.get(arr[0]);

            for (let i = 1, item; item = arr[i++];) {
                entry = entry[item];
            }
            return entry;
        } else {
            return this._options.get(value);
        }
    }

    /**
     * Set option.
     * You can set option as: set(key, value) and set({key: "value"} or set(key.key, value))
     * @param {string|object} key - name of new option or object with options
     * @param {string|object|array} value - value of new option
     */
    set(key, value) {
        if (typeof key === 'object') {
            //todo важно ли нам глубокое копирование объектов?
            for (const value in key) {
                this._options.set(value, key[value]);
            }
        } else {
            const arr = key.split('.');

            if (arr.length > 1) {
                const last = arr.pop();
                const object = {};
                let entry = object;

                for (let i = 0, item; item = arr[i++];) {
                    entry[item] = {};
                    entry = entry[item];
                }
                entry[last] = value;

                this.set(object);
            } else {
                this._options.set(arr[0], value);
            }
        }
    }

    /**
     * Get all options
     * @returns {Map} return all options
     */
    get options() {
        return this._options;
    }
}
