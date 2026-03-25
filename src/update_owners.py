"""
Update ownership data for Pennsylvania thermal and renewable energy plants.
Verified via EIA records and industry sources as of 2025-2026.
"""

import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
THERMAL_PATH = os.path.join(BASE_DIR, "data", "pennsylvania_thermal_data.json")
RE_PATH = os.path.join(BASE_DIR, "data", "pennsylvania_re_data.json")

# =============================================================================
# THERMAL PLANT OWNER UPDATES
# Key: fac_id_eia -> new parent_company_name
# =============================================================================
THERMAL_UPDATES = {
    # Former GenOn / Heritage Power plants (restructured 2023-2024)
    3120: "Reorganized Heritage Power, LLC",       # Blossburg
    3109: "Reorganized Heritage Power, LLC",       # Hamilton (PA)
    3110: "Reorganized Heritage Power, LLC",       # Hunterstown (peaker units)
    3112: "Reorganized Heritage Power, LLC",       # Ortanna
    3113: "Reorganized Heritage Power, LLC",       # Portland (PA)
    3115: "Reorganized Heritage Power, LLC",       # Titus

    # Constellation Energy (former Exelon Generation, spun off 2022)
    3157: "Constellation Energy Corp",             # Chester Generating Station
    8012: "Constellation Energy Corp",             # Croydon CT Generating Station
    3160: "Constellation Energy Corp",             # Delaware Generating Station
    3162: "Constellation Energy Corp",             # Falls
    3163: "Constellation Energy Corp",             # Moser Generating Station
    3168: "Constellation Energy Corp",             # Richmond Generating Station
    3169: "Constellation Energy Corp",             # Schuylkill Generating Station
    3170: "Constellation Energy Corp",             # Southwark

    # Other verified updates
    62565: "Blackstone Energy Transition Partners", # Hill Top Energy Center (acquired from Ardian, Sep 2025)
    3152: "Capital Power Corporation",             # Sunbury Generation (site now houses Hummel Station, acquired from LS Power Jun 2025)
    3132: "Midwood Holdings",                      # Warren

    # Corrections from verification
    50279: "PEI Power Corp",                       # Archbald Power Station (not BP America)
    55976: "LS Power Development, LLC",            # Hunterstown Power Plant CCGT (acquired from Platinum Equity, Jul 2024)
    3122: "Knighthead Capital Management",         # Homer City (retired Jul 2023, site redevelopment)
    50776: "Bitfarms Ltd.",                        # Panther Creek Energy (Bitfarms acquired Stronghold Digital Mining, Mar 2025)
    50974: "Bitfarms Ltd.",                        # Scrubgrass Reclamation (same acquisition as Panther Creek)
    10870: "Vistra Corp",                          # Hazelton (Lotus/Starwood portfolio sold to Vistra, Oct 2025)
    55298: "Vistra Corp",                          # Fairless Energy Center (same Lotus portfolio sold to Vistra)
    58426: "Q-Generation, LLC",                    # Hamilton Patriot Generation (Carlyle sold to Q-Generation, late 2024)
    55690: "Constellation Energy Corp",            # Bethlehem Power Plant (Calpine acquired by Constellation Jan 2026)
    55524: "Constellation Energy Corp",            # York Energy Center (same Calpine/Constellation merger)
    61035: "Strategic Value Partners",             # Birdsboro Power (Sojitz sold to SVP, May 2025)
}

