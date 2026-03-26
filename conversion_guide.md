# Indiana-to-Pennsylvania Conversion Guide

## Master Reference for Converting repower-indiana to repower-pennsylvania

This document provides file-by-file changes, new content, data file requirements, map configuration, and bug fixes needed to convert the Indiana surplus interconnection dashboard to Pennsylvania.

---

## SECTION A: File-by-File Changes

### A1. `package.json` (Line 2)
**Category:** TEXT_SWAP
**File:** `/src/../package.json`

| Line | Old Text | New Text |
|------|----------|----------|
| 2 | `"name": "repower-indiana"` | `"name": "repower-pennsylvania"` |

---

### A2. `src/app/layout.tsx` (Line 11)
**Category:** TEXT_SWAP
**File:** `src/app/layout.tsx`

| Line | Old Text | New Text |
|------|----------|----------|
| 11 | `title: "Surplus Interconnection in California",` | `title: "Surplus Interconnection in Pennsylvania",` |
| 13 | (description is fine as-is) | (no change needed) |

**Note:** This file has a bug -- it says "California" instead of "Indiana". For PA, fix it to "Pennsylvania".

---

### A3. `src/components/home/HeroSection.tsx`
**Category:** TEXT_SWAP + CONTENT_REWRITE
**File:** `src/components/home/HeroSection.tsx`

| Line | Old Text | New Text |
|------|----------|----------|
| 96 | `<span>in Indiana</span>` | `<span>in Pennsylvania</span>` |
| 135 | `href="https://gspp.berkeley.edu/assets/uploads/page/Surplus_Interconnection_California.pdf"` | `href="https://gspp.berkeley.edu/assets/uploads/page/Surplus_Interconnection_California.pdf"` (keep same or update to PA paper URL when available) |

---

### A4. `src/components/home/ProblemSolutionSection.tsx`
**Category:** CONTENT_REWRITE
**File:** `src/components/home/ProblemSolutionSection.tsx`

This file needs extensive content rewriting. Every Indiana-specific statistic and reference must be replaced with PA-specific data. See **Section B2** for the full replacement content.

| Line | Old Text | New Text |
|------|----------|----------|
| 109 | `Indiana's clean energy transition faces critical interconnection bottlenecks despite ambitious goals` | `Pennsylvania's clean energy transition faces critical interconnection bottlenecks as demand surges` |
| 204-209 | Indiana has ~24 GW... average connection timelines exceeding 6 years... | Pennsylvania has ~72 GW... See Section B2 |
| 242-248 | Indiana's electricity markets... MISO's summer 2025/26... PJM's 2026/27... | Pennsylvania faces PJM capacity crisis... See Section B2 |
| 281-286 | New gas plants ordered today... capital costs have surged... | Coal retirements accelerating... See Section B2 |
| 321-331 | Indiana faces growing economic development constraints... MISO and PJM territories... | Pennsylvania faces massive data center demand... See Section B2 |
| 397 | `Surplus Interconnection for Indiana` | `Surplus Interconnection for Pennsylvania` |
| 460-464 | Indiana can add 39 GW... ~21 GW at thermal plants... ~12 GW at renewable plants... ~6 GW of 6-hour battery storage | `[PIPELINE_RESULT]` GW... See Section B2 |
| 494-498 | $3.3 billion... $1,222 per Indiana household | `[PIPELINE_RESULT]` billion... `[PIPELINE_RESULT]` per Pennsylvania household |
| 527-534 | 12-18 months... MISO's process includes... | 12-18 months... PJM's reformed SIS process... See Section B2 |

---

### A5. `src/components/home/ApproachSection.tsx`
**Category:** CONTENT_REWRITE
**File:** `src/components/home/ApproachSection.tsx`

Every `thermalBenefits` and `renewableBenefits` array entry must be rewritten. See **Section B3** for the full replacement content.

**Thermal description paragraph (lines 215-220):**

Old:
```
Indiana has 21.6 GW of thermal capacity, with 3.1 GW operating at
less than 15% capacity factor (mostly gas peakers), leaving grid connections
idle most of the time. By 2030, building new solar will be cheaper than operating
18.5 GW (86%) of existing thermal plants, even without IRA tax credits. By co-locating
solar and wind at these sites, we can bypass lengthy interconnection queues and deploy
approximately 21 GW of clean energy using existing infrastructure.
```

