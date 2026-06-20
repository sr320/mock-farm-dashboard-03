import liveTemperature from '../data/liveTemperature.json';

function formatObservedAt(value) {
  if (!value) return 'No timestamp';
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });
}

function formatGeneratedAt(value) {
  if (!value) return 'Unknown';
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });
}

export default function LiveTemperaturePanel() {
  const { observations, description, generatedAt, maxAgeHours } = liveTemperature;

  return (
    <section className="card" aria-label="Live water temperature snapshot">
      <div className="chart-header-row">
        <h2 className="section-title">Live Water Temperature Snapshot</h2>
        <span className="live-temperature-badge">Refresh target: {maxAgeHours}h</span>
      </div>
      <p className="chart-caption">{description}</p>

      <div className="live-temperature-grid">
        {observations.map((observation) => (
          <article key={observation.site} className="live-temperature-card">
            <div className="live-temperature-card-header">
              <h3>{observation.site}</h3>
              <strong>
                {observation.temperature_C != null
                  ? `${observation.temperature_C} °C`
                  : 'Unavailable'}
              </strong>
            </div>
            <p className="live-temperature-meta">
              Observed {formatObservedAt(observation.observed_at)}
            </p>
            {observation.station_name ? (
              <p className="live-temperature-meta">
                {observation.provider} via {observation.station_name}
                {observation.distance_km != null
                  ? ` (${observation.distance_km} km away)`
                  : ''}
              </p>
            ) : (
              <p className="live-temperature-meta">
                {observation.note ?? 'No fresh reading available'}
              </p>
            )}
            {observation.source_url ? (
              <a href={observation.source_url} target="_blank" rel="noreferrer">
                View source
              </a>
            ) : null}
          </article>
        ))}
      </div>

      <p className="chart-source-note">
        Snapshot generated {formatGeneratedAt(generatedAt)} UTC.
      </p>
    </section>
  );
}
