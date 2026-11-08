// File naming for bug reports, shared by the report builder and the issue publisher.
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const fileName = (bug) => `${bug.id}-${slug(bug.title)}.md`;

module.exports = { slug, fileName };
