# WTF · Whitestone Taylored Functions

A private circle and venue for San Diego's entrepreneurs, operators and investors.
*Where The Founders gather.*

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `circle.html` | The Circle: who it's for, membership, house rules, FAQ |
| `gatherings.html` | Gatherings: the five formats and the season ahead |
| `venue.html` | The Venue: spaces, locations, private hosting, production |
| `manifesto.html` | Manifesto: the name and what we believe |
| `apply.html` | Request an invitation / nominate / host |
| `404.html` | Not found |

## Editing

The pages are generated. Edit the sources, then rebuild:

- `_src/layout.html`: shared head, header and footer
- `_src/pages/*.html`: each page's content (title/description header, then `---`, then HTML)
- `css/styles.css`, `js/site.js`: styles and behaviour

```bash
python _src/build.py
```

## Invitation form

There is no backend. In `js/site.js`, set `FORM_ENDPOINT` to a form service URL
(e.g. Formspree) to receive submissions directly. If it is left empty, the form opens
the visitor's mail app addressed to `CONTACT_EMAIL`.

## Preview locally

```bash
python -m http.server 8000
```
