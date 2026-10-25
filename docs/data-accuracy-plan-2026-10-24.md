# Data accuracy repair

Implement source-coordinate selection before further visual polish.

- Replace rank-distributed XYZ for identity-only western samples with no seat coordinate. Matching a label must not place an audience camera at a made-up seat.
- Decode all seven retained assets using their actual field schemas (Kai Tak Y is tuple[11], not tier base). Verify hashes, preserve layouts and source provenance, reject duplicate identities as ambiguous.
- Load per-venue seat assets lazily. Resolve by venue + source layout + section + printed row + seat. Unknown layouts and seats must not silently choose another variant or a synthetic grid.
- Render source seats in 2D and 3D from the same coordinates. Use source stage geometry in the same coordinate frame; group tread strips by actual source row rather than generating a bowl over the seats.
- Keep source-coordinate fidelity separate from independent metric calibration, inventory completeness and commercial reuse rights. No calibration flag is promoted without holdout measurements.
- Regression checks: every retained tuple round-trips, Kai Tak height, ambiguous identities, layout isolation, unknown tickets, source stages and shared 2D/3D positions. Full suite and browser inspection after integration.

Western priority: official Tottenham planning drawings and published dimensions are being reviewed separately; no screen-to-metre or planning-to-as-built assumption will be introduced.
