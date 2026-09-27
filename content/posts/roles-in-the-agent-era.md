---
title: "The Jobs They Are A-Changin'"
date: 2026-09-26T09:00:00
author: mercurialsolo
tags: [ai, agents, work, labor, org-design, evals]
summary: "AI is taking the operational work first, and the operational work is where judgement got learned. The entry rung now asks for what the entry rung used to teach."
ShowToc: true
TocOpen: false
---

> *Come gather 'round people, wherever you roam*<br>
> *And admit that the waters around you have grown*

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/52vA3CYKZqZVdQnzRrdZt6?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

{{< highlight-box title="In brief" >}}
- In every field AI takes the operational layer first and the decision layer last.
- The operational layer is where people learned to make the decisions.
- The US has no official job code for an AI engineer. The official stats are outdated.
{{< /highlight-box >}}

## Every job spec has a computational section

Arvind Narayanan made a careful case that [AI spreads slowly](https://knightcolumbia.org/content/ai-as-normal-technology), and he put the adaptation at [1-2 decades](https://www.normaltech.ai/p/what-will-be-left-for-us-to-work). But this was based on the payroll data. Employers are rewriting roles the moment they believe something; payrolls change this in their job titles years later, once training and org design have caught up. The job specs are changing in real time, and not only in the tech industry.

Every domain is swapping out what you could open and read for something you can only sample. A reviewable pull request becomes an eval suite: a fixed set of inputs, a way of scoring the outputs, and a judgement call about whether the score is good enough. A clinical note becomes a draft to check. Each role now embeds a computational one.

When the artifacts were readable, a junior was useful because reading it end to end carefully was the work; when it can only be sampled, the job is knowing which samples matter and whether the answer/thesis is right.

| Discipline | Handed to AI first | Left to people, now the entry bar |
|------------|--------------------|-----------------------------------|
| Science | Literature search, bench work | Choosing which hypothesis to test |
| Medicine | Writing the note | Catching the invented diagnosis |
| Law | First-pass document review | The advice |
| Software | Writing the code | The architecture, and the eval |

Anthropic's interpretability team recruits from [astronomy, physics, mathematics and biology](https://www.anthropic.com/research/team/interpretability) - the model stopped being a program to debug, it's now a specimen to study. François Chollet called this in 2021: nearly every branch of science would become a branch of computer science. It got him enormous pushback at the time.

{{< x user="fchollet" id="2102444225443029100" >}}

The [environments industry](https://x.com/natolambert/status/2023549545045467615) where labs buy ten to twenty environments at a time is now worth several hundreds of millions of dollars. micro1 offers companies [$100k to $2M+](https://x.com/micro1_ai/status/2072800904332644429) for the anonymised operational data to build these environments. Labs are paying for recordings of what experts actually do - judgement is the training data now.

## No country for beginners

In 2016 Hinton had predicted that AI would do a radiologist's job within five years. He bet on the judgement, what we have seen since is the operational paperwork go first. Kaiser Permanente's medical group put ambient scribes in front of [7,260 physicians across 2.58 million encounters](https://catalyst.nejm.org/doi/full/10.1056/CAT.25.0040) in fifteen months, cutting EHR time by [13.4 minutes a day](https://www.aha.org/aha-center-health-innovation-market-scan/2026-04-14-6-health-systems-enhancing-care-delivery-ambient-ai-scribes), and the clinician now checks a draft that can invent a diagnosis.

Legal firms are moving from the pyramid to [a diamond](https://imanage.com/resources/resource-center/blog/how-law-firms-are-adapting-to-the-age-of-ai/), with fewer entry roles and a thicker middle of specialists and technologists.

Labs have automated routine work for decades, but ["humans were always pulling the strings... Now that paradigm is changing."](https://www.nature.com/collections/cgbiacfcgc)

Inside every field the sequencing's similar: AI's taking the operational work first and the decisions last, because the cost of a wrong draft is cheap against the cost of a wrong call. However, we develop judgement only by doing the work.

{{< chart min="540px" src="roles-in-the-agent-era/automation-gap.html" caption="Anthropic classifies each Claude conversation as automation, where the model does the task, or augmentation, where a person works through it. In five fields of six, the support role has the higher automation share." >}}

The obvious objection: surgeons train on simulators, so why can't a junior learn judgement by reviewing fifty AI drafts a day instead of writing five by hand? They can, and reviewing is the new doing. But a simulator is deliberate: someone chose the cases, set the difficulty and told you when you were wrong. 50 drafts a day gives you the volume but not the feedback, nobody's telling you which of the 50 you got wrong. Narayanan, for all his caution about timing, expects human effort to shift ["from building towards evaluation and monitoring"](https://icml.cc/virtual/2026/invited-talk/67274). The rung can be rebuilt but not by itself.

Stanford finds employment for 22-25 year olds in the most AI-exposed occupations [down about 11% since late 2022](https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/), while the least exposed grew about 10%. [Ramp](https://ramp.com/data/heavy-ai-adopters-hire-more) joined its card-spend records to workforce data across 21,000 firms and found entry-level headcount up 12% at heavy AI adopters. They count different things: Ramp measures firms, Stanford measures occupations, and a heavy-adopting firm can hire more juniors into jobs that no longer resemble the old junior job. My reading is that both are right and the count is the wrong instrument. Anthropic's own [economic index](https://www.anthropic.com/research/economic-index-june-2026-report) measures the content instead: across 718 occupations, the work people hand to Claude demonstrates about eight months more education than the task nominally requires, in 94 of every 100. Headcount held. The bar moved.

Indeed's Hiring Lab found AI-touched job titles [more common outside tech than inside it](https://www.hiringlab.org/2026/07/08/ai-is-no-longer-just-a-tech-occupation-story/) in five of six markets, with 63% of US AI-titled postings now outside tech occupations.

## Why the official numbers can't see it yet

Read the official statistics and it looks like none of this has happened and is in the future. Yale's Budget Lab finds [no link yet](https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market) between AI use and employment in the August 2026 survey data. But part of that silence is because Federal job statistics are still counted in the [2018 Standard Occupational Classification](https://www.bls.gov/soc/2018/home.htm). It has no code for an AI engineer, a forward deployed engineer or an interpretability researcher, and the [next version](https://www.bls.gov/soc/2028/2028_soc_revision.htm) isn't in until 2028. When Yale says the occupational mix isn't changing, it's reporting on roles defined a decade ago.

{{< chart src="roles-in-the-agent-era/soc-timeline.html" caption="The 2018 codes are still in force. There is no official code for an AI engineer until the 2028 revision." >}}

Both Anthropic and OpenAI now employ a chief economist, because the public statistics can't measure what they are doing to the labour market. Peter McCrory (Anthropic) told a Harvard forum this week that he wants to use [the tools of economics to help Anthropic understand the impact of its own decisions](https://www.thecrimson.com/article/2026/9/24/anthropic-economist-forum/).

MIT's [Project Iceberg](https://iceberg.mit.edu/report.pdf) gets underneath the codes by counting skills instead. Visible AI adoption, the technology roles the headlines cover, is 2.2% of US wage value, about $211 billion. Skills AI can already perform across administrative, financial and professional work are 11.7%, about $1.2 trillion, spread across every state.

## What to do before the data catches up

{{< highlight-box >}}
The radiologist still reads, the lawyer still advises, the scientist still selects the experiment. The work's not disappearing, it's changing, and the job specs are where you are going to see it first.
{{< /highlight-box >}}

The entry job now demands judgement, not execution. So who's going to be qualified to write the evals in 2035? The folks who start building judgement deliberately, because the work that used to build it by accident is disappearing fast.

Three moves, whichever side of the rung you are on. Take the review and sign-off seat early, unglamorous as it is, because that is where the judgement now sits. Write the evals for AI output in your own field: whoever defines what counts as good owns the role that checks it. And keep some operational reps by hand, as training rather than production, for the reason a pilot still flies the sim.

{{< chart src="roles-in-the-agent-era/checklist.html" caption="Three moves each for people already working and for people still studying. Ticks save in your own browser." >}}

Dylan's warning was aimed at the people who could see the water rising and kept standing where they were. The rung is going in plain sight, on a published schedule. The list above is what swimming looks like.

{{< highlight-box title="Try it yourself" >}}
Anthropic's [Economic Scenarios explorer](https://www.anthropic.com/institute/econ-scenarios) lets you set capability and adoption assumptions and watch GDP, wages and labour share move. MIT CTL's [AI Labor Exposure Map](https://www.workanalyticslab.com/us-ai-map/) shows exposure by metro area, industry and job. MIT's [Iceberg Index](https://iceberg.mit.edu/report.pdf) is the skill-level report behind the 2.2% and the 11.7%.
{{< /highlight-box >}}

---

## Find your role

{{< chart src="roles-in-the-agent-era/taxonomy.html" caption="31 roles across six disciplines. Layer is the argument: operational work goes to AI first, decision work last, and structural means the shape of the job itself changed. Filter or search, and every row links to its source." min="620px" fit="off" >}}
