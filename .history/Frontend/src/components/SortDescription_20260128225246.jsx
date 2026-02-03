export default function SortDescription({ data }) {
  if (!data) return null;

  return (
    <div className="sort-description">
      <h3 className="section-title">Description</h3>

      <div className="desc-grid">
        <div className="desc-item">
          <div className="desc-label">Overview</div>
          <div className="desc-value">{data.summary}</div>
        </div>

        <div className="desc-item">
          <div className="desc-label">Time / Space Complexity</div>
          <div className="desc-value">{data.complexity}</div>
        </div>

        <div className="desc-item">
          <div className="desc-label">Stability</div>
          <div className="desc-value">{data.stable}</div>
        </div>

        <div className="desc-item">
          <div className="desc-label">Notes</div>
          <div className="desc-value">{data.notes}</div>
        </div>
      </div>
    </div>
  );
}