New:
```
Pennsylvania has [PIPELINE_RESULT] GW of thermal capacity (excluding nuclear), with [PIPELINE_RESULT] GW operating at
less than 15% capacity factor (mostly gas peakers), leaving grid connections
idle most of the time. By 2030, building new solar will be cheaper than operating
[PIPELINE_RESULT] GW ([PIPELINE_RESULT]%) of existing thermal plants, even without IRA tax credits. By co-locating
solar and wind at these sites, we can bypass lengthy PJM interconnection queues and deploy
approximately [PIPELINE_RESULT] GW of clean energy using existing infrastructure.
```

**Renewable description paragraph (lines 493-498):**

Old:
```
Indiana's 5.8 GW of existing renewable capacity operates at low capacity
factors--solar at 13.2% and wind at 28.1%--meaning interconnection capacity
sits idle 86.8% and 71.9% of the time respectively. Adding approximately 6 GW
of 6-hour battery storage can enable an additional ~12 GW of renewable capacity
and dramatically increase capacity factors to 80.1% for solar and 81.1% for wind,
effectively turning variable renewables into firm power resources.
```

New:
```
Pennsylvania's [PIPELINE_RESULT] GW of existing renewable capacity operates at low capacity
factors--solar at [PIPELINE_RESULT]% and wind at [PIPELINE_RESULT]%--meaning interconnection capacity
sits idle [PIPELINE_RESULT]% and [PIPELINE_RESULT]% of the time respectively. Adding approximately [PIPELINE_RESULT] GW
of 6-hour battery storage can enable an additional ~[PIPELINE_RESULT] GW of renewable capacity
and dramatically increase capacity factors to [PIPELINE_RESULT]% for solar and [PIPELINE_RESULT]% for wind,
effectively turning variable renewables into firm power resources.
```

**thermalBenefits array (lines 49-80) -- replace all 5 entries:**
See Section B3 for full content.

**renewableBenefits array (lines 83-108) -- replace all 4 entries:**
See Section B3 for full content.

---

### A6. `src/components/thermal/ThermalDashboardContentGmap.tsx`
**Category:** DATA_SWAP + TEXT_SWAP
**File:** `src/components/thermal/ThermalDashboardContentGmap.tsx`

| Line | Old Text | New Text |
|------|----------|----------|
| 3 | `import plantsData from "@/data/indiana_thermal_data.json";` | `import plantsData from "@/data/pennsylvania_thermal_data.json";` |
| 53-56 | `lng: -87.424, lat: 39.924` | `lng: -77.80, lat: 40.88` |
| 63 | `apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,` | `apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,` (keep, but fix .env.local -- see Section E) |
| 86 | `fetch("/data/indiana_thermal_data.geojson")` | `fetch("/data/pennsylvania_thermal_data.geojson")` |
| 93 | `fetch("/data/indiana_map_boundary.geojson")` | `fetch("/data/pennsylvania_map_boundary.geojson")` |

---

### A7. `src/components/re/ReDashboardContentGMap.tsx`
**Category:** DATA_SWAP + TEXT_SWAP
**File:** `src/components/re/ReDashboardContentGMap.tsx`

| Line | Old Text | New Text |
|------|----------|----------|
| 3 | `import plantsData from "@/data/indiana_re_data.json";` | `import plantsData from "@/data/pennsylvania_re_data.json";` |
| 17-19 | `lng: -87.4886, lat: 40.69` | `lng: -77.80, lat: 40.88` |
| 27 | `apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,` | `apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,` (keep, but fix .env.local -- see Section E) |
| 50 | `fetch("/data/indiana_re_data.geojson")` | `fetch("/data/pennsylvania_re_data.geojson")` |
| 57 | `fetch("/data/indiana_map_boundary.geojson")` | `fetch("/data/pennsylvania_map_boundary.geojson")` |

---

### A8. `src/components/thermal/ThermalDashboardSidebar.tsx` (Line 66)
**Category:** TEXT_SWAP
**File:** `src/components/thermal/ThermalDashboardSidebar.tsx`

| Line | Old Text | New Text |
|------|----------|----------|
| 66 | `Surplus Interconnection Indiana` | `Surplus Interconnection Pennsylvania` |

---

### A9. `src/components/re/ReDashboardSidebar.tsx` (Line 62)
**Category:** TEXT_SWAP
**File:** `src/components/re/ReDashboardSidebar.tsx`

