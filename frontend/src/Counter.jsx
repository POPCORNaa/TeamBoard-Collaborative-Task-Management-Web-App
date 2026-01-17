import { useState } from "react";

export default function Counter({ initial = 0, step = 1, min, max }) {
    const [value, setValue] = useState(initial);

    const canIncrease = max === undefined ? true : value + step <= max;
    const canDecrease = min === undefined ? true : value - step >= min;

    return (
        <div>
        <h1 aria-live="polite" aria-atomic="true">
        Count: <span data-testid="count">{value}</span>
        </h1>
        <button onClick={() => canDecrease && setValue((v) => v - step)} disabled={!canDecrease}>
        Decrease
        </button>
        <button onClick={() => canIncrease && setValue((v) => v + step)} disabled={!canIncrease}>
        Increase
        </button>
        </div>
    );
}
