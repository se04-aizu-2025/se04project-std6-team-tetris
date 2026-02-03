import { useState, useRef } from "react";
import "./App.css";
import SortList from "./components/sort-select/SortList";
import SortVisualizer from "./components/SortVisualizer";
import { SORT_DESCRIPTIONS } from "./data/sortDescriptions";
import { sortAlgorithms } from "./utils/sortAlgorithms";

const MAX_ARRAY_LENGTH = 20;
const MIN_VALUE = 1;
const MAX_VALUE = 100;

function App() {
  const [test, setTest] = useState([]);
  const [mode, setMode] = useState();
  const [selectedSort, setSelectedSort] = useState("bubble");
  const [count, setCount] = useState(0);
  const [selfInputs, setSelfInputs] = useState([]);
  const [sortJson, setSortJson] = useState(null);
  const totallSortingNumber = useRef(null);
  const inputsRef = useRef([]);
  const skipNextBlurRef = useRef(false);

  const getNFromTotalInput = () => Number(totallSortingNumber.current?.value ?? "");

  const validateNumber = (raw) => {
    if (raw === "" || raw == null) return { ok: true, value: "" }; 
    const n = Number(raw);
    if (!Number.isFinite(n)) return { ok: false, value: null };
    if (n < MIN_VALUE || n > MAX_VALUE) return { ok: false, value: null };
    return { ok: true, value: n };
  };

  const validateAndCommit = (i, rawValue) => {
    const result = validateNumber(rawValue);

    if (!result.ok) {
      alert(`Value must be between ${MIN_VALUE} and ${MAX_VALUE}.`);

      const el = inputsRef.current[i];
      if (el) {
        const prev = selfInputs[i] ?? "";
        el.value = prev;
        el.focus();
        el.select?.();
      }
      return false;
    }

    setSelfInputs((prev) => {
      const next = [...prev];
      next[i] = result.value;
      return next;
    });

    return true;
  };

  const numberAutoCreating = () => {
    const n = getNFromTotalInput();
    if (!n || n <= 0 || n > MAX_ARRAY_LENGTH) {
      alert(`Please enter a number between 1 and ${MAX_ARRAY_LENGTH}.`);
      return;
    }

    const tmp = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);

    setTest(tmp);
    setSortJson(null);
    if (totallSortingNumber.current) totallSortingNumber.current.value = "";
  };

  const numberSelfCreating = () => {
    const n = getNFromTotalInput();
    if (!n || n <= 0 || n > MAX_ARRAY_LENGTH) {
      alert(`Please enter a number between 1 and ${MAX_ARRAY_LENGTH}.`);
      return;
    }

    setCount(n);
    setSelfInputs(Array(n).fill(""));
    setTest([]);
    setSortJson(null);

    if (totallSortingNumber.current) totallSortingNumber.current.value = "";
  };

  const numberSelfReset = () => {
    setCount(0);
    setSelfInputs([]);
    setTest([]);
    setSortJson(null);
    inputsRef.current = [];
  };

  const handleChange = (index, value) => {
    const v = value.replace(/[^\d]/g, "");

    setSelfInputs((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };

  const handleKeyDown = (e, index) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    skipNextBlurRef.current = true;
    const ok = validateAndCommit(index, e.currentTarget.value);
    if (!ok) return;

    const next = inputsRef.current[index + 1];
    if (next) next.focus();
  };

  const saveSelfInputsToTest = () => {
    for (let i = 0; i < count; i++) {
      const raw = selfInputs[i] ?? "";
      const ok = validateAndCommit(i, raw);
      if (!ok) return;
    }

    const arr = selfInputs
      .map((v) => (v === "" ? NaN : Number(v)))
      .filter((n) => Number.isFinite(n) && n >= MIN_VALUE && n <= MAX_VALUE);

    if (arr.length === 0) {
      alert("Please enter at least one valid number.");
      return;
    }

    if (arr.length > MAX_ARRAY_LENGTH) {
      alert(`The array size is too large (maximum ${MAX_ARRAY_LENGTH}).`);
      return;
    }

    setTest(arr);
    setSortJson(null);
  };

  const handleGenerateSortLog = () => {
    if (test.length === 0) {
      alert("Please enter numbers to sort.");
      return null;
    }

    if (test.length > MAX_ARRAY_LENGTH) {
      alert(`The array size is too large (maximum ${MAX_ARRAY_LENGTH}).`);
      return null;
    }

    const sortFunction = sortAlgorithms[selectedSort];
    if (!sortFunction) {
      alert(`The sorting algorithm "${selectedSort}" was not found.`);
      return null;
    }

    try {
      const result = sortFunction(test);
      setSortJson(result);
      return result;
    } catch (error) {
      console.error("Sort error:", error);
      alert("An error occurred while executing the sort: " + error.message);
      return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header pixel-hero">
        <div className="app-container app-header__inner">
          <div className="app-header__left">
            <div className="app-header__title">Sort Visualizer</div>
            <div className="app-header__subtitle">
              Learn sorting algorithms through interactive visualization
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-container">
          <div className="sorting-number">
            <h1>Enter sorting numbers</h1>

            <p>
              <label>
                <input
                  type="radio"
                  name="sorting-number"
                  checked={mode === "self"}
                  onChange={() => setMode("self")}
                />
                Manual input
              </label>
              <label>
                <input
                  type="radio"
                  name="sorting-number"
                  checked={mode === "auto"}
                  onChange={() => setMode("auto")}
                />
                Auto generate
              </label>
            </p>

            {mode === "auto" && (
              <div>
                <p className="elements-label">
                  Type the number of elements <span>(1–20)</span>
                </p>

                <div className="elements-control">
                  <input
                    type="number"
                    ref={totallSortingNumber}
                    min="1"
                    max="20"
                    placeholder="e.g. 10"
                    className="elements-input"
                  />

                  <div className="elements-buttons">
                    <button onClick={numberAutoCreating} className="primary-button">
                      CREATE
                    </button>
                  </div>
                </div>

                {test.length > 0 && (
                  <>
                    <ul className="number-list">
                      {test.map((num, idx) => (
                        <li key={idx}>{num}</li>
                      ))}
                    </ul>
                    <div>Total: {test.length}</div>
                  </>
                )}
              </div>
            )}

            {mode === "self" && (
              <div>
                  <p className="elements-label">
                    Type the number of elements <span>(1–20)</span>
                  </p>

                  <div className="elements-control">
                    <input
                      type="number"
                      ref={totallSortingNumber}
                      min="1"
                      max="20"
                      placeholder="e.g. 5"
                      className="elements-input"
                    />

                    <div className="elements-buttons">
                      <button onClick={numberSelfCreating} className="primary-button">
                        SET
                      </button>
                      <button onClick={numberSelfReset} className="secondary-button">
                        RESET
                      </button>
                    </div>
                  </div>

                  <p className="elements-hint">
                    * Each value must be between 1 and 100.
                  </p>
                {count > 0 && (
                  <>
                    <ul className="number-list number-list--inputs">
                      {[...Array(count)].map((_, i) => (
                        <li key={i}>
                          <input
                            ref={(el) => (inputsRef.current[i] = el)}
                            value={selfInputs[i] ?? ""}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onBlur={(e) => {
                              if (skipNextBlurRef.current) {
                                skipNextBlurRef.current = false;
                                return;
                              }
                              validateAndCommit(i, e.currentTarget.value);
                            }}
                            placeholder={`No.${i + 1}`}
                            type="number"
                            min={MIN_VALUE}
                            max={MAX_VALUE}
                            inputMode="numeric"
                          />
                        </li>
                      ))}
                    </ul>

                    <button onClick={saveSelfInputsToTest}>SAVE to test</button>
                  </>
                )}

                {test.length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <h4>Saved array:</h4>
                    <ul className="number-list">
                      {test.map((num, idx) => (
                        <li key={idx}>{num}</li>
                      ))}
                    </ul>
                    <div>Total: {test.length}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="sorting-controls">
            <SortList value={selectedSort} onChange={setSelectedSort} />
          </div>

          <SortVisualizer
            sortJson={sortJson}
            descriptionData={SORT_DESCRIPTIONS[selectedSort]}
            onGenerateLog={handleGenerateSortLog}
            hasInputData={test.length > 0}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="app-container app-footer__inner">
        </div>
      </footer>
    </div>
  );
}

export default App;