| Line | Old Text | New Text |
|------|----------|----------|
| 62 | `Surplus Interconnection Indiana` | `Surplus Interconnection Pennsylvania` |

---

### A10. `src/components/thermal/ThermalDashboardContent.tsx` (Mapbox fallback -- may not be actively used)
**Category:** DATA_SWAP
**File:** `src/components/thermal/ThermalDashboardContent.tsx`

| Line | Old Text | New Text |
|------|----------|----------|
| 3 | `import plantsData from "@/data/indiana_thermal_data.json";` | `import plantsData from "@/data/pennsylvania_thermal_data.json";` |
| 49 | `const LAYER_ID = "indiana_thermal_data-7lbvj8";` | `const LAYER_ID = "pennsylvania_thermal_data-XXXXX";` (update with actual Mapbox layer ID if used) |
| 50 | `const SOURCE_LAYER = "indiana_thermal_data-7lbvj8";` | `const SOURCE_LAYER = "pennsylvania_thermal_data-XXXXX";` |

---

### A11. `src/components/re/ReDashboardContent.tsx` (Mapbox fallback -- may not be actively used)
**Category:** DATA_SWAP
**File:** `src/components/re/ReDashboardContent.tsx`

| Line | Old Text | New Text |
|------|----------|----------|
| 3 | `import plantsData from "@/data/indiana_re_data.json";` | `import plantsData from "@/data/pennsylvania_re_data.json";` |
| 49 | `const LAYER_ID = "indiana_re_data-bcp7cj";` | `const LAYER_ID = "pennsylvania_re_data-XXXXX";` |
| 50 | `const SOURCE_LAYER = "indiana_re_data-bcp7cj";` | `const SOURCE_LAYER = "pennsylvania_re_data-XXXXX";` |

---

### A12. `src/components/dashboard/ThermalDashboard.tsx` (Older dashboard component)
**Category:** DATA_SWAP
**File:** `src/components/dashboard/ThermalDashboard.tsx`

| Line | Old Text | New Text |
|------|----------|----------|
| 3 | `import plantsData from "@/data/indiana_thermal_data.json";` | `import plantsData from "@/data/pennsylvania_thermal_data.json";` |

---

### A13. `.env.local`
**Category:** BUG FIX (see Section E)
**File:** `.env.local`

