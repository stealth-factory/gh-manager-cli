## [1.53.4] - 2026-11-04

### Bug Fixes

- Dummy release bump to exercise pooled release (#180)

### CI

- **release**: Mint the org GitHub App token instead of the bot user PAT (#177)
- Pool releases behind a release pull request [semantic pr title] (#179)

### Dependencies

- **deps**: Pool safe dependency updates that supersede individual PRs, including the undici pin [semantic pr title] (#178)

## [1.53.3](https://github.com/stealth-factory/gh-manager-cli/compare/v1.53.2...v1.53.3) (2026-10-11)

### Bug Fixes

* **ci:** complete release assets before publishing (GMC-57) ([#175](https://github.com/stealth-factory/gh-manager-cli/issues/175)) ([04a9fc1](https://github.com/stealth-factory/gh-manager-cli/commit/04a9fc1e7457154f969f0903daa6dfdd741b4b2d))

## [1.53.2](https://github.com/stealth-factory/gh-manager-cli/compare/v1.53.1...v1.53.2) (2026-10-11)

### Bug Fixes

* **ci:** publish npm packages with OIDC (GMC-55) ([#172](https://github.com/stealth-factory/gh-manager-cli/issues/172)) ([06e07ef](https://github.com/stealth-factory/gh-manager-cli/commit/06e07efcf3217f73dc27591fba2301f7e5dd242d))
* migrate npm publication to stealth-factory (GMC-54) ([#164](https://github.com/stealth-factory/gh-manager-cli/issues/164)) ([4538e45](https://github.com/stealth-factory/gh-manager-cli/commit/4538e453ee20fa1aac8e1d8f6f8a35d033ee38ee))
* restore unscoped npm publication (GMC-56) ([#174](https://github.com/stealth-factory/gh-manager-cli/issues/174)) ([2127b10](https://github.com/stealth-factory/gh-manager-cli/commit/2127b10e0efc0d05ead26a33a722457163d19aad))

## [1.53.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.53.0...v1.53.1) (2026-08-13)

### Bug Fixes

* package standalone binaries against node22 (GMC-52) [semantic pr title] ([#152](https://github.com/wiiiimm/gh-manager-cli/issues/152)) ([a6be217](https://github.com/wiiiimm/gh-manager-cli/commit/a6be21738cd11ab4cd0b70cf51aaa4ca664991a6))

# [1.53.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.52.5...v1.53.0) (2026-08-13)

### Features

* toggle footer key reminders and invert bulk-select hint (GMC-50, GMC-51) ([#151](https://github.com/wiiiimm/gh-manager-cli/issues/151)) ([fe96ed4](https://github.com/wiiiimm/gh-manager-cli/commit/fe96ed49147cb531487ba570b2644e237827c03a)), closes [hi#value](https://github.com/hi/issues/value) [#150](https://github.com/wiiiimm/gh-manager-cli/issues/150)

## [1.52.5](https://github.com/wiiiimm/gh-manager-cli/compare/v1.52.4...v1.52.5) (2026-06-10)

### Bug Fixes

* set valid package-ecosystem in dependabot.yml (GMC-44) ([#115](https://github.com/wiiiimm/gh-manager-cli/issues/115)) ([28d059c](https://github.com/wiiiimm/gh-manager-cli/commit/28d059c3919659665a9f36da5aca81d55777d89a))

## [1.52.4](https://github.com/wiiiimm/gh-manager-cli/compare/v1.52.3...v1.52.4) (2026-06-10)

### Bug Fixes

* discard stale background fetch pages on org/scope switch (GMC-43) [semantic pr title] ([#112](https://github.com/wiiiimm/gh-manager-cli/issues/112)) ([3fd1c0a](https://github.com/wiiiimm/gh-manager-cli/commit/3fd1c0afaae07d7a2a217c7455848566203a3627))

## [1.52.3](https://github.com/wiiiimm/gh-manager-cli/compare/v1.52.2...v1.52.3) (2026-06-10)

### Bug Fixes

* loading dots trail the label like "Loading..." (GMC-41) ([#109](https://github.com/wiiiimm/gh-manager-cli/issues/109)) ([ec38397](https://github.com/wiiiimm/gh-manager-cli/commit/ec38397652de2207778385550c07406977574797))

## [1.52.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.52.1...v1.52.2) (2026-06-09)

### Bug Fixes

* expose the 'forks' option in the Sort modal (GMC-42) ([#108](https://github.com/wiiiimm/gh-manager-cli/issues/108)) ([d135dac](https://github.com/wiiiimm/gh-manager-cli/commit/d135dac93ea363f8cb9b949993fb9f3740c1a0c7))

## [1.52.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.52.0...v1.52.1) (2026-06-09)

### Bug Fixes

* lower default page size to 30 to avoid GitHub gateway timeouts (GMC-40) ([#106](https://github.com/wiiiimm/gh-manager-cli/issues/106)) ([101c16c](https://github.com/wiiiimm/gh-manager-cli/commit/101c16cb30e4c3c3cc3de9aaa1efe74fc6d14e95))

# [1.52.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.51.1...v1.52.0) (2026-06-08)

### Features

* transfer destination picker for single + bulk flows (SWR-381) [semantic pr title] ([#93](https://github.com/wiiiimm/gh-manager-cli/issues/93)) ([537bf60](https://github.com/wiiiimm/gh-manager-cli/commit/537bf605be1426d4846b1696ffebe362c4ee51e2))

## [1.51.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.51.0...v1.51.1) (2026-06-08)

### Performance Improvements

* swr-380 reduce ink loading flicker replace braille slowspinner with ([#94](https://github.com/wiiiimm/gh-manager-cli/issues/94)) ([71501df](https://github.com/wiiiimm/gh-manager-cli/commit/71501df06aa83c3bbf368b3ed40bc05844bfcfa8))

# [1.51.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.50.0...v1.51.0) (2026-06-08)

### Features

* add fork view filter and consolidate view filters into a single modal (SWR-379) [semantic pr title] ([#90](https://github.com/wiiiimm/gh-manager-cli/issues/90)) ([67f6892](https://github.com/wiiiimm/gh-manager-cli/commit/67f6892a55e18cb6c14e097b3181280791a50ba4))

# [1.50.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.49.3...v1.50.0) (2026-06-08)

### Features

* show open PR and issue counts inline on repo rows (SWR-357) ([#89](https://github.com/wiiiimm/gh-manager-cli/issues/89)) ([0488af3](https://github.com/wiiiimm/gh-manager-cli/commit/0488af3d4098f02c5b0d9beb9c72a521818195c3))

## [1.49.3](https://github.com/wiiiimm/gh-manager-cli/compare/v1.49.2...v1.49.3) (2026-06-08)

### Bug Fixes

* resolve all tsc --noEmit strict-type errors across the codebase (SWR-376) [semantic pr title] ([#86](https://github.com/wiiiimm/gh-manager-cli/issues/86)) ([e8de7db](https://github.com/wiiiimm/gh-manager-cli/commit/e8de7dbbb5794a9c0e79f850e0a31656c71bd521))

## [1.49.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.49.1...v1.49.2) (2026-06-08)

### Performance Improvements

* add daily tick to refresh stale relative date labels in RepoRow (SWR-377) ([#84](https://github.com/wiiiimm/gh-manager-cli/issues/84)) ([3aa8617](https://github.com/wiiiimm/gh-manager-cli/commit/3aa86170d9f5b9fd20fa27975d247f2e7e554925))

## [1.49.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.49.0...v1.49.1) (2026-06-08)

### Performance Improvements

* memoize RepoRow to cut per-keystroke re-renders (SWR-358) ([#57](https://github.com/wiiiimm/gh-manager-cli/issues/57)) ([0ad6685](https://github.com/wiiiimm/gh-manager-cli/commit/0ad66859eaa7bde1d596fc20c2974f0182c57fb4))

# [1.49.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.48.2...v1.49.0) (2026-06-08)

### Features

* redesign session usage summary as a distinct panel with time-saved estimate (SWR-375) ([#81](https://github.com/wiiiimm/gh-manager-cli/issues/81)) ([b18c5d5](https://github.com/wiiiimm/gh-manager-cli/commit/b18c5d54baaa9a3ee40e05b3eefce4eb4a686033))

## [1.48.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.48.1...v1.48.2) (2026-06-08)

### Bug Fixes

* correct Bulk Select layout overflow and show hidden selection count (SWR-370) [semantic pr title] ([#79](https://github.com/wiiiimm/gh-manager-cli/issues/79)) ([bfc211a](https://github.com/wiiiimm/gh-manager-cli/commit/bfc211ac4d79ec730ad5ec087617ce24826b93fd)), closes [#70](https://github.com/wiiiimm/gh-manager-cli/issues/70) [#58](https://github.com/wiiiimm/gh-manager-cli/issues/58) [#75](https://github.com/wiiiimm/gh-manager-cli/issues/75)

## [1.48.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.48.0...v1.48.1) (2026-06-07)

### Bug Fixes

* keep bulk review visibility badge inline with highlight background (SWR-374) [semantic pr title] ([#77](https://github.com/wiiiimm/gh-manager-cli/issues/77)) ([db85578](https://github.com/wiiiimm/gh-manager-cli/commit/db855789f2770fb41df99ebe056f9beb41521314))

# [1.48.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.47.0...v1.48.0) (2026-06-07)

### Features

* session usage summary shown on quit with operation tracking (SWR-19) [semantic pr title] ([#58](https://github.com/wiiiimm/gh-manager-cli/issues/58)) ([ad03cee](https://github.com/wiiiimm/gh-manager-cli/commit/ad03cee22f4699092892bc233786dd48f3eb8e21))

# [1.47.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.46.1...v1.47.0) (2026-06-07)

### Features

* bulk transfer (move) repos to another owner/org — Bulk Select action (SWR-369) [semantic pr title] ([#70](https://github.com/wiiiimm/gh-manager-cli/issues/70)) ([1dd444a](https://github.com/wiiiimm/gh-manager-cli/commit/1dd444a32e7ffc1492320d80197c089d845352a5))

## [1.46.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.46.0...v1.46.1) (2026-06-07)

### Performance Improvements

* make visibility filter fully client-side (SWR-366) [semantic pr title] ([#61](https://github.com/wiiiimm/gh-manager-cli/issues/61)) ([02c6064](https://github.com/wiiiimm/gh-manager-cli/commit/02c6064dbb2854a943f0580297661589dabc9545))

# [1.46.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.45.1...v1.46.0) (2026-06-07)

### Features

* Bulk Select mode with bulk star, archive/unarchive, visibility, and delete operations (SWR-353) ([#54](https://github.com/wiiiimm/gh-manager-cli/issues/54)) ([9245324](https://github.com/wiiiimm/gh-manager-cli/commit/924532494c7222393415bea14bf5553435c2abb2))

## [1.45.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.45.0...v1.45.1) (2026-06-07)

### Bug Fixes

* ignore modal input while async actions are in flight, add guard tests (SWR-368) [semantic pr title] ([#64](https://github.com/wiiiimm/gh-manager-cli/issues/64)) ([97d2e4e](https://github.com/wiiiimm/gh-manager-cli/commit/97d2e4e25fc5d10cd2305ffb3f594b3f0b094e20)), closes [#65](https://github.com/wiiiimm/gh-manager-cli/issues/65)

# [1.45.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.44.0...v1.45.0) (2026-06-07)

### Features

* add repository creation (Ctrl+N) and transfer (Shift+M) ([#60](https://github.com/wiiiimm/gh-manager-cli/issues/60)) ([2e9c271](https://github.com/wiiiimm/gh-manager-cli/commit/2e9c2711b985be9373a94483e0bd0b420dc48aec))

# [1.43.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.42.0...v1.43.0) (2026-06-05)

### Features

* fork ahead/behind enrichment, jump-to-upstream (P), and open-in-browser chooser (SWR-362) [semantic pr title] ([#53](https://github.com/wiiiimm/gh-manager-cli/issues/53)) ([ffd7b16](https://github.com/wiiiimm/gh-manager-cli/commit/ffd7b1644f7fad93721b6ab7287c0c3a1990f9e6))

# [1.42.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.41.0...v1.42.0) (2026-06-05)

### Features

* fuzzy repository search over full cached set (SWR-361) [semantic pr title] ([#55](https://github.com/wiiiimm/gh-manager-cli/issues/55)) ([042999d](https://github.com/wiiiimm/gh-manager-cli/commit/042999da6de2ce6b2688da84a3a4d698e0f7d16d))

# [1.41.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.40.2...v1.41.0) (2026-06-05)

### Features

* colour themes with Shift+T cycle keybinding and persisted preference (SWR-354) [semantic pr title] ([#56](https://github.com/wiiiimm/gh-manager-cli/issues/56)) ([1a307c6](https://github.com/wiiiimm/gh-manager-cli/commit/1a307c6a8442a0d295f8a92aeb98eb544eb80d51))

## [1.40.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.40.1...v1.40.2) (2026-06-05)

### Bug Fixes

* stars toggle footer hint truncation and contextual labels (SWR-359) ([#52](https://github.com/wiiiimm/gh-manager-cli/issues/52)) ([f19ca6f](https://github.com/wiiiimm/gh-manager-cli/commit/f19ca6f4ba81b71133ddc7e5e98df67191d348b0))

## [1.40.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.40.0...v1.40.1) (2026-06-05)

### Bug Fixes

* fill compact mode view with actual per-row heights [semantic pr title] ([#47](https://github.com/wiiiimm/gh-manager-cli/issues/47)) ([23de03f](https://github.com/wiiiimm/gh-manager-cli/commit/23de03f3df240bcebc3ac764a1bf76ab8b553c68))

# [1.40.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.39.1...v1.40.0) (2026-06-05)

### Features

* background fetch-all pagination with light bulk query ([#50](https://github.com/wiiiimm/gh-manager-cli/issues/50)) ([932deb8](https://github.com/wiiiimm/gh-manager-cli/commit/932deb85736bf999bde3c6f4d9bab02aaece8610))

## [1.39.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.39.0...v1.39.1) (2026-06-05)

### Bug Fixes

* restore changelog body in GitHub release notes [semantic pr title] ([#46](https://github.com/wiiiimm/gh-manager-cli/issues/46)) ([62e20ad](https://github.com/wiiiimm/gh-manager-cli/commit/62e20ad795abb38cc370e25738182a1ba99fd6f7))

# [1.39.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.38.1...v1.39.0) (2026-06-05)

### Features

* replace archive filter cycle with popup modal (A Archive Filter) ([#45](https://github.com/wiiiimm/gh-manager-cli/issues/45)) ([9299443](https://github.com/wiiiimm/gh-manager-cli/commit/92994433291bf196b6882c27409aa5ec49be0b35))

## [1.38.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.38.0...v1.38.1) (2026-06-05)

### Bug Fixes

* add archive filter toggle for repositories [semantic pr title] ([#43](https://github.com/wiiiimm/gh-manager-cli/issues/43)) ([3b717a3](https://github.com/wiiiimm/gh-manager-cli/commit/3b717a345c6104a6b59e530eb7688bac9d8276ee))

# [1.38.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.37.0...v1.38.0) (2025-09-09)

### Features

* add GitHub Sponsors integration ([b73a8c2](https://github.com/wiiiimm/gh-manager-cli/commit/b73a8c244aa6a336b249bc573a019c307b56bfc5))

# [1.37.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.36.0...v1.37.0) (2025-09-09)

### Features

* add comprehensive environment variable documentation ([0493cf7](https://github.com/wiiiimm/gh-manager-cli/commit/0493cf7e1520609d4afffc4441021bc5b01194e3))

# [1.36.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.35.1...v1.36.0) (2025-09-09)

### Features

* add GitHub release creation to workflow ([7f06bb1](https://github.com/wiiiimm/gh-manager-cli/commit/7f06bb1cdc5043dbf88ddf342c4c4b5359a41431))

## [1.35.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.35.0...v1.35.1) (2025-09-09)

### Bug Fixes

* restructure workflow to build after version commit ([0fcba46](https://github.com/wiiiimm/gh-manager-cli/commit/0fcba46039982209e78bab285e205adc96e27c9e))

# [1.35.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.34.0...v1.35.0) (2025-09-09)

### Bug Fixes

* add npm authentication configuration for semantic-release ([d2d5ad0](https://github.com/wiiiimm/gh-manager-cli/commit/d2d5ad0555063d7e949450ff4a923c78d8a305f5))
* ensure build job fetches updated version from semantic-release ([e8df4ec](https://github.com/wiiiimm/gh-manager-cli/commit/e8df4ec6a3e76c32168803f40a404567a979b530))
* optimize release workflow to check before building ([5027d45](https://github.com/wiiiimm/gh-manager-cli/commit/5027d45ac564752a7557ee01e9529f9559d09a44))
* resolve PR Title Manager workflow script loading issue ([5764938](https://github.com/wiiiimm/gh-manager-cli/commit/5764938c00ccaa524ebfac5e6e94ae64254195ab))
* resolve Windows build failure in release pipeline ([708c0d3](https://github.com/wiiiimm/gh-manager-cli/commit/708c0d321b628ab95ca7b03ca07371059a7a19f1))
* restore original workflow behavior for release pipeline ([2781719](https://github.com/wiiiimm/gh-manager-cli/commit/278171954e05048374cb756e6a242385c062c863))
* use --config flag to fully override semantic-release config ([b233b58](https://github.com/wiiiimm/gh-manager-cli/commit/b233b583035e4e078f027147ca1dfb70c472be1f))
* use minimal config for semantic-release dry-run check ([830d058](https://github.com/wiiiimm/gh-manager-cli/commit/830d0585a24942d1bee66aab55daa9770a0af0bb))

### Features

* add stars mode and star/unstar functionality ([#29](https://github.com/wiiiimm/gh-manager-cli/issues/29)) ([9295dcb](https://github.com/wiiiimm/gh-manager-cli/commit/9295dcb4508bf46d9dff0ffdfbcac35c40d8f994))

# [1.34.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.33.0...v1.34.0) (2025-09-06)

### Features

* add in-app sponsorship prompts and reminders ([#28](https://github.com/wiiiimm/gh-manager-cli/issues/28)) ([443aa4b](https://github.com/wiiiimm/gh-manager-cli/commit/443aa4bcaf2eb18dc4d4abef1ebe3f14652912bd))

# [1.33.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.32.0...v1.33.0) (2025-09-06)

### Features

* add Buy Me a Coffee sponsorship support ([#27](https://github.com/wiiiimm/gh-manager-cli/issues/27)) ([76ed5dd](https://github.com/wiiiimm/gh-manager-cli/commit/76ed5ddf8a6ec4dd5c2110250858967e7f63b96f))

# [1.32.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.31.2...v1.32.0) (2025-09-05)

### Bug Fixes

* ensure processPRTitle function is always exported in workflow script ([8056aa3](https://github.com/wiiiimm/gh-manager-cli/commit/8056aa399ef22d020f5e7d99253b4613a204236c))

### Features

* Add sort direction modal for improved UX ([#26](https://github.com/wiiiimm/gh-manager-cli/issues/26)) ([5209252](https://github.com/wiiiimm/gh-manager-cli/commit/520925241a325a6205378746964c0bd58d2640af))

## [1.31.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.31.1...v1.31.2) (2025-09-05)

### Bug Fixes

* increase repository container height by 30% for better visibility ([2ce8f8d](https://github.com/wiiiimm/gh-manager-cli/commit/2ce8f8d017c70fd90a595804277a6d900f539b7d))

## [1.31.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.31.0...v1.31.1) (2025-09-05)

### Bug Fixes

* correct YAML syntax for conditional expressions in workflows ([c2faf29](https://github.com/wiiiimm/gh-manager-cli/commit/c2faf29932582d8ab9c438c6bcc4f52ccb67eacb))

# [1.31.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.30.0...v1.31.0) (2025-09-05)

### Bug Fixes

* prevent workflow loops on automated release commits ([51b1cf8](https://github.com/wiiiimm/gh-manager-cli/commit/51b1cf821703d504d83d458bf441ec5e6ccb5f48))

### Features

* add GitHub sponsorship support with comprehensive platform documentation ([8b4dfcc](https://github.com/wiiiimm/gh-manager-cli/commit/8b4dfcc85bbb735584adf32b0463a93a246dce35))
* initial setup for GitHub sponsorship feature branch ([749f41d](https://github.com/wiiiimm/gh-manager-cli/commit/749f41d81cf9bff640a7e384a8cd238e627c5c40))

# [1.30.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.29.0...v1.30.0) (2025-09-05)

### Features

* add workflow to auto-release on any version change ([f89c237](https://github.com/wiiiimm/gh-manager-cli/commit/f89c2378c6427fb3762e160294ddd0681d29ea80))

# [1.29.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.28.0...v1.29.0) (2025-09-05)

### Features

* enhance messaging to position as GitHub web UI alternative ([5c4a802](https://github.com/wiiiimm/gh-manager-cli/commit/5c4a80252848dd1f85604c5fae9ec1f2945e1e9b))

# [1.28.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.27.0...v1.28.0) (2025-09-05)

### Features

* replace all logos with green monochrome versions ([e01e4e8](https://github.com/wiiiimm/gh-manager-cli/commit/e01e4e865307223d609b63bb0bae874d18d9c92f)), closes [#22c55](https://github.com/wiiiimm/gh-manager-cli/issues/22c55)

# [1.27.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.26.0...v1.27.0) (2025-09-05)

### Features

* add PNG versions of green logo-mark ([7e10efe](https://github.com/wiiiimm/gh-manager-cli/commit/7e10efe5a410f8de2723c7c6c1de5f13edb9d8a0))

# [1.26.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.25.1...v1.26.0) (2025-09-05)

### Features

* add green monochrome logo-mark variant ([ec31eeb](https://github.com/wiiiimm/gh-manager-cli/commit/ec31eeb52f6af564568fe4346cd22085a39460fa)), closes [#22c55](https://github.com/wiiiimm/gh-manager-cli/issues/22c55)

## [1.25.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.25.0...v1.25.1) (2025-09-05)

### Bug Fixes

* slow down OAuth loading spinner to update every 2 seconds ([bb2b9f0](https://github.com/wiiiimm/gh-manager-cli/commit/bb2b9f04f3410f5870884a3db74246ad4b8110bd))

# [1.25.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.24.3...v1.25.0) (2025-09-05)

### Features

* update demo assets and documentation ([84242cc](https://github.com/wiiiimm/gh-manager-cli/commit/84242cc1cb14d58d5f8777e8d2ca20fb158839cb))

## [1.24.3](https://github.com/wiiiimm/gh-manager-cli/compare/v1.24.2...v1.24.3) (2025-09-05)

### Bug Fixes

* clear all settings including org context on logout ([3a30b02](https://github.com/wiiiimm/gh-manager-cli/commit/3a30b0246d410b14bf9d9b5681904660cf7cc80f))

## [1.24.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.24.1...v1.24.2) (2025-09-05)

### Bug Fixes

* prevent Ctrl+R from triggering refresh instead of rename ([987f505](https://github.com/wiiiimm/gh-manager-cli/commit/987f505ada3c2b17175e24cace81330ea8db9709))

## [1.24.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.24.0...v1.24.1) (2025-09-05)

### Bug Fixes

* restore accidentally deleted features from refactor ([bcc9f12](https://github.com/wiiiimm/gh-manager-cli/commit/bcc9f123cba0abe274a1351168bfc5583cc9382f))

# [1.24.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.23.0...v1.24.0) (2025-09-05)

### Features

* add app name with version to --help output ([3376c48](https://github.com/wiiiimm/gh-manager-cli/commit/3376c480186c506f125a62ab444f3e3d321ba82c))

# [1.23.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.22.0...v1.23.0) (2025-09-04)

### Features

* Enhanced rate limit display showing both GraphQL and REST API limits ([#25](https://github.com/wiiiimm/gh-manager-cli/issues/25)) ([1220a0f](https://github.com/wiiiimm/gh-manager-cli/commit/1220a0fe04da035dafab2ce8555a73ff95b96ea1))

## [1.19.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.19.1...v1.19.2) (2025-09-03)

### Bug Fixes

* clear search filter when switching organization context ([a5df0bf](https://github.com/wiiiimm/gh-manager-cli/commit/a5df0bf5f23e08019bd5225d847d68288a62a74f))

## [1.19.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.19.0...v1.19.1) (2025-09-02)

### Bug Fixes

* clear repository list immediately on context switch ([73c75af](https://github.com/wiiiimm/gh-manager-cli/commit/73c75afd725fa2640acc03e8381c4bc0598c6bf1))

# [1.19.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.18.1...v1.19.0) (2025-09-02)

### Features

* **cli:** add org (-o) and token (-t) flags ([#18](https://github.com/wiiiimm/gh-manager-cli/issues/18)) ([029376e](https://github.com/wiiiimm/gh-manager-cli/commit/029376e1465eb9376850c6e19ef2b514020a4542))

## [1.18.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.18.0...v1.18.1) (2025-09-02)

### Bug Fixes

* handle both CommonJS and ES module contexts in normalize-pr-title.js ([b547877](https://github.com/wiiiimm/gh-manager-cli/commit/b547877c254fbfa0f644b271fa2f367b668838d4))

# [1.18.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.17.1...v1.18.0) (2025-09-02)

### Features

* **workflows:** add missing normalize-pr-title.js script for PR title automation ([3a009b9](https://github.com/wiiiimm/gh-manager-cli/commit/3a009b979c9dbee7c2f7649ff71ecb385e917a6d))

## [1.17.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.17.0...v1.17.1) (2025-09-02)

### Bug Fixes

* correct workflow syntax for GH_TOKEN check ([e9980a6](https://github.com/wiiiimm/gh-manager-cli/commit/e9980a69e15d1b74831cf95fe01985e052996489))
* make Homebrew tap update conditional on GH_TOKEN availability ([cbbe500](https://github.com/wiiiimm/gh-manager-cli/commit/cbbe5005d767ecbe1139f7ac1b603b41d157a060))

# [1.17.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.16.1...v1.17.0) (2025-09-02)

### Features

* implement comprehensive logging system ([#17](https://github.com/wiiiimm/gh-manager-cli/issues/17)) ([a447ce1](https://github.com/wiiiimm/gh-manager-cli/commit/a447ce1287be86ce20830ddd96fa9d20ae22743e))

## [1.16.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.16.0...v1.16.1) (2025-09-02)

### Bug Fixes

* add missing hasInternalRepos state variable ([#16](https://github.com/wiiiimm/gh-manager-cli/issues/16)) ([e3bcc84](https://github.com/wiiiimm/gh-manager-cli/commit/e3bcc843b82259bafbac34726fda2113c66f874c))

# [1.16.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.15.1...v1.16.0) (2025-09-02)

### Features

* add Ctrl+L logout option to error state ([#14](https://github.com/wiiiimm/gh-manager-cli/issues/14)) ([1a15028](https://github.com/wiiiimm/gh-manager-cli/commit/1a15028cc8f1a2bf39054f65b09d0ade7be1de0f))

## [1.15.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.15.0...v1.15.1) (2025-09-02)

### Bug Fixes

* standardise keyboard shortcut capitalisation in error messages ([44d7998](https://github.com/wiiiimm/gh-manager-cli/commit/44d7998f3bad752a18c2a54c0adef18b69f9ecca))

# [1.15.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.14.0...v1.15.0) (2025-09-02)

### Features

* implement GitHub Device Authorization Grant flow ([#13](https://github.com/wiiiimm/gh-manager-cli/issues/13)) ([d259534](https://github.com/wiiiimm/gh-manager-cli/commit/d259534a8a0e5c21270da17df4256aec6b0b216c))

# [1.14.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.13.2...v1.14.0) (2025-09-02)

### Bug Fixes

* correct TextInput import from ink-text-input package ([1040eca](https://github.com/wiiiimm/gh-manager-cli/commit/1040ecac07b0976eaf916ee5593d0bc867590eda))
* update both visibility and isPrivate fields when changing visibility ([4b96234](https://github.com/wiiiimm/gh-manager-cli/commit/4b962345a1e490b3a675575c8726e7040e0c0ed3))
* use REST API for changing repository visibility ([0bd1475](https://github.com/wiiiimm/gh-manager-cli/commit/0bd1475f22d5802d919491ad507d4b38f158da5e))

### Features

* add enterprise support with Internal visibility and Ctrl+V visibility change ([9f457af](https://github.com/wiiiimm/gh-manager-cli/commit/9f457af4558458a23f321c14b42f0701fefecc0f))
* add repository visibility change with Ctrl+V ([d51b5e8](https://github.com/wiiiimm/gh-manager-cli/commit/d51b5e8b28c78f6ba58056a3254fc1aa218d9838))
* add support for Internal visibility in enterprise accounts ([781575a](https://github.com/wiiiimm/gh-manager-cli/commit/781575aee55a70f869aad7d724fd50b6bd052221))
* respect visibility filter when changing repository visibility ([25c963c](https://github.com/wiiiimm/gh-manager-cli/commit/25c963ca89038c84e0c8711f69d71785eb3a7355))

## [1.13.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.13.1...v1.13.2) (2025-09-01)

### Bug Fixes

* add authentication to Homebrew tap update in workflow ([31ec056](https://github.com/wiiiimm/gh-manager-cli/commit/31ec056a95bfbd696d8bb4d884fee0213c52257a))

## [1.13.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.13.0...v1.13.1) (2025-09-01)

### Bug Fixes

* **auth,keyboard,ux:** retry + cancel flow on rate-limit; shared logout; cache info key = K ([#11](https://github.com/wiiiimm/gh-manager-cli/issues/11)) ([bcbd2fc](https://github.com/wiiiimm/gh-manager-cli/commit/bcbd2fcdb929a9354e3e307f960da4ae06fbbe61))

# [1.13.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.12.0...v1.13.0) (2025-09-01)

### Features

* add Homebrew tap support and CLI flags ([#10](https://github.com/wiiiimm/gh-manager-cli/issues/10)) ([bba6c38](https://github.com/wiiiimm/gh-manager-cli/commit/bba6c38b5c1bd01b8a01d87b8e2910d3523dd776))

# [1.12.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.11.1...v1.12.0) (2025-09-01)

### Features

* **homebrew:** packaging plan for submission to homebrew-core ([#9](https://github.com/wiiiimm/gh-manager-cli/issues/9)) ([f1d306a](https://github.com/wiiiimm/gh-manager-cli/commit/f1d306a321ba577cf8f3ea7c1a2090dbf8c8dfc4))

## [1.11.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.11.0...v1.11.1) (2025-09-01)

### Bug Fixes

* handle require not defined error in GitHub Actions script ([49db95b](https://github.com/wiiiimm/gh-manager-cli/commit/49db95b8f69acbeb075190d81d7d5dcd6dc2991e))

# [1.11.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.10.6...v1.11.0) (2025-09-01)

### Features

* add modal-based visibility filtering and sort selection ([1c72224](https://github.com/wiiiimm/gh-manager-cli/commit/1c72224b4854f69481bb21f089a926dc2c18e53f))

## [1.10.6](https://github.com/wiiiimm/gh-manager-cli/compare/v1.10.5...v1.10.6) (2025-09-01)

### Bug Fixes

* clear token input field after logout and successful login ([243d963](https://github.com/wiiiimm/gh-manager-cli/commit/243d963a8603580c921d01c8380a23c0e511c113))

## [1.10.5](https://github.com/wiiiimm/gh-manager-cli/compare/v1.10.4...v1.10.5) (2025-09-01)

### Bug Fixes

* prevent duplicate modal handlers and improve modal UI ([79281d3](https://github.com/wiiiimm/gh-manager-cli/commit/79281d34fe42d3345885cad257e6800e94eb2bb3))

## [1.10.4](https://github.com/wiiiimm/gh-manager-cli/compare/v1.10.3...v1.10.4) (2025-09-01)

### Bug Fixes

* eliminate duplicate sync handler to prevent double execution ([bf838b6](https://github.com/wiiiimm/gh-manager-cli/commit/bf838b66f5c8b7def294d3835278cd32254bce1f))

## [1.10.3](https://github.com/wiiiimm/gh-manager-cli/compare/v1.10.2...v1.10.3) (2025-09-01)

### Performance Improvements

* optimize sync operation to update locally without API call ([b851c85](https://github.com/wiiiimm/gh-manager-cli/commit/b851c854a277b53f908e92d330622c4513642600))

## [1.10.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.10.1...v1.10.2) (2025-09-01)

### Bug Fixes

* handle GitHub API 422 status for sync-upstream as potential success ([9a13e8a](https://github.com/wiiiimm/gh-manager-cli/commit/9a13e8a76d4ed09eb7af18b5b8de9e0f2d4c978f))

## [1.10.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.10.0...v1.10.1) (2025-09-01)

### Bug Fixes

* keep sync and delete modals open on error for better UX ([1823076](https://github.com/wiiiimm/gh-manager-cli/commit/1823076bdd74c2cb50591d9133eabe4a96927cea))

# [1.10.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.9.0...v1.10.0) (2025-09-01)

### Features

* sync repository actions with Apollo cache and improve info view ([563d04a](https://github.com/wiiiimm/gh-manager-cli/commit/563d04a4ec931c27dff204d3b5e6e770e4b482e6))

# [1.9.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.8.2...v1.9.0) (2025-09-01)

### Features

* refetch repository data after sync to update timestamps ([b26468d](https://github.com/wiiiimm/gh-manager-cli/commit/b26468de5c3c12e04199f13de1958acd725fd239))

## [1.8.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.8.1...v1.8.2) (2025-09-01)

### Bug Fixes

* update search results when performing repository actions ([f4edb65](https://github.com/wiiiimm/gh-manager-cli/commit/f4edb65d84501f894dcc012bc6bf6b7495ec0902))

## [1.8.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.8.0...v1.8.1) (2025-09-01)

### Bug Fixes

* prevent duplicate npm publishing when version hasn't changed ([ff0b37b](https://github.com/wiiiimm/gh-manager-cli/commit/ff0b37b99c4232fa2d179a9becf6e314cc218d55))

# [1.8.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.7.0...v1.8.0) (2025-08-31)

### Features

* implement organization support feature ([#1](https://github.com/wiiiimm/gh-manager-cli/issues/1)) ([5a404b2](https://github.com/wiiiimm/gh-manager-cli/commit/5a404b29cdd3a30bd12b59438e0c3fd978da93b9))

# [1.7.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.6.2...v1.7.0) (2025-08-31)

### Features

* implement smarter infinite scroll prefetch trigger at 80% ([d124b94](https://github.com/wiiiimm/gh-manager-cli/commit/d124b9483196fe703ccffaea1ffdecef9cca31a5))

## [1.6.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.6.1...v1.6.2) (2025-08-31)

### Bug Fixes

* resolve ES module import issues and improve search UX ([2a08c6b](https://github.com/wiiiimm/gh-manager-cli/commit/2a08c6b557c5a00e1005136074273e38c817a4c3))

## [1.6.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.6.0...v1.6.1) (2025-08-31)

### Bug Fixes

* correct GitHub Packages publishing in workflow ([191fcd5](https://github.com/wiiiimm/gh-manager-cli/commit/191fcd503389cb09774305ebde58481cccc9e518))

# [1.6.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.5.0...v1.6.0) (2025-08-31)

### Bug Fixes

* make cache inspection visible in terminal ([2030466](https://github.com/wiiiimm/gh-manager-cli/commit/2030466e1b2bf377a22e07eba5a0334b9c3a6bc5))

### Features

* add Apollo cache debugging and verification tools ([e4828c4](https://github.com/wiiiimm/gh-manager-cli/commit/e4828c4463b6ebb58f419f6e6e17c06c699b31ac))
* add cache testing scripts and environment template ([2b4d840](https://github.com/wiiiimm/gh-manager-cli/commit/2b4d840f0a32a4089c47bca9664ac393e824643a))
* add repository info modal and always-on Apollo cache ([aecfd31](https://github.com/wiiiimm/gh-manager-cli/commit/aecfd311feaf5e674d2f8f15062f12d6deffcfe5))

# [1.5.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.4.2...v1.5.0) (2025-08-31)

### Features

* add fork sync functionality and update documentation ([1d37a10](https://github.com/wiiiimm/gh-manager-cli/commit/1d37a10d90636731c436679b0a4ff2d1c3e1daae))

## [1.4.2](https://github.com/wiiiimm/gh-manager-cli/compare/v1.4.1...v1.4.2) (2025-08-31)

### Bug Fixes

* add packages permission and improve GitHub Packages publishing with jq ([2346944](https://github.com/wiiiimm/gh-manager-cli/commit/2346944739f70d237240c6d67ae39c32d1d623d5))

## [1.4.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.4.0...v1.4.1) (2025-08-31)

### Bug Fixes

* correct GitHub Packages publishing step ([6a8122a](https://github.com/wiiiimm/gh-manager-cli/commit/6a8122ad32308cbd8e3cbf07176608fe3639887d))

# [1.4.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.3.0...v1.4.0) (2025-08-31)

### Features

* add GitHub Packages publishing to release workflow ([0cc2052](https://github.com/wiiiimm/gh-manager-cli/commit/0cc2052591d01717fbdaf7d844f2b210c3013341))

# [1.3.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.2.0...v1.3.0) (2025-08-31)

### Features

* **auth:** add Logout modal (Ctrl+L) with confirm/cancel; return to Authentication Required on confirm; fix modalOpen; center footer; clarify fork metric labels; refine key handling (case-insensitive, Ctrl+G/G separation); clear screen on quit; set page size to 5 (dev)/15 (prod) ([7a6a0fb](https://github.com/wiiiimm/gh-manager-cli/commit/7a6a0fb8767986b8640371e483f0fc5a084e75a2))

# [1.2.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.1.1...v1.2.0) (2025-08-31)

### Features

* add npx support as primary installation method ([eeae1c8](https://github.com/wiiiimm/gh-manager-cli/commit/eeae1c8e60f0b4bd1f3076a16b65aec01cf5afdf))
* re-enable NPM publishing and update installation docs ([e6d5cff](https://github.com/wiiiimm/gh-manager-cli/commit/e6d5cffc64678899ecc89cf294c4413fab4cdf66))

## [1.1.1](https://github.com/wiiiimm/gh-manager-cli/compare/v1.1.0...v1.1.1) (2025-08-31)

### Bug Fixes

* temporarily disable NPM publishing due to 2FA requirement ([2ab09ca](https://github.com/wiiiimm/gh-manager-cli/commit/2ab09ca8d543c771f97c999ad6beb6ebf36747be))

# [1.1.0](https://github.com/wiiiimm/gh-manager-cli/compare/v1.0.0...v1.1.0) (2025-08-31)

### Features

* re-enable NPM publishing with NPM_TOKEN configured ([a0c3520](https://github.com/wiiiimm/gh-manager-cli/commit/a0c3520ca53092941d4a761d6f94a66a500753dd))

# 1.0.0 (2025-08-31)

### Bug Fixes

* **delete:** use GitHub REST API DELETE /repos/{owner}/{repo} with token; update UI and docs accordingly ([e921ab9](https://github.com/wiiiimm/gh-manager-cli/commit/e921ab9917e27d368fc73f326bbe98081386ca18))
* resolve pnpm lockfile compatibility in CI workflow ([ece890f](https://github.com/wiiiimm/gh-manager-cli/commit/ece890f9b8d1b0c91dcb8cf1ab9275537483ea4f))
* update GitHub Actions workflow to use pnpm instead of npm ([42a0269](https://github.com/wiiiimm/gh-manager-cli/commit/42a02698d1490cf9f562633eddca86f0c54d10a3))
* update pkg targets to use node18 instead of node20 ([6302567](https://github.com/wiiiimm/gh-manager-cli/commit/6302567f15076e177dbad875f87c363ea5679486))

### Features

* add fork sync, improved error handling, and UI enhancements ([165e03e](https://github.com/wiiiimm/gh-manager-cli/commit/165e03e983feb15f2d08301b59d125717b3ba937))
* add logout functionality with Ctrl+L shortcut ([f51c8b8](https://github.com/wiiiimm/gh-manager-cli/commit/f51c8b85c8890b063812a734a9c01651478fa4e2))
* add repository visibility toggle TODO item ([0b42fa0](https://github.com/wiiiimm/gh-manager-cli/commit/0b42fa04721209add85dc2dca4339ed5b1ffd79e))
* add server-side sorting and loading screens ([a082410](https://github.com/wiiiimm/gh-manager-cli/commit/a082410dcbd7125957b0fa9b3982d29eed53317a))
* complete fork tracking system with comprehensive improvements ([4621e10](https://github.com/wiiiimm/gh-manager-cli/commit/4621e1025d603acf14defb031c4d36de21c11846))
* disable NPM publishing temporarily to focus on binary releases ([df7718d](https://github.com/wiiiimm/gh-manager-cli/commit/df7718d324ec52e244b9176101aedc5f56a5a22d))
* implement automated release workflow with compiled binaries ([195ca17](https://github.com/wiiiimm/gh-manager-cli/commit/195ca174857eeef9ce08b6bbfce03ab61f185aa8))
* initial commit with semantic release setup ([62c4919](https://github.com/wiiiimm/gh-manager-cli/commit/62c4919c1c9061f7a5153c2a363398c9d571e9db))
* **prefs:** persist UI preferences (s/d/t) in config; load on startup ([bba426a](https://github.com/wiiiimm/gh-manager-cli/commit/bba426a0321e652d74c0dd5d340ff26cc3b98283))
* **ui:** add Delete Confirmation title and side-by-side buttons with shortcut hints in modal ([2073fd2](https://github.com/wiiiimm/gh-manager-cli/commit/2073fd277506c6f802c1dd46142900597a16c3f1))
* **ui:** centered delete modal with dimmed list (B-center); increase padding; show confirmation code as placeholder ([04434ba](https://github.com/wiiiimm/gh-manager-cli/commit/04434ba92ad621b1c68985bf3a61e3094f21aa5d))
* **ui:** density toggle, delete modal with 2-step confirm, centered modal; docs and TODOs updates; dim UI during modal ([27f90c7](https://github.com/wiiiimm/gh-manager-cli/commit/27f90c7e7ba096798bb0b930a3cf707f04218671))

### Performance Improvements

* reduce production page size from 25 to 15 ([168c79a](https://github.com/wiiiimm/gh-manager-cli/commit/168c79a0b69704c7c29fb8c95e039127e9b50d6d))