# =============================================================================
# RE PLANT OWNER UPDATES
# Key: fac_id_eia (string) -> new owner
# =============================================================================
RE_UPDATES = {
    # Plants previously listed as N/A or Unknown
    "us_re_plant_248": "AVANGRID, Inc.",                  # South Chestnut LLC
    "us_re_plant_395": "Lightsource BP",                  # PA Solar Park
    "us_re_plant_2057": "Lightsource BP",                 # Cottontail Solar 1
    "us_re_plant_2058": "Lightsource BP",                 # Cottontail Solar 2
    "us_re_plant_2059": "Lightsource BP",                 # Cottontail Solar 4
    "us_re_plant_2060": "Lightsource BP",                 # Cottontail Solar 5
    "us_re_plant_2061": "Lightsource BP",                 # Cottontail Solar 6
    "us_re_plant_2062": "Lightsource BP",                 # Cottontail Solar 8
    "us_re_plant_2221": "Oriden (Mitsubishi Heavy Industries)",  # Gans Solar
    "us_re_plant_2222": "Oriden (Mitsubishi Heavy Industries)",  # Pechin Solar
    "us_re_plant_2234": "Oriden (Mitsubishi Heavy Industries)",  # Listonburg Solar
    "us_re_plant_2479": "MN8 Energy LLC",                 # Spring Lane

    # Plants with outdated owners
    "us_re_plant_95":  "AVANGRID, Inc.",                  # Wind Park Bear Creek (Iberdrola acquired Infigen)
    "us_re_plant_1993": "BlackRock (via DSD Renewables)",  # CL-Viaduct LLC (BCD Project Holdings -> BlackRock)
    "us_re_plant_1995": "BlackRock (via DSD Renewables)",  # UN-School House LLC
    "us_re_plant_407": "LS Power Development, LLC",       # Sandy Ridge Wind Farm (Algonquin sold to LS Power, Jan 2025)
    "us_re_plant_2185": "LS Power Development, LLC",      # Sandy Ridge Wind 2 (same sale)
}


def update_thermal():
    """Update thermal plant ownership and return change summary."""
    with open(THERMAL_PATH, "r") as f:
        data = json.load(f)

    changes = []
    for plant in data:
        props = plant["properties"]
        fid = props["fac_id_eia"]
        if fid in THERMAL_UPDATES:
            old_owner = props["parent_company_name"]
            new_owner = THERMAL_UPDATES[fid]
            if old_owner != new_owner:
                props["parent_company_name"] = new_owner
                changes.append({
                    "plant": props["plant_name"],
                    "eia_id": fid,
                    "old": old_owner,
                    "new": new_owner,
                })

    with open(THERMAL_PATH, "w") as f:
        json.dump(data, f, indent=2)

    return changes


def update_re():
    """Update RE plant ownership and return change summary."""
    with open(RE_PATH, "r") as f:
        data = json.load(f)

    changes = []
    for plant in data:
        props = plant["properties"]
        fid = props["fac_id_eia"]
        if fid in RE_UPDATES:
            old_owner = props.get("owner", "N/A")
            new_owner = RE_UPDATES[fid]
            if old_owner != new_owner:
                props["owner"] = new_owner
                changes.append({
                    "plant": props["plant_name"],
                    "id": fid,
                    "old": old_owner,
                    "new": new_owner,
                })

    with open(RE_PATH, "w") as f:
        json.dump(data, f, indent=2)

    return changes


def main():
    print("=" * 80)
    print("PENNSYLVANIA POWER PLANT OWNERSHIP UPDATE")
    print("Verified as of 2025-2026")
    print("=" * 80)

    # Update thermal plants
    thermal_changes = update_thermal()
    print(f"\n--- THERMAL PLANTS: {len(thermal_changes)} changes ---")
    for c in thermal_changes:
        print(f"  {c['plant']} (EIA {c['eia_id']})")
        print(f"    OLD: {c['old']}")
        print(f"    NEW: {c['new']}")

    # Update RE plants
    re_changes = update_re()
    print(f"\n--- RE PLANTS: {len(re_changes)} changes ---")
    for c in re_changes:
        print(f"  {c['plant']} ({c['id']})")
        print(f"    OLD: {c['old']}")
        print(f"    NEW: {c['new']}")

    total = len(thermal_changes) + len(re_changes)
    print(f"\n{'=' * 80}")
    print(f"TOTAL CHANGES: {total} ({len(thermal_changes)} thermal, {len(re_changes)} RE)")
    print(f"{'=' * 80}")

    if total == 0:
        print("No changes were needed - all data is already up to date.")
    else:
        print("Data files updated successfully.")
        print(f"  Thermal: {THERMAL_PATH}")
        print(f"  RE:      {RE_PATH}")


if __name__ == "__main__":
    main()
