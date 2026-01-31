# Tasks Frontend — Per-Phase Files

This folder contains per-phase task documents and a small utility script to split `TASK_BREAKDOWN.md` into separate files.

Files generated:

- `PHASE_0_SETUP.md`
- `PHASE_1_UI_COMPONENTS.md`
- `PHASE_2_LANDING.md`
- `PHASE_3_HOME.md` (to be generated)
- `PHASE_4_HISTORY.md` (to be generated)
- `PHASE_5_GAME.md` (to be generated)

## How to run the splitter

1. Ensure Python 3.8+ is installed.
2. Run:

```bash
python split_tasks.py
```

This reads `TASK_BREAKDOWN.md` and writes files for each `## Phase` section.

---

**Status:** Generated initial phase files (0–2) and `split_tasks.py`. Run the script to (re)generate all phase files.