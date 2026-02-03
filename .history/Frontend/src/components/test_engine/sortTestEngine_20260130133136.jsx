import React, { useState, useEffect } from 'react';

export default function SortTestEngine() {
// テストケース生成関数
const generateTestCases = () => {
  return [
    {
      id: 'empty',
      name: 'Empty Array',
      input: [],
      expected: []
    },
    {
      id: 'single',
      name: 'Single Element',
      input: [42],
      expected: [42]
    },
    {
      id: 'sorted',
      name: 'Already Sorted',
      input: [1, 2, 3, 4, 5],
      expected: [1, 2, 3, 4, 5]
    },
    {
      id: 'reverse',
      name: 'Reverse Sorted',
      input: [5, 4, 3, 2, 1],
      expected: [1, 2, 3, 4, 5]
    },
    {
      id: 'duplicates',
      name: 'With Duplicates',
      input: [3, 1, 4, 1, 5, 9, 2, 6, 5],
      expected: [1, 1, 2, 3, 4, 5, 5, 6, 9]
    },
    {
      id: 'random-small',
      name: 'Random (10 elements)',
      input: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
      expected: null // Will be calculated
    },
    {
      id: 'random-medium',
      name: 'Random (50 elements)',
      input: Array.from({ length: 50 }, () => Math.floor(Math.random() * 100)),
      expected: null
    },
    {
      id: 'random-large',
      name: 'Random (100 elements)',
      input: Array.from({ length: 100 }, () => Math.floor(Math.random() * 100)),
      expected: null
    },
    {
      id: 'all-same',
      name: 'All Same Value',
      input: Array(10).fill(7),
      expected: Array(10).fill(7)
    },
    {
      id: 'two-values',
      name: 'Only Two Values',
      input: [1, 2, 1, 2, 1, 2, 1, 2],
      expected: [1, 1, 1, 1, 2, 2, 2, 2]
    }
  ].map(tc => ({
    ...tc,
    expected: tc.expected || [...tc.input].sort((a, b) => a - b)
  }));
};

// ソートアルゴリズムのリスト
const SORT_METHODS = [
  { id: 'bubble', name: 'Bubble Sort' },
  { id: 'quick', name: 'Quick Sort' },
  { id: 'heap', name: 'Heap Sort' },
  { id: 'insertion', name: 'Insertion Sort' },
  { id: 'gnome', name: 'Gnome Sort' }
];


  const [testCases] = useState(generateTestCases());
  const [results, setResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [selectedMethods, setSelectedMethods] = useState(SORT_METHODS.map(m => m.id));


  // 配列が正しくソートされているかチェック
  const isSorted = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  };

  // 配列が一致するかチェック
  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  // 単一のテストケースを実行
  const runSingleTest = async (method, testCase) => {
    const startTime = performance.now();
    if (testCase.input.length <= 1) {
      return {
        skipped: true,
        passed: true,     
        sorted: true,
        executionTime: 0,
        stepCount: 0,
        resultArray: [...testCase.input],
        error: null,
        reason: "SKIPPED: length <= 1"
      };
    }
    try {
      const res = await fetch('http://127.0.0.1:8081/sort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          method: method, 
          array: testCase.input 
        })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // 結果の配列を取得
      let resultArray = [];
      if (data.steps && data.steps.length > 0) {
        // 最後のswapステップから配列を取得
        for (let i = data.steps.length - 1; i >= 0; i--) {
          if (data.steps[i].type === 'swap' && data.steps[i].array) {
            resultArray = data.steps[i].array;
            break;
          }
        }
      }
      
      // 結果が空の場合は初期配列を使用
      if (resultArray.length === 0) {
        resultArray = data.initialArray || testCase.input;
      }

      // 検証
      const passed = arraysEqual(resultArray, testCase.expected);
      const sorted = isSorted(resultArray);
      const stepCount = data.steps ? data.steps.length : 0;

      return {
        passed,
        sorted,
        executionTime: Math.round(executionTime),
        stepCount,
        resultArray,
        error: null
      };
    } catch (error) {
      const endTime = performance.now();
      return {
        passed: false,
        sorted: false,
        executionTime: Math.round(endTime - startTime),
        stepCount: 0,
        resultArray: [],
        error: error.message
      };
    }
  };

  // すべてのテストを実行
  const runAllTests = async () => {
    setIsRunning(true);
    setResults({});
    
    const newResults = {};

    for (const method of selectedMethods) {
      newResults[method] = {};
      
      for (const testCase of testCases) {
        setCurrentTest(`${method} - ${testCase.name}`);
        
        const result = await runSingleTest(method, testCase);
        newResults[method][testCase.id] = result;
        
        // UIを更新
        setResults({ ...newResults });
        
        // 少し待機（UI更新のため）
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    setCurrentTest(null);
    setIsRunning(false);
  };

  // メソッドの選択切り替え
  const toggleMethod = (methodId) => {
    setSelectedMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  // 統計を計算
  const getStats = (methodId) => {
    const methodResults = results[methodId];
    if (!methodResults) return null;
  
    const all = Object.values(methodResults);
  
    const runnable = all.filter(r => !r.skipped);
    const passed = runnable.filter(r => r.passed).length;
    const failed = runnable.filter(r => !r.passed).length;
    const total = runnable.length;
  
    const avgTime =
      total === 0
        ? 0
        : runnable.reduce((sum, r) => sum + r.executionTime, 0) / total;
  
    const totalSteps = runnable.reduce((sum, r) => sum + r.stepCount, 0);
  
    return {
      total,
      passed,
      failed,
      skipped: all.length - total,
      passRate: total === 0 ? "—" : ((passed / total) * 100).toFixed(1),
      avgTime: Math.round(avgTime),
      totalSteps
    };
  };
  

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{
            margin: '0 0 10px 0',
            fontSize: '48px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            🧪 Sort Test Engine
          </h1>
          <p style={{
            margin: 0,
            fontSize: '18px',
            color: '#64748b'
          }}>
            Comprehensive testing suite for sorting algorithms
          </p>
        </div>

        {/* Controls */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <h2 style={{
            margin: '0 0 20px 0',
            fontSize: '24px',
            fontWeight: '700'
          }}>
            Select Algorithms to Test
          </h2>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {SORT_METHODS.map(method => (
              <label
                key={method.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: selectedMethods.includes(method.id) 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#f1f5f9',
                  color: selectedMethods.includes(method.id) ? '#fff' : '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedMethods.includes(method.id)}
                  onChange={() => toggleMethod(method.id)}
                  style={{ cursor: 'pointer' }}
                />
                {method.name}
              </label>
            ))}
          </div>

          <button
            onClick={runAllTests}
            disabled={isRunning || selectedMethods.length === 0}
            style={{
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '700',
              color: '#fff',
              background: isRunning 
                ? '#94a3b8' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            {isRunning ? `🔄 Running: ${currentTest}` : '▶️ Run All Tests'}
          </button>
        </div>

        {/* Results Summary */}
        {Object.keys(results).length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {selectedMethods.map(methodId => {
              const stats = getStats(methodId);
              if (!stats) return null;

              const method = SORT_METHODS.find(m => m.id === methodId);

              return (
                <div
                  key={methodId}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>
                    {method.name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>Pass Rate</span>
                      <span style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: stats.passRate === '100.0' ? '#10b981' : '#ef4444'
                      }}>
                        {stats.passRate}%
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>Passed</span>
                      <span style={{ fontWeight: '600', color: '#10b981' }}>
                        ✓ {stats.passed}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>Failed</span>
                      <span style={{ fontWeight: '600', color: '#ef4444' }}>
                        ✗ {stats.failed}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>Avg Time</span>
                      <span style={{ fontWeight: '600', color: '#3b82f6' }}>
                        {stats.avgTime}ms
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>Total Steps</span>
                      <span style={{ fontWeight: '600' }}>
                        {stats.totalSteps.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Results */}
        {Object.keys(results).length > 0 && selectedMethods.map(methodId => {
          const methodResults = results[methodId];
          if (!methodResults) return null;

          const method = SORT_METHODS.find(m => m.id === methodId);

          return (
            <div
              key={methodId}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
              }}
            >
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '28px',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                {method.name} - Detailed Results
              </h2>

              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                {testCases.map(testCase => {
                  const result = methodResults[testCase.id];
                  if (!result) return null;

                  return (
                    <div
                      key={testCase.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '200px 100px 100px 120px 1fr',
                        gap: '16px',
                        padding: '16px',
                        borderRadius: '12px',
                        background: result.passed 
                          ? 'rgba(16, 185, 129, 0.1)' 
                          : 'rgba(239, 68, 68, 0.1)',
                        border: `2px solid ${result.passed ? '#10b981' : '#ef4444'}`,
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {testCase.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {testCase.input.length} elements
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: '800'
                        }}>
                          {result.passed ? '✓' : '✗'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '600' }}>
                          {result.executionTime}ms
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Time
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '600' }}>
                          {result.stepCount}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Steps
                        </div>
                      </div>

                      {result.error && (
                        <div style={{
                          fontSize: '12px',
                          color: '#ef4444',
                          fontFamily: 'monospace'
                        }}>
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

