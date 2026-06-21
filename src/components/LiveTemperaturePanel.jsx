import liveTemperature from '../data/liveTemperature.json';
import archivalTemperature from '../data/archivalTemperatureData.json';

const METRIC_ORDER = [
  'water_temperature_C',
  'tide_height_m',
  'next_tide_height_m',
  'air_temperature_C',
  'salinity_psu',
  'wind_speed_m_s',
  'air_pressure_mb',
  'relative_humidity_percent',
  'chlorophyll_fluorescence',
  'streamflow_cfs',
];

const SUMMER_MONTHS = new Set([6, 7, 8, 9]);
const TARGET_RED_SUMMER_STAGES = { min: 4, max: 5 };
const VERY_LOW_TIDE_M = 0.3;
const TIDE_WATCH_M = 0.6;
const TEMP_WATCH_MARGIN_C = 1.5;

function calibrateMortalityTemperatureThreshold() {
  const summerSiteDays = [];
  const monthsByYear = new Map();

  for (const row of archivalTemperature.series) {
    const month = Number(row.date.slice(5, 7));
    if (!SUMMER_MONTHS.has(month)) continue;

    const year = row.date.slice(0, 4);
    const months = monthsByYear.get(year) ?? new Set();
    months.add(month);
    monthsByYear.set(year, months);

    for (const site of archivalTemperature.sites) {
      const temp = row[site];
      if (!Number.isFinite(temp)) continue;
      const roundedTemp = Math.round(temp * 10) / 10;
      summerSiteDays.push({ year, temp: roundedTemp });
    }
  }

  const completeYears = new Set(
    [...monthsByYear.entries()]
      .filter(([, months]) => [...SUMMER_MONTHS].every((month) => months.has(month)))
      .map(([year]) => year)
  );
  const calibrationRows = summerSiteDays.filter(({ year }) => completeYears.has(year));
  if (!calibrationRows.length) {
    return { threshold: 22.2, averageStages: 4.5 };
  }

  const yearCount = Math.max(completeYears.size, 1);
  const temps = calibrationRows.map(({ temp }) => temp);
  const minTemp = Math.floor(Math.min(...temps) * 10);
  const maxTemp = Math.ceil(Math.max(...temps) * 10);
  const thresholds = Array.from(
    { length: maxTemp - minTemp + 1 },
    (_, index) => (minTemp + index) / 10
  );
  const candidates = thresholds.map((threshold) => {
    const count = calibrationRows.filter(({ temp }) => temp >= threshold).length;
    return { threshold, averageStages: count / yearCount };
  });

  const inTarget = candidates.filter(
    ({ averageStages }) =>
      averageStages >= TARGET_RED_SUMMER_STAGES.min &&
      averageStages <= TARGET_RED_SUMMER_STAGES.max
  );

  const pool = inTarget.length ? inTarget : candidates;
  const targetMidpoint =
    (TARGET_RED_SUMMER_STAGES.min + TARGET_RED_SUMMER_STAGES.max) / 2;

  return pool.reduce((best, candidate) => {
    const bestDistance = Math.abs(best.averageStages - targetMidpoint);
    const candidateDistance = Math.abs(candidate.averageStages - targetMidpoint);
    if (candidateDistance < bestDistance) return candidate;
    if (candidateDistance === bestDistance && candidate.threshold < best.threshold) {
      return candidate;
    }
    return best;
  });
}

const MORTALITY_TEMP_THRESHOLD = calibrateMortalityTemperatureThreshold();

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

function formatMetric(metric) {
  if (!metric) return 'Unavailable';
  if (metric.value == null) {
    return metric.status === 'source-matched' ? 'Import pending' : 'Unavailable';
  }
  const value = `${metric.value} ${metric.unit}`.trim();
  return metric.note ? `${value} · ${metric.note}` : value;
}

function formatValue(value, suffix) {
  if (!Number.isFinite(value)) return 'Unavailable';
  return `${value.toFixed(1)} ${suffix}`;
}

