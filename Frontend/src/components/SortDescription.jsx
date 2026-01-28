export default function SortDescription({ data }) {
  if (!data) return null;

  return (
    <div className="sort-description">
      <h3 className="section-title">説明</h3>
      <div className="desc-grid">
        <div className="desc-item">
          <div className="desc-label">概要</div>
          <div className="desc-value">{data.summary}</div>
        </div>
        <div className="desc-item">
          <div className="desc-label">計算量</div>
          <div className="desc-value">{data.complexity}</div>
        </div>
        <div className="desc-item">
          <div className="desc-label">安定性</div>
          <div className="desc-value">{data.stable}</div>
        </div>
        <div className="desc-item">
          <div className="desc-label">特徴</div>
          <div className="desc-value">{data.notes}</div>
        </div>
      </div>
    </div>
  );
}