Add a line so the variable name matches what the code expects:
```
NEXT_PUBLIC_GOOGLE_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

---

## SECTION B: New Website Content

### B1. HeroSection Content

**Title (3 lines):**
```
Surplus
Interconnection
in Pennsylvania
```

**Subtitle:**
```
Accelerating Clean Energy Deployment by Leveraging Existing Grid Infrastructure
```

**CTA Buttons:** Keep "Working Paper", "Factsheet", "Explore Dashboard" (update URLs when PA-specific documents are available).

---

### B2. ProblemSolutionSection Content

#### Overview Statement
```
Pennsylvania's clean energy transition faces critical interconnection bottlenecks as demand from data centers and electrification surges
```

#### Problem Card 1: Interconnection Delays
```
Pennsylvania has ~72 GW of active projects in PJM's interconnection queue,
with average connection timelines exceeding 5 years --
over 4 years to reach interconnection agreement, plus 1-2 years for construction.
PJM's queue is dominated by 32 GW of solar and 15 GW of storage projects waiting for Pennsylvania alone.
```

Key numbers:
- ~72 GW in PJM queue for PA (PJM State Infrastructure Report 2024)
- 5+ years average timeline
- 32 GW solar, 15 GW storage in queue

#### Problem Card 2: Tightening Supply Conditions
```
Pennsylvania's electricity markets face historic capacity challenges.
PJM's 2026/27 capacity auction cleared at the FERC-approved price cap of $329.17/MW-day
(an 833% increase from prior years), while the 2025/26 auction cleared at $269.92/MW-day.
Residential electricity rates have risen 45% since 2020 to approximately $0.19/kWh,
reflecting accelerating demand growth from data centers and electrification alongside thermal plant retirements.
```

Key numbers:
- $329.17/MW-day PJM 2026/27 (at cap, 833% increase)
- $269.92/MW-day PJM 2025/26
- 45% rate increase since 2020
- ~$0.19/kWh residential average

#### Problem Card 3: Retiring Capacity & Supply Gap
**Title change:** "New Gas Supply Challenges" -> "Retiring Capacity & Supply Gap"
```
Pennsylvania faces accelerating coal plant retirements creating a critical capacity gap.
Montour is converting to gas by end of 2025, while Keystone (1,711 MW) and
Conemaugh (1,711 MW) -- together totaling 3.4 GW -- are scheduled for retirement by 2028.
New gas plants ordered today won't come online until 2030-2031 at earliest,
and capital costs have surged to $2,000/kW or more for combined-cycle projects,
making new gas generation increasingly expensive as a response to growing electricity demand.
```

Key numbers:
- 3.4 GW of coal retiring by 2028 (Keystone + Conemaugh)
- Montour converting to gas by end 2025
- New gas CCGT costs $2,000+/kW

#### Problem Card 4: Economic Opportunity Loss
```
Pennsylvania faces massive economic development demand as
U.S. electricity demand is projected to increase 25% by 2030 and 78% by 2050,
driven by data centers, AI infrastructure, and industrial electrification. With
power availability now the primary site selection factor
for data centers, Pennsylvania is attracting unprecedented investment --
Amazon is investing $20 billion (the largest private investment in PA history),
Microsoft backed a $6 billion CoreWeave data center and is restarting Three Mile Island,
and Meta is developing multi-gigawatt clusters. However, extended PJM interconnection timelines
and tightening capacity conditions limit the state's ability to deliver power fast enough.
```

Key numbers:
- Amazon: $20B investment in PA
- Microsoft: $6B CoreWeave + TMI restart
- Meta: multi-GW clusters
- 25% demand increase by 2030

#### Solution Card: Surplus Interconnection for Pennsylvania

**Title:**
```
Surplus Interconnection for Pennsylvania
```

**Description:**
```
Surplus Interconnection Service allows new electricity
supply resources to connect to the grid using existing
infrastructure that serves already operating generators,
without exceeding the total output capacity already
allocated to the existing resource. FERC Order 845 (2018)
cleared a regulatory pathway for generators to add new
electricity resources to the grid by utilizing surplus
capacity at existing interconnection points.
```
(This paragraph is generic/federal -- keep as-is.)

**Key Results - Available Surplus Capacity:**
```
Pennsylvania can add [PIPELINE_RESULT] GW of
clean energy capacity through surplus interconnection,
including ~[PIPELINE_RESULT] GW at thermal plants ([PIPELINE_RESULT] GW solar + [PIPELINE_RESULT] GW wind) and ~[PIPELINE_RESULT] GW at renewable plants
enabled by ~[PIPELINE_RESULT] GW of 6-hour battery storage -- all at existing sites without new transmission.
```

**Key Results - Cost Savings:**
```
Surplus interconnection can save
[PIPELINE_RESULT] billion in
interconnection costs by leveraging existing infrastructure, equivalent to
[PIPELINE_RESULT] per Pennsylvania household. This conservative estimate
only accounts for interconnection savings -- additional benefits from co-location and transmission
utilization would increase total savings significantly.
```

Note: PA has approximately 5.3 million households. Calculate per-household savings as: total_savings / 5,300,000.

**Key Results - Fast Deployment:**
```
Surplus interconnection projects can be completed in
12-18 months compared to
4-5 years for
standard queue projects. PJM's reformed SIS process (FERC-approved February 2025, effective March 2025)
explicitly allows new generators to use existing facility's unused interconnection capability
where no network upgrades are triggered -- enabling rapid deployment.
```

---

### B3. ApproachSection Content

#### Thermal Interconnections Description Paragraph
```
Pennsylvania has [PIPELINE_RESULT] GW of thermal capacity (excluding nuclear), with [PIPELINE_RESULT] GW operating at
less than 15% capacity factor (mostly gas peakers), leaving grid connections
idle most of the time. By 2030, building new solar will be cheaper than operating
[PIPELINE_RESULT] GW ([PIPELINE_RESULT]%) of existing thermal plants, even without IRA tax credits. By co-locating
solar and wind at these sites, we can bypass PJM's lengthy interconnection queue and deploy
approximately [PIPELINE_RESULT] GW of clean energy using existing infrastructure.
```

#### thermalBenefits Array (5 entries)
```javascript
const thermalBenefits = [
    {
      title: "Abundant Local Resources",
      subtitle: "~[PIPELINE_RESULT] GW Potential",
      description:
        "Over [PIPELINE_RESULT] GW of combined solar and wind potential exists within 6 miles of Pennsylvania's thermal plants. This enormous renewable resource can enable clean energy deployment at existing interconnection points.",
    },
    {
      title: "Urban Area Plants",
      subtitle: "[PIPELINE_RESULT] GW Capacity",
      description:
        "[PIPELINE_RESULT] thermal facilities ([PIPELINE_RESULT]% of total) with [PIPELINE_RESULT] GW capacity are located in urban areas. We removed these plants from the surplus interconnection analysis though they are great candidates for adding battery storage after the thermal plants get retired.",
    },
    {
      title: "Economic Crossover",
      subtitle: "[PIPELINE_RESULT] GW by 2030",
      description:
        "By 2030, building new solar will be cheaper than operating [PIPELINE_RESULT] GW of Pennsylvania's existing thermal plants ([PIPELINE_RESULT]% of total thermal capacity), even without IRA tax credits. Currently, solar is already cost-competitive with [PIPELINE_RESULT] GW of thermal capacity.",
    },
    {
      title: "Total RE Integration Potential",
      subtitle: "~[PIPELINE_RESULT] GW by 2030",
      description:
        "Approximately [PIPELINE_RESULT] GW of total renewable energy (~[PIPELINE_RESULT] GW solar + ~[PIPELINE_RESULT] GW wind) can be economically integrated at Pennsylvania thermal plants by 2030, using existing grid connections and avoiding lengthy queue delays.",
    },
    {
      title: "Quick Wins Available",
      subtitle: "[PIPELINE_RESULT] GW Ready",
      description:
        "[PIPELINE_RESULT] GW of thermal capacity operates at less than 15% capacity factor, and [PIPELINE_RESULT]% of Pennsylvania's thermal capacity operates below 30% CF, creating immediate opportunities for surplus interconnection.",
    },
  ];
