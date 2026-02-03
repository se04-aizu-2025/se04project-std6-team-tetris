import React from "react";

export default function SortDescription({ data }) {
  if (!data) return null;

  return (
    <div className="sort-description">
      <div className="sort-description__header">
        <h3 className="sort-description__title">{data.title}</h3>
        {data.complexity && (
          <div className="sort-description__badges">
            <span className="badge">平均 {data.complexity.timeAverage}</span>
            <span className="badge">最悪 {data.complexity.timeWorst}</span>
            <span className="badge">メモリ {data.complexity.space}</span>
            <span className="badge">{data.complexity.stable}</span>
          </div>
        )}
      </div>

      {data.summary && <p className="sort-description__summary">{data.summary}</p>}

      {Array.isArray(data.howItWorks) && data.howItWorks.length > 0 && (
        <div className="sort-description__section">
          <div className="sort-description__sectionTitle">どう動く？</div>
          <ol className="sort-description__list">
            {data.howItWorks.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
      )}

      {(data.goodFor?.length || data.notGoodFor?.length) && (
        <div className="sort-description__grid">
          {data.goodFor?.length > 0 && (
            <div className="sort-description__card">
              <div className="sort-description__sectionTitle">得意</div>
              <ul className="sort-description__bullets">
                {data.goodFor.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {data.notGoodFor?.length > 0 && (
            <div className="sort-description__card">
              <div className="sort-description__sectionTitle">苦手</div>
              <ul className="sort-description__bullets">
                {data.notGoodFor.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

