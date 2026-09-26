---
title: "The Jobs They Are A-Changin'"
date: 2026-09-26T09:00:00
author: mercurialsolo
tags: [ai, agents, work, labor, org-design, evals]
summary: "Job specs are changing years before the official stats reflect. In every field AI is starting with the operational work first. The entry role now asks for judgment."
ShowToc: true
TocOpen: false
---

> *Come gather 'round people, wherever you roam*<br>
> *And admit that the waters around you have grown*

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/52vA3CYKZqZVdQnzRrdZt6?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

{{< highlight-box title="In brief" >}}
- The US has no official job code for an AI engineer. The next set of occupation codes won't be in use until 2028.
- Visible AI adoption covers 2.2% of US wage value. Work AI can already do covers 11.7% (MIT Project Iceberg).
- In every field AI takes the operational work first: the note before the diagnosis, first-pass review before the advice.
- In 94 of every 100 occupations, the work people hand to Claude shows more education than the task requires (Anthropic Economic Index).
{{< /highlight-box >}}

## Every job spec has a computational section

Anthropic and OpenAI now both employ a chief economist who actively measure the impact of AI on the labour market. Peter McCrory (Anthropic) told a Harvard forum this week that he wants to use [the tools of economics to help Anthropic understand the impact of its own decisions](https://www.thecrimson.com/article/2026/9/24/anthropic-economist-forum/).

Arvind Narayanan has made a careful case that [AI spreads slowly](https://knightcolumbia.org/content/ai-as-normal-technology), and he puts the adaptation at [a decade or two](https://www.normaltech.ai/p/what-will-be-left-for-us-to-work). But this is describing payroll data. Employers are rewriting roles the quarter they believe something; payrolls record it years later, once training and org design have caught up. The job specs are changing now, and not only in software.

| Discipline | Was | Becomes |
|------------|-----|---------|
| Science | Bench scientist | Autonomous lab supervisor |
| Software | Debugging | Mechanistic interpretability |
| Product | Product design | Agent behaviour |
| Legal | Practice innovation | Director of AI |
| Medicine | Medical scribe | Ambient recorder |

Every domain is swapping out what you could open and read for something you can only sample. A reviewable pull request becomes an {{< term name="eval" text="eval suite" def="A test suite for a model or agent: a fixed set of inputs plus a way of scoring the outputs, used to decide whether behaviour improved or regressed." >}}. A clinical note becomes a draft to check. Each one now has a computational role within.

Anthropic's interpretability team now recruits from [astronomy, physics, mathematics and biology](https://www.anthropic.com/research/team/interpretability) - the model stopped becoming a program to debug, it's now a specimen to study.

![François Chollet on 22 September 2026 quote-tweeting his own May 2021 prediction that nearly every branch of science would become a branch of computer science, with the comment that it is looking obvious by the day now. 869.6K views.](/images/roles-in-the-agent-era/chollet-quote-tweet.png)

Nathan Lambert describes [an environments industry](https://x.com/natolambert/status/2023549545045467615) where labs buy ten to twenty environments at a time for millions of dollars, and micro1 offers companies [$100k to $2M+](https://x.com/micro1_ai/status/2072800904332644429) for the anonymised operational data those environments are built from. Professional judgment is now in high-demand.

Indeed's Hiring Lab found AI-touched job titles [more common outside tech than inside it](https://www.hiringlab.org/2026/07/08/ai-is-no-longer-just-a-tech-occupation-story/) in five of six markets, with 63% of US AI-titled postings now outside tech occupations.

## No country for beginners

{{< highlight-box >}}
Job specs are changing years before the official stats reflect. In every field AI is starting with the operational work first. The entry role now asks for judgment.
{{< /highlight-box >}}

Hinton predicted in 2016 that AI would do a radiologist's job within five years, and he's since admitted he was wrong on the timing. He bet on the judgement, we saw the operational paperwork go first. Ambient scribes are now the most widely deployed generative AI in healthcare, cutting EHR time by [13.4 minutes a day](https://www.aha.org/aha-center-health-innovation-market-scan/2026-04-14-6-health-systems-enhancing-care-delivery-ambient-ai-scribes) across five academic centres, and the clinician now checks a draft that can invent a diagnosis.

Legal firms are moving from the pyramid to what iManage calls [the diamond](https://imanage.com/resources/resource-center/blog/how-law-firms-are-adapting-to-the-age-of-ai/), with fewer entry roles and a thicker middle of specialists and technologists.

Labs have automated routine work for decades, but ["humans were always pulling the strings. They were the ones developing the hypotheses and deciding which experiments were needed to test them. Now that paradigm is changing."](https://www.nature.com/collections/cgbiacfcgc)

Inside every field the sequencing looks similar - AI’s taking the operational work first and the decisions last. The cost of a wrong draft is cheap vs a wrong call. We’ve seen it in medicine and law, software handed over the code before the architecture; science is handing over the literature search and the experiments before the choice of what to test. Unfortunately the operational layer is where the juniors learn the judgement.

{{< chart min="540px" src="roles-in-the-agent-era/automation-gap.html" caption="Anthropic classifies each Claude conversation as automation or augmentation. In five fields of six, the support role sits further right than the professional one." >}}

Stanford finds employment for 22-25 year olds in the most AI-exposed occupations [down about 11% since late 2022](https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/), while the least exposed grew about 10%. [Ramp](https://ramp.com/data/heavy-ai-adopters-hire-more) joined its card-spend records to workforce data across 21,000 firms and found entry-level headcount up 12% at heavy AI adopters. The skills data is pointing the other way. Anthropic's own [economic index](https://www.anthropic.com/research/economic-index-june-2026-report) puts a number on the bar: across 718 occupations, the work people hand to Claude demonstrates about eight months more education than the task itself nominally requires, and that holds in 94 of every 100. The New York Fed's regional surveys describe AI's effect so far as [changing skill requirements rather than eliminating jobs](https://libertystreeteconomics.newyorkfed.org/2026/08/ais-impact-on-labor-and-hiring/).

## Why the official numbers can't see it yet?

Read the official statistics and it looks like none of this has happened and is in the future. Yale's Budget Lab finds [no link yet](https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market) between AI use and employment in the August 2026 survey data. But part of that silence is because Federal job statistics are still counted in the [2018 Standard Occupational Classification](https://www.bls.gov/soc/2028/2028_soc_revision.htm), fixed before ChatGPT existed. It has no code for an AI engineer, a forward deployed engineer or an interpretability researcher, and the 2028 revision won't be in use until 2028. When Yale says the occupational mix isn't changing, it's reporting the mix of categories frozen in 2018.

{{< chart src="roles-in-the-agent-era/soc-timeline.html" caption="No official code for an AI engineer until 2028." >}}

MIT's [Project Iceberg](https://iceberg.mit.edu/report.pdf) gets underneath the codes by counting skills. The technology roles the headlines cover account for 2.2% of US wage value, about $211 billion. Skills AI can already perform across administrative, financial and professional work account for 11.7%, about $1.2 trillion, and they're spread across every state.

## What to do before the data catches up

The entry job now demands judgement not execution skills. So who's going to be qualified to write the evals in 2035? The folks who start building judgment deliberately, coz the work that used to build it by accident is going first.

Narayanan, for all his caution about timing, agrees on the direction. He expects human effort to shift ["from building towards evaluation and monitoring"](https://icml.cc/virtual/2026/invited-talk/67274), with domain knowledge and normative judgment gaining in importance.

{{< chart src="roles-in-the-agent-era/checklist.html" >}}

Look down the 31 rows below and notice what isn't there: a job that simply vanished. Every row is a role that changed shape. The radiologist still reads, the lawyer still advises, the scientist still chooses the experiment. What moved is the operational half underneath them.

The work isn't disappearing, it's changing. Job specs are where you read that first; the official numbers will catch up in 2028. Don't wait for them.

{{< highlight-box title="Try it yourself" >}}
Anthropic's [Economic Scenarios explorer](https://www.anthropic.com/institute/econ-scenarios) lets you set capability and adoption assumptions and watch GDP, wages and labour share move. MIT CTL's [AI Labor Exposure Map](https://www.workanalyticslab.com/us-ai-map/) shows exposure by metro area, industry and job. MIT's [Iceberg Index](https://iceberg.mit.edu/report.pdf) is the skill-level report behind the 2.2% and the 11.7%.
{{< /highlight-box >}}

---

## Find your role

{{< chart src="roles-in-the-agent-era/taxonomy.html" caption="Filter by discipline or layer, or search for your own role. Every row links to its source." min="620px" fit="off" >}}