```

#### Renewable Interconnections Description Paragraph
```
Pennsylvania's [PIPELINE_RESULT] GW of existing renewable capacity operates at low capacity
factors -- solar at [PIPELINE_RESULT]% and wind at [PIPELINE_RESULT]% -- meaning interconnection capacity
sits idle [PIPELINE_RESULT]% and [PIPELINE_RESULT]% of the time respectively. Adding approximately [PIPELINE_RESULT] GW
of 6-hour battery storage can enable an additional ~[PIPELINE_RESULT] GW of renewable capacity
and dramatically increase capacity factors to [PIPELINE_RESULT]% for solar and [PIPELINE_RESULT]% for wind,
effectively turning variable renewables into firm power resources.
```

#### renewableBenefits Array (4 entries)
```javascript
const renewableBenefits = [
    {
      title: "Renewable Resource Potential",
      subtitle: "~[PIPELINE_RESULT] GW Total",
      description:
        "Pennsylvania's existing renewable sites have approximately [PIPELINE_RESULT] GW of combined solar and wind resource potential within 6 miles of existing RE plants, representing enormous opportunity for expansion.",
    },
    {
      title: "Battery Storage Integration",
      subtitle: "~[PIPELINE_RESULT] GW of 6-Hour Storage",
      description:
        "Adding approximately [PIPELINE_RESULT] GW of 6-hour battery storage at Pennsylvania's solar and wind sites would deliver firm, dispatchable capacity - helping meet peak demand and enhance grid reliability.",
    },
    {
      title: "Additional RE Capacity",
      subtitle: "~[PIPELINE_RESULT] GW Enabled",
      description:
        "Pennsylvania's existing renewable interconnections can support an additional ~[PIPELINE_RESULT] GW of renewable capacity when paired with ~[PIPELINE_RESULT] GW of 6-hour battery storage, with no new grid connections required.",
    },
    {
      title: "Maximized Utilization",
      subtitle: "[PIPELINE_RESULT]% Solar | [PIPELINE_RESULT]% Wind",
      description:
        "Deploying storage and additional renewables at existing interconnections dramatically improves capacity factors to [PIPELINE_RESULT]% for solar and [PIPELINE_RESULT]% for wind plants. This transforms intermittent renewables into firm resources comparable to gas CCGT plants.",
    },
  ];
