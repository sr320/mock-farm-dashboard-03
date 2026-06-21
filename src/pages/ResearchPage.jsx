const researchThemes = [
  {
    title: 'Mass Mortality Risk',
    label: 'Objective 1',
    body:
      'Determine the susceptibility of Washington shellfish farms to heatwaves by monitoring air and water temperatures experienced by oysters during grow-out across Salish Sea and Willapa Bay farms.',
  },
  {
    title: 'Climate-Resilient Husbandry',
    label: 'Objective 2',
    body:
      'Develop a commercially viable hatchery protocol that improves oyster heat tolerance by testing stress-primed spat from OsHV-1 resistant Pacific oyster families in farm outplants.',
  },
  {
    title: 'Workforce Development',
    label: 'Objective 3',
    body:
      'Build an enhanced training curriculum for shellfish industry technicians, using OsHV-1 and heat waves as case studies with students from Bellingham Technical College.',
  },
];

const researchers = [
  {
    name: 'Ariana Huffmyer',
    role: 'Research lead',
    description:
      'Leads the research effort connecting oyster stress-hardening, field monitoring, and farm-scale climate resilience.',
  },
  {
    name: 'Steven Roberts',
    role: 'Research lead',
    description:
      'Co-leads the dashboard research and supports integration of field observations, environmental data, and project interpretation.',
  },
  {
    name: 'Emily Carrington',
    role: 'Washington Sea Grant award lead',
    description:
      'Leads the Washington Sea Grant collaborative partnership addressing oyster aquaculture mass mortalities through monitoring, husbandry, and workforce development.',
  },
  {
    name: 'Grace Leauchtenberger',
    role: 'Graduate student researcher',
    description:
      'Graduate student contributing to the Washington Sea Grant project and associated research activities.',
  },
  {
    name: 'Megan Ewing',
    role: 'Incoming graduate student researcher',
    description:
      'Beginning in July 2026, will expand related work with manila clams and cockles at sites near Suquamish and Westcott.',
  },
  {
    name: 'Jesse Lowe',
    role: 'Undergraduate researcher',
    description:
      'Undergraduate student assisting Megan Ewing with the upcoming clam and cockle field research.',
  },
];

const fundingDetails = [
  {
    label: 'Award',
    value:
      'A collaborative partnership to address mass mortalities in oyster aquaculture through improved field monitoring, husbandry practices, and workforce development',
  },
  {
    label: 'Funding agency',
    value: 'Washington Sea Grant',
  },
  {
    label: 'Award lead',
    value: 'Emily Carrington',
  },
  {
    label: 'Research lead',
    value: 'Ariana Huffmyer',
  },
];

export default function ResearchPage() {
  return (
    <main className="dashboard-main research-page">
      <section className="card research-hero">
        <p className="research-kicker">Research Overview</p>
        <h2>Shellfish Stress-Hardening Field Research</h2>
        <p>
          SHIELD supports collaborative research aimed at reducing the
          frequency and severity of oyster mass mortality events associated with
          OsHV-1 infection and extreme climate events, including marine and
          aerial heatwaves.
        </p>
      </section>

      <section className="research-grid">
        {researchThemes.map((theme) => (
          <article className="card research-topic" key={theme.title}>
            <p className="research-kicker">{theme.label}</p>
            <h3>{theme.title}</h3>
            <p>{theme.body}</p>
          </article>
        ))}
      </section>

      <section className="card research-section">
        <div className="research-section-header">
          <div>
            <p className="research-kicker">People</p>
            <h2 className="section-title">Researchers and Collaborators</h2>
          </div>
          <p className="chart-caption">
            The research is led by Ariana Huffmyer with Steven Roberts, with
            Washington Sea Grant project leadership from Emily Carrington and
            student researchers contributing to oyster, clam, and cockle field
            studies.
          </p>
        </div>

        <div className="researcher-list">
          {researchers.map((researcher) => (
            <article className="researcher-item" key={researcher.name}>
              <div className="researcher-avatar" aria-hidden="true">
                {researcher.name
                  .split(' ')
                  .map((part) => part.charAt(0))
                  .join('')}
              </div>
              <div>
                <h3>{researcher.name}</h3>
                <p className="researcher-role">{researcher.role}</p>
                <p>{researcher.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card research-section">
        <div className="research-section-header">
          <div>
            <p className="research-kicker">Support</p>
            <h2 className="section-title">Funding and Acknowledgments</h2>
          </div>
          <p className="chart-caption">
            This page summarizes the Washington Sea Grant-supported
            collaborative partnership and can be updated with award numbers,
            partner names, and required acknowledgement language.
          </p>
        </div>

        <dl className="funding-grid">
          {fundingDetails.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="acknowledgment-box">
          <h3>Washington Sea Grant Summary</h3>
          <p>
            The collective goal is to support sustainable expansion of oyster
            aquaculture in Washington State by reducing mass mortality events
            that result from interactions between OsHV-1 infection and extreme
            climate events. Continuous environmental monitoring paired with
            oyster mortality data will support climate risk assessment for
            commercial growing areas, while hatchery stress-priming trials and
            industry training activities translate research into practical farm
            and workforce outcomes.
          </p>
        </div>
      </section>
    </main>
  );
}
