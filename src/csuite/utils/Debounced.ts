import { makeAutoObservable } from 'mobx'

export class Debounced<T> {
    constructor(
        //
        private _value: T,
        public delay: number = 700 /* ms */,
        public onChange?: (value: T) => void,
    ) {
        makeAutoObservable(this)
    }

    private _debouncedValue: T = this._value
    get debouncedValue(): T {
        return this._debouncedValue
    }

    get value(): T { return this._value; } // prettier-ignore
    set value(v: T) {
        this._value = v
        this.setDebouncedValue(v)
    }

    _timer: any = null
    setDebouncedValue = (v: T) => {
        clearTimeout(this._timer)
        this._timer = setTimeout(() => {
            const oldVal = this._debouncedValue
            this._debouncedValue = this._value
            if (oldVal !== this._debouncedValue) this.onChange?.(this._debouncedValue)
        }, 300)
    }

    /** reset _value, _deouncedValue, clear timer, and do not call onChange */
    resetTo = (v: T) => {
        clearTimeout(this._timer)
        this._value = v
        this._debouncedValue = v
    }
}
