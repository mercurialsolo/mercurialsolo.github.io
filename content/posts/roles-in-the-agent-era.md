---
title: "The Jobs They Are A-Changin'"
date: 2026-09-26T09:00:00
author: mercurialsolo
tags: [ai, agents, work, labor, org-design, evals]
summary: "Job specs are changing years before the official statistics can see it. In every field AI takes the operational work first, and that is the work people learned on. The first rung now asks for judgment."
ShowToc: true
TocOpen: false
---

**Job specs are changing years before the official statistics can see it. In every field AI takes the operational work first, and that's the work people learned on. The first rung now asks for judgment.**

> *Come gather 'round people, wherever you roam*<br>
> *And admit that the waters around you have grown*
>
> Bob Dylan, [*The Times They Are A-Changin'*](https://www.bobdylan.com/songs/times-they-are-changin/), 1964

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/52vA3CYKZqZVdQnzRrdZt6?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

{{< highlight-box title="In brief" >}}
- The US has no official job code for an AI engineer. The next set of occupation codes won't be in use until 2028.
- Visible AI adoption covers 2.2% of US wage value. Work AI can already do covers 11.7% (MIT Project Iceberg).
- In every field AI takes the operational work first: the note before the diagnosis, first-pass review before the advice.
- The most AI-exposed entry-level jobs are 7x more likely than the least exposed to ask for traditionally senior skills (PwC).
{{< /highlight-box >}}

## Job specs are moving first

Anthropic and OpenAI now both employ a chief economist. The job is to measure what their own employer is doing to the labour market.

Anthropic's Peter McCrory told a Harvard forum this week that he wants to use [the tools of economics to help Anthropic understand the impact of its own decisions](https://www.thecrimson.com/article/2026/9/24/anthropic-economist-forum/).

The argument about AI and work gets settled with payroll data, which trails the hiring that produces it by years. Arvind Narayanan has made the most careful case that [AI spreads slowly](https://knightcolumbia.org/content/ai-as-normal-technology), and he puts the adaptation at [a decade or two](https://www.normaltech.ai/p/what-will-be-left-for-us-to-work). He's describing payroll. Employers rewrite a role the quarter they believe something; payroll records it years later, once training and org design have caught up. The job specs are changing now, and not only in software.

| Discipline | Was | Becomes |
|------------|-----|---------|
| Software | Debugging | Mechanistic interpretability |
| Product | Product design | Model behaviour |
| Science | Bench scientist | Autonomous lab supervisor |
| Legal | Junior associate | The diamond's missing base |
| Medicine | Medical scribe | Ambient recorder |
| The firm | Economist | In-house measurer |

Every domain is swapping out what you could open and read for something you can only sample. A reviewable pull request becomes an {{< term name="eval" text="eval suite" def="A test suite for a model or agent: a fixed set of inputs plus a way of scoring the outputs, used to decide whether behaviour improved or regressed." >}}. A clinical note becomes a draft to check. Each one buries a computational job inside a role that never had one.

François Chollet predicted this in 2021: within ten to twenty years, nearly every branch of science would be ["for all intents and purposes, a branch of computer science"](https://x.com/fchollet/status/2102444225443029100). He reposted it last week, saying the prediction "is looking obvious by the day now." Anthropic's interpretability team now recruits from [astronomy, physics, mathematics and biology](https://www.anthropic.com/research/team/interpretability), because the model stopped being a program you debug and became a specimen you study.

![François Chollet, 22 September 2026, re-upping his own May 2021 prediction. 869.6K views.](/images/roles-in-the-agent-era/chollet-computational-science.png)

Nathan Lambert describes [an environments industry](https://x.com/natolambert/status/2023549545045467615) where labs buy ten to twenty environments at a time for millions of dollars, and micro1 offers companies [$100k to $2M+](https://x.com/micro1_ai/status/2072800904332644429) for the anonymised operational data those environments are built from. Professional judgment now has a price list.

Indeed's Hiring Lab found AI-touched job titles [more common outside tech than inside it](https://www.hiringlab.org/2026/07/08/ai-is-no-longer-just-a-tech-occupation-story/) in five of six markets, with 63% of US AI-titled postings now outside tech occupations. This isn't a forecast.

## Every field automates the junior work first

Geoffrey Hinton predicted in 2016 that AI would do a radiologist's job within five years, and he's since [admitted he was wrong on the timing](https://www.auntminnie.com/imaging-informatics/artificial-intelligence/article/15746014/hinton-acknowledges-mistake-in-predicting-ai-replacement-of-radiologists). He bet on the diagnosis. Medicine gave up the paperwork first. Ambient scribes are now the most widely deployed generative AI in healthcare, cutting EHR time by [13.4 minutes a day](https://www.aha.org/aha-center-health-innovation-market-scan/2026-04-14-6-health-systems-enhancing-care-delivery-ambient-ai-scribes) across five academic centres, and the clinician now checks a draft that can invent a diagnosis.

Law is not far behind, and it's more brutal about it. Legal AI is best at exactly the first-pass review that paid for junior associates. Firms are moving from the pyramid to what iManage calls [the diamond](https://imanage.com/resources/resource-center/blog/how-law-firms-are-adapting-to-the-age-of-ai/), with fewer entry roles and a thicker middle of specialists and technologists.

Labs have automated routine work for decades, but ["humans were always pulling the strings. They were the ones developing the hypotheses and deciding which experiments were needed to test them. Now that paradigm is changing."](https://www.nature.com/collections/cgbiacfcgc)

Inside every field the order is the same. AI takes the operational work first and the decisions last, because a wrong draft is cheap to catch and a wrong call isn't. You've seen it in medicine and law. Software handed over the code before the architecture; science is handing over the literature search and the experiments before the choice of what to test. And the operational layer is where juniors learned the job.

Whether that means fewer junior jobs is still open, and I'd rather say so than quote the half that suits me. Stanford finds employment for 22-25 year olds in the most AI-exposed occupations [down about 11% since late 2022](https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/), while the least exposed grew about 10%. [Ramp](https://ramp.com/data/heavy-ai-adopters-hire-more) joined its card-spend records to workforce data across 21,000 firms and found entry-level headcount up 12% at heavy AI adopters. The skills data points one way. PwC finds the most exposed entry-level jobs are [7x more likely than the least exposed](https://www.pwc.com/gx/en/issues/artificial-intelligence/job-barometer/2026/2026-global-ai-jobs-barometer-global-findings.pdf) to demand traditionally senior skills. The New York Fed's regional surveys describe AI's effect so far as [changing skill requirements rather than eliminating jobs](https://libertystreeteconomics.newyorkfed.org/2026/08/ais-impact-on-labor-and-hiring/).

## The official numbers can't see it yet

Read the official statistics and none of this has happened. Yale's Budget Lab finds [no link yet](https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market) between AI use and employment in the August 2026 survey data. Part of that silence is mechanical. Federal occupational statistics are still counted in the [2018 Standard Occupational Classification](https://www.bls.gov/soc/2028/2028_soc_revision.htm), fixed before ChatGPT existed. It has no code for an AI engineer, a forward deployed engineer or an interpretability researcher, and the 2028 revision won't be in use until reference year 2028. When Yale says the occupational mix isn't changing, it's reporting the mix of categories frozen in 2018.

{{< chart src="roles-in-the-agent-era/soc-timeline.html" caption="No official code for an AI engineer until 2028." >}}

MIT's [Project Iceberg](https://iceberg.mit.edu/report.pdf) gets underneath the codes by counting skills. The technology roles the headlines cover account for 2.2% of US wage value, about $211 billion. Skills AI can already perform across administrative, financial and professional work account for 11.7%, about $1.2 trillion, and they're spread across every state. Delaware and South Dakota score higher than California.

Even the direct measurements are struggling to keep up. METR has [retired its 2025 finding](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study) that AI made experienced developers slower, and its [late-2025 follow-up](https://metr.org/blog/2026-02-24-uplift-update/) estimates an 18% speedup for the returning developers. The study itself is being redesigned because too few developers will work without AI to fill a control group.

## What to do before the data catches up

Every role in the taxonomy below asks for judgment. The first rung now asks for the judgment you used to earn by climbing. So who's going to be qualified to write the evals in 2035? The people who start building that judgment now, on purpose, because the work that used to build it by accident is going first.

Narayanan, for all his caution about timing, agrees on the direction. He expects human effort to shift ["from building towards evaluation and monitoring"](https://icml.cc/virtual/2026/invited-talk/67274), with domain knowledge and normative judgment gaining in importance.

**If you're a student**

- **Learn to check the machine in your field.** In medicine that's validating a generated note; in law, sampling a model's document review; in software, writing the eval. Get reps at it before anyone pays you to.
- **Pair your subject with the computational layer inside it.** Anthropic's interpretability team hires astronomers, physicists, mathematicians and biologists. Be the person in your field who can test what the model does.
- **Practise judgment where mistakes are cheap.** Law firms are training new associates on simulated cases so they can fail safely. Find the equivalent in your field: projects where you make the call and someone senior checks it.

**If you're already working**

- **Move up a layer before yours moves.** List the operational parts of your job, because that's what goes first. Put your hours into the parts where you specify, evaluate and decide.
- **Read job specs, not job titles.** The official categories are frozen until 2028. Postings show the new shape now, and 63% of US AI-titled postings are already outside tech.
- **If you manage people, rebuild the rung.** Your juniors learned on the work you're automating. Give them the evals to write and the AI output to review, with a senior checking their calls.

The official numbers will catch up in 2028. Don't wait for them.

{{< highlight-box title="Try it yourself" >}}
Anthropic's [Economic Scenarios explorer](https://www.anthropic.com/institute/econ-scenarios) lets you set capability and adoption assumptions and watch GDP, wages and labour share move. MIT CTL's [AI Labor Exposure Map](https://www.workanalyticslab.com/us-ai-map/) shows exposure by metro area, industry and job. MIT's [Iceberg Index](https://iceberg.mit.edu/report.pdf) is the skill-level report behind the 2.2% and the 11.7%.
{{< /highlight-box >}}

---

## The full taxonomy

Find your role below. Thirty-one role morphs across six disciplines, scanned off career pages, research-team pages and industry reporting between March and September 2026. Four rows rest on a named study, 10 on job postings, 13 on industry reporting, one on a research team page, one on a vendor's own claim, and two on nothing but my argument.

### What the official projections already show

BLS counts in the frozen 2018 codes, so this is the shift as the old taxonomy can see it.

{{< chart src="roles-in-the-agent-era/bls-spread.html" caption="Data scientists +33.5%, clerical roles down: one technology, a 42-point spread." >}}

### Software

Verification is nearly free here: tests, CI, staging, instant feedback. The operational work went first, and the architecture is still human.

| Was | Becomes | What actually moved |
|-----|---------|---------------------|
| Software engineer | AI engineer | Shipping code to shipping evals and context |
| Infrastructure engineering | Inference engineering | Keeping servers up to keeping tokens cheap |
| QA | RL environment design | Labs buy 10-20 environments at a time, for millions |
| Debugging | Mechanistic interpretability | Reading logs to reading weights |
| Solutions engineer | FDE | Configuring a product to building inside the customer |
| Issue | Hypothesis | Fixing the known to testing the unknown |

### Product

The object of design used to be a screen. It is now a disposition.

| Was | Becomes | What actually moved |
|-----|---------|---------------------|
| Product | Agent | Interface to behaviour, seats to resolutions |
| Product manager | AI builder | Writing the spec to running the prototype |
| Product design | Model behaviour | Designing the interface to designing the disposition |
| Analytics & insights | Behavioural models | Reporting the past to simulating the population |
| Partner | Embedded evaluator | Implementation hours to judging behaviour |

### Science

Literature search and experiment execution automated early. Choosing which hypothesis to test is the part still held back.

| Was | Becomes | What actually moved |
|-----|---------|---------------------|
| Bench scientist | Autonomous lab supervisor | Running the experiment to overseeing the robot that runs it |
| Experiment design | Open-ended search | Picking the next test to defining the space to search |
| Lab automation | AI-lab innovation | Scripting instruments to closing the hypothesis loop |
| Postdoc | AI-paired researcher | Learning the bench to directing agents |
| Reading the literature | Understanding extraction | Absorbing findings to reverse-engineering why the machine was right |

### Legal

The clearest case of a training pipeline being removed, because the automated work is precisely the work that trained people.

| Was | Becomes | What actually moved |
|-----|---------|---------------------|
| Junior associate | The diamond's missing base | Billable training hours to automated first pass |
| Document review | Audit sampling | Reading everything to checking a model that read everything |
| Practising attorney | Legal engineer | Harvey pays $220-320K for lawyers who left practice |
| Apprenticeship on live matters | Case simulator | Learning on real clients to rehearsing against synthetic ones |
| Billable hour | Outcome pricing | Selling time to selling resolution |

### Medicine

Adoption is real and measured. Reported uptake runs to 40% of UK GPs and 44.6% at UCSF Health, at $200-600 per clinician per month.

| Was | Becomes | What actually moved |
|-----|---------|---------------------|
| Medical scribe | Ambient recorder | Transcribing the visit to validating the transcript |
| Clinical note | Note review | Writing the record to auditing a generated one |
| Radiologist | AI-assisted reader | Reading the image to reading the model reading the image |
| Health IT procurement | Chief Health AI Officer | Buying software to governing model behaviour |
| Clinical audit | Continuous model monitoring | Periodic review to watching drift |

### The firm

What changes when the org chart has non-humans in it.

| Was | Becomes | What actually moved |
|-----|---------|---------------------|
| Software company | Computational lab | Shipping features to running experiments |
| Org behaviour | Agent society behaviour | Managing people to designing coordination |
| Economist | In-house measurer | Forecasting the market to measuring your own effect on it |
| Practising professional | Training data | micro1 pays firms $100k-$2M+ for operational data |
| Compliance | AI assurance | Checking the process to auditing the behaviour |