```

---

## SECTION C: New Data Files Needed

All these files are generated by the `dashboard_data_pennsylvania.py` pipeline (or equivalent) from the input_data directory.

### C1. JSON Data Files (placed in `src/data/`)

| Old File | New File | Generated By |
|----------|----------|-------------|
| `indiana_thermal_data.json` | `pennsylvania_thermal_data.json` | `dashboard_data_pennsylvania.py` thermal output |
| `indiana_re_data.json` | `pennsylvania_re_data.json` | `dashboard_data_pennsylvania.py` RE output |

These JSON files contain plant-level properties used by the sidebar filters and stat cards. The structure should be identical (same property names), just with PA plant data.

### C2. GeoJSON Data Files (placed in `public/data/`)

| Old File | New File | Generated By |
|----------|----------|-------------|
| `indiana_thermal_data.geojson` | `pennsylvania_thermal_data.geojson` | `dashboard_data_pennsylvania.py` thermal GeoJSON output |
| `indiana_re_data.geojson` | `pennsylvania_re_data.geojson` | `dashboard_data_pennsylvania.py` RE GeoJSON output |
| `indiana_map_boundary.geojson` | `pennsylvania_map_boundary.geojson` | State boundary GeoJSON for PA |

These GeoJSON files are loaded by the Google Maps dashboard to render plant markers and the state boundary outline.

### C3. Pennsylvania State Boundary GeoJSON

The boundary GeoJSON for Pennsylvania can be obtained from:
- US Census Bureau TIGER/Line shapefiles (convert to GeoJSON)
- `github.com/johan/world.geo.json` repository
- Natural Earth data

It should be a single Feature or FeatureCollection with the PA state polygon, matching the same structure as `indiana_map_boundary.geojson`.

### C4. Data Property Schema

The JSON and GeoJSON files must maintain the same property schema as the Indiana files. Key properties for thermal:
- `fac_id_eia`, `eia_unit_id`, `plant_name`, `state`, `county`
- `utility_name_eia_pudl`, `rto_name`, `parent_company_name`
- `total_plant_capacity`, `technology`, `capacity_mw`
- `estimated_vc`, `capacity_factor`
- `solar_crossover_year`, `wind_crossover_year`
- `install_solar_capacity_mw_2030`, `install_wind_capacity_mw_2030`
- `install_solar_capacity_mw_2030_woIRA`, `install_wind_capacity_mw_2030_woIRA`
- `solar_lcoe_2024`, `wind_lcoe_2024`
- `solar_lcoe_2025_wIRA`, `wind_lcoe_2025_wIRA`
- `urban_area_perc`

Key properties for RE:
- `fac_id_eia`, `plant_name`, `county`, `owner`
- `technology` (values: "Solar", "Wind")
- `capacity_mw`, `current_cf`, `optimal_cf`
- `optimal_solar_mw`, `optimal_wind_mw`
- `optimal_battery_mw`, `optimal_battery_mwh`
- `solar_lcoe_2025_wIRA`, `wind_lcoe_2025_wIRA`

---

## SECTION D: Map Configuration

### D1. Map Center Coordinates

| Dashboard | Old Center (Indiana) | New Center (Pennsylvania) |
|-----------|---------------------|--------------------------|
| Thermal | lat: 39.924, lng: -87.424 | lat: 40.88, lng: -77.80 |
| Renewable | lat: 40.69, lng: -87.4886 | lat: 40.88, lng: -77.80 |

Pennsylvania geographic center: approximately 40.88N, -77.80W (near State College, PA).

### D2. Zoom Level

| Setting | Old Value | New Value | Rationale |
|---------|-----------|-----------|-----------|
| defaultMapZoom | 7 | 7 | PA is wider (310 miles E-W) but shorter (180 miles N-S) than Indiana (160x270). Zoom 7 should work well. If PA appears too zoomed, try 6.5 or 7. |

### D3. Map ID
The `defaultMapId` value (`181f71e9733811c528a5235f`) is a Google Maps Cloud Style ID. This controls the map visual styling and is not state-specific. **Keep the same value** unless you want a different map theme.

### D4. Boundary File Reference

| Dashboard | Old Path | New Path |
|-----------|----------|----------|
| Thermal | `/data/indiana_map_boundary.geojson` | `/data/pennsylvania_map_boundary.geojson` |
| Renewable | `/data/indiana_map_boundary.geojson` | `/data/pennsylvania_map_boundary.geojson` |

---

## SECTION E: Bug Fixes

### E1. `.env.local` Variable Name Mismatch

**Bug:** The `.env.local` file defines `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` but the code in both `ThermalDashboardContentGmap.tsx` (line 63) and `ReDashboardContentGMap.tsx` (line 27) references `process.env.NEXT_PUBLIC_GOOGLE_API_KEY`.

**Fix Option 1 (Recommended):** Add the correctly-named variable to `.env.local`:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_GOOGLE_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

**Fix Option 2:** Change the code references from `NEXT_PUBLIC_GOOGLE_API_KEY` to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in:
- `src/components/thermal/ThermalDashboardContentGmap.tsx` line 63
- `src/components/re/ReDashboardContentGMap.tsx` line 27

### E2. Layout.tsx "California" Reference

**Bug:** `src/app/layout.tsx` line 11 says "Surplus Interconnection in California" -- this is a leftover from the original California version that was never updated for Indiana.

**Fix:** Change to `"Surplus Interconnection in Pennsylvania"` for the PA version.

### E3. Mapbox Token Check in ThermalDashboardContentGmap.tsx

**Note:** Lines 12-15 of `ThermalDashboardContentGmap.tsx` check for a Mapbox token and throw an error if missing. However, this component uses Google Maps, not Mapbox. The token check is harmless if the env var is set, but it should ideally be removed since the Google Maps version doesn't use Mapbox. This is a cosmetic issue, not blocking.

---

## SECTION F: PA-Specific Research Data (from Gemini)

These numbers can be used for the website content where `[PIPELINE_RESULT]` is not available from the data pipeline.

### F1. Pennsylvania Energy Profile

| Metric | Value | Source |
|--------|-------|--------|
| Total installed capacity | 48,856 MW (net summer) | EIA 2024 |
| Thermal capacity (non-nuclear) | ~17,900 MW gas + ~2,400 MW coal + ~800 MW oil = ~21,100 MW | EIA 2024 |
| Nuclear capacity | ~9,500 MW (4 plants, 8 units) | EIA 2024 |
| Renewable capacity | ~3,400 MW (1.4 GW wind, 1.1 GW solar, 0.9 GW hydro) | EIA 2024 |
| PA households | ~5.3 million | US Census |
| Number of thermal plants | ~82 (64 gas, 14 coal, 4 nuclear) | EIA |
| Number of renewable plants | ~57+ (26 wind, 17 hydro, 14+ solar) | EIA |

### F2. PJM Market Data (2024-2026)

| Metric | Value | Source |
|--------|-------|--------|
| PJM 2025/26 capacity price | $269.92/MW-day | PJM RPM results |
| PJM 2026/27 capacity price | $329.17/MW-day (at cap) | PJM RPM results |
| Price increase | 833% from prior years | PJM |
| PA interconnection queue | ~72 GW active | PJM State Infrastructure Report 2024 |
| Queue composition | 32 GW solar, 15 GW storage | PJM |
| Typical interconnection wait | 5+ years | LBNL Queued Up |

### F3. PA Electricity Rates

| Metric | Value | Source |
|--------|-------|--------|
| Residential rate (2025) | ~$0.19/kWh | NuWatt Energy / PA PUC |
| Rate increase since 2020 | ~45% | PA PUC 2025 Report |
| Above national average | +6% | EIA |

### F4. Coal Plant Retirements

| Plant | Capacity | Status | Source |
|-------|----------|--------|--------|
| Montour | ~1,500 MW | Converting to gas by end 2025 | EHN.org |
| Keystone | 1,711 MW | Retirement by 2028 | PennFuture |
| Conemaugh | 1,711 MW | Retirement by 2028 | PennFuture |

### F5. Data Center Investments

| Company | Investment | Details | Source |
|---------|-----------|---------|--------|
| Amazon | $20 billion | Largest private investment in PA history; co-located with Susquehanna nuclear | PA.gov / AboutAmazon |
| Microsoft | $6 billion | CoreWeave data center (Lancaster); restarting Three Mile Island for AI power | Microsoft/Constellation Deal 2024 |
| Meta | Multi-GW | Prometheus and Hyperion clusters focused on PA | Meta announcements |

### F6. PJM SIS Process (for "Fast Deployment" card)

- FERC approved PJM's SIS streamlining proposals in February 2025 (effective March 7, 2025)
- PJM's reformed process explicitly allows new generators to use existing facility's unused interconnection capability where no network upgrades are triggered
- Typical SIS timeline: 12-18 months when no upgrades needed, vs. 4-5+ years in standard queue
- Source: PJM Inside Lines, FERC filings

---

## SECTION G: Complete File Change Summary

### Files to Modify (13 total)

| # | File | Change Type | Priority |
|---|------|-------------|----------|
| 1 | `package.json` | TEXT_SWAP | Low |
| 2 | `src/app/layout.tsx` | TEXT_SWAP + BUG_FIX | High |
| 3 | `src/components/home/HeroSection.tsx` | TEXT_SWAP | High |
| 4 | `src/components/home/ProblemSolutionSection.tsx` | CONTENT_REWRITE | High |
| 5 | `src/components/home/ApproachSection.tsx` | CONTENT_REWRITE | High |
| 6 | `src/components/thermal/ThermalDashboardContentGmap.tsx` | DATA_SWAP | High |
| 7 | `src/components/re/ReDashboardContentGMap.tsx` | DATA_SWAP | High |
| 8 | `src/components/thermal/ThermalDashboardSidebar.tsx` | TEXT_SWAP | Medium |
| 9 | `src/components/re/ReDashboardSidebar.tsx` | TEXT_SWAP | Medium |
| 10 | `src/components/thermal/ThermalDashboardContent.tsx` | DATA_SWAP | Low (Mapbox fallback) |
| 11 | `src/components/re/ReDashboardContent.tsx` | DATA_SWAP | Low (Mapbox fallback) |
| 12 | `src/components/dashboard/ThermalDashboard.tsx` | DATA_SWAP | Low (Older component) |
| 13 | `.env.local` | BUG_FIX | High |

### New Files to Create (5 total)

| # | File | Source |
|---|------|--------|
| 1 | `src/data/pennsylvania_thermal_data.json` | Data pipeline output |
| 2 | `src/data/pennsylvania_re_data.json` | Data pipeline output |
| 3 | `public/data/pennsylvania_thermal_data.geojson` | Data pipeline output |
| 4 | `public/data/pennsylvania_re_data.geojson` | Data pipeline output |
| 5 | `public/data/pennsylvania_map_boundary.geojson` | State boundary source |

### Files that DON'T need changes
- `src/app/page.tsx` -- no state-specific content
- `src/app/theme.ts` -- visual theme, no state references
- `src/components/hooks/useGoogleMap.ts` -- generic hook, no state references
- `src/types/plant.ts` -- generic type definitions
- `src/app/globals.css` -- no state references
- All filter components (`ThermalDashboardFilters`, `ReDashboardFilters`) -- filter dynamically from data
- All stat card components (`ThermalStatCards`, `ReStatCards`) -- compute from data

---

## SECTION H: Execution Order

1. **Generate PA data files** (pipeline must run first):
   - Run `dashboard_data_pennsylvania.py` to produce thermal and RE JSON + GeoJSON
   - Obtain PA boundary GeoJSON

2. **Place data files:**
   - Copy `pennsylvania_thermal_data.json` and `pennsylvania_re_data.json` to `src/data/`
   - Copy `pennsylvania_thermal_data.geojson`, `pennsylvania_re_data.geojson`, `pennsylvania_map_boundary.geojson` to `public/data/`

3. **Apply simple text swaps** (A1, A2, A3, A6, A7, A8, A9, A10, A11, A12):
   - "Indiana" -> "Pennsylvania" everywhere
   - Data file references: `indiana_*` -> `pennsylvania_*`
   - Map coordinates: Indiana center -> PA center

4. **Fix bugs** (A13/E1, E2):
   - Add `NEXT_PUBLIC_GOOGLE_API_KEY` to `.env.local`
   - Fix "California" in layout.tsx

5. **Rewrite content** (A4, A5):
   - Update ProblemSolutionSection with PA-specific content (Section B2)
   - Update ApproachSection with PA-specific content (Section B3)
   - Fill in `[PIPELINE_RESULT]` placeholders with actual numbers from pipeline output

6. **Test:**
   - `npm run dev` and verify homepage loads with PA content
   - Verify thermal dashboard shows PA plants on PA map
   - Verify RE dashboard shows PA plants on PA map
   - Verify filters work with PA data
   - Verify popups show correct plant details

---

## SECTION I: Content Files to Update

### website_content.txt
Update with PA-specific content mirroring the structure but with Pennsylvania data. This is a reference file, not used by the app directly.

### public/homepage.txt
Update with PA-specific research and website copy. This is a reference file, not used by the app directly.

---

*End of conversion guide.*
