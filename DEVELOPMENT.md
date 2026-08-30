# Portfolio development

The portfolio is a dependency-free client-side application with instant French/English switching, hash-based navigation, and a filterable project index.

The canonical production URL is `https://amhe.me/`. The checked-in `CNAME` file
binds that domain when the repository is deployed with GitHub Pages.

## Architecture

```text
site.config.js  Public identity, contact, social links, CVs, and resources

src/
├── components/   Reusable interface components
├── data/         Structured project, résumé, and statistics metadata
├── i18n/         French and English translations
├── pages/        Home, project, detail, and interactive résumé pages
├── app.js        Rendering and application lifecycle
└── router.js     Client-side hash routing

styles/          Layered CSS by responsibility
scripts/         Project and privacy validation
content/         Project fact checklist and repository migration proposal
public/cv/       Stable links to the current French and English CVs
```

## Site-wide configuration

Edit `site.config.js` to change public contact details, social profiles, CV
paths, or project-specific resources. In particular,
`contact.recruiterAccessEmail` is the single source of truth for every
recruiter repository-access request.

The homepage selection and order are controlled by
`home.featuredProjectIds`. This is where MyStarCeiling and the future ESA
project can be promoted when their public case studies are ready.

Project reports can be added to `projectResources` in that same file. Each
resource accepts a bilingual label and a public URL; it then appears on the
matching project detail page.

## GitHub statistics

The project index renders a modern GitHub activity snapshot. It starts with the
checked-in fallback in `src/data/github-stats.js`, then parses the live
`github-metrics.svg` generated in the `bymedeu` profile repository. Its Metrics
workflow continues to refresh that file daily and may include private
contribution counts without disclosing private source. The source URL is set in
`site.config.js`; the workflow and its secret remain in the profile repository.

Per-project line counts describe the complete local codebase, including tests
and supplied academic scaffolding where applicable. They must not be described
as lines authored by one person.

## Preview

```bash
npm run serve
```

Then visit `http://localhost:4173`.

## Validate

```bash
npm run check
```

## Updating project details

Missing durations, team sizes, roles, and project-specific links are tracked in
`content/project-details.yml`. Unknown values are intentionally omitted from the
public interface until they are confirmed.

`content/repository-migration.yml` records the approved private-repository and
submodule layout used for the EPITA project archive.