function getMortalityAdvisory(observation) {
  const waterTemp = observation.metrics?.water_temperature_C?.value;
  const tideHeight = observation.metrics?.tide_height_m?.value;
  const hasInputs = Number.isFinite(waterTemp) && Number.isFinite(tideHeight);

  if (!hasInputs) {
    return {
      stage: 'Unavailable',
      className: 'is-unavailable',
      summary: 'Needs current water temp and tide height',
    };
  }

  const highTemp = waterTemp >= MORTALITY_TEMP_THRESHOLD.threshold;
  const veryLowTide = tideHeight <= VERY_LOW_TIDE_M;

  if (highTemp && veryLowTide) {
    return {
      stage: 'Red',
      className: 'is-red',
      summary: 'Very low tide with historically rare high temperature',
    };
  }

  const warmTemp =
    waterTemp >= MORTALITY_TEMP_THRESHOLD.threshold - TEMP_WATCH_MARGIN_C;
  const lowTide = tideHeight <= TIDE_WATCH_M;

  if (highTemp || (warmTemp && lowTide)) {
    return {
      stage: 'Watch',
      className: 'is-watch',
      summary: 'One stressor is near the Red range',
    };
  }

  return {
    stage: 'Normal',
    className: 'is-normal',
    summary: 'Below Red temperature and tide thresholds',
  };
}

function metricRows(metrics = {}) {
  const ordered = METRIC_ORDER.map((key) => metrics[key]).filter(Boolean);
  const extras = Object.keys(metrics)
    .filter((key) => !METRIC_ORDER.includes(key))
    .map((key) => metrics[key]);
  return [...ordered, ...extras];
}

export default function LiveTemperaturePanel() {
  const { observations, description, generatedAt, maxAgeHours } = liveTemperature;

  return (
    <section className="card" aria-label="Live environmental snapshot">
      <div className="chart-header-row">
        <h2 className="section-title">Live Environmental Snapshot</h2>
        <span className="live-temperature-badge">Refresh target: {maxAgeHours}h</span>
      </div>
      <p className="chart-caption">{description}</p>

      <div className="live-temperature-grid">
        {observations.map((observation) => {
          const advisory = getMortalityAdvisory(observation);
          const waterTemp = observation.metrics?.water_temperature_C?.value;
          const tideHeight = observation.metrics?.tide_height_m?.value;

          return (
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

              <div className={`mortality-advisory ${advisory.className}`}>
                <div className="mortality-advisory-header">
                  <span>Mortality Advisory Index</span>
                  <strong>{advisory.stage}</strong>
                </div>
                <p>{advisory.summary}</p>
                <p>
                  Now: {formatValue(waterTemp, '°C')} /{' '}
                  {formatValue(tideHeight, 'm MLLW')}
                </p>
                <p>
                  Red: ≥{MORTALITY_TEMP_THRESHOLD.threshold.toFixed(1)} °C and ≤
                  {VERY_LOW_TIDE_M.toFixed(1)} m MLLW. Historical temp frequency:{' '}
                  {MORTALITY_TEMP_THRESHOLD.averageStages.toFixed(1)} summer
                  site-days/year.
                </p>
              </div>

              <dl className="live-environment-metrics">
                {metricRows(observation.metrics).map((metric) => (
                  <div key={metric.key} className="live-environment-metric">
                    <dt>{metric.label}</dt>
                    <dd>{formatMetric(metric)}</dd>
                  </div>
                ))}
              </dl>

              {observation.metrics?.chlorophyll_fluorescence?.note ? (
                <p className="live-temperature-meta">
                  {observation.metrics.chlorophyll_fluorescence.note}
                </p>
              ) : null}

              {observation.source_url ? (
                <a href={observation.source_url} target="_blank" rel="noreferrer">
                  View NOAA source
                </a>
              ) : null}
              {observation.metrics?.chlorophyll_fluorescence?.source_url ? (
                <a
                  href={observation.metrics.chlorophyll_fluorescence.source_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View chlorophyll source
                </a>
              ) : null}
            </article>
          );
        })}
      </div>

      <p className="chart-source-note">
        Snapshot generated {formatGeneratedAt(generatedAt)} UTC.
      </p>
    </section>
  );
}
