export const DELIMITER = "---CASE_DELIMITER---";

export const DEFAULT_CODE_CPP = `// solution name
int solve() {
    return 0;
}`;

export const DEFAULT_CODE_C = `// solution name
int solve() {
    return 0;
}`;

export const STORAGE_KEYS = {
  TABS: "cp-tabs",
  ACTIVE_TAB: "cp-active-tab",
  THEME: "cp-theme",
  FONT_SIZE: "cp-font-size",
  EDITOR_WIDTH: "cp-editor-width",
  DOCS_VISIBLE: "cp-docs-visible",
  DOCS_HEIGHT: "cp-docs-height",
};

export const LANGUAGE_OPTIONS = [
  { id: "cpp", label: "C++", monacoId: "cpp" },
  { id: "c", label: "C", monacoId: "c" },
];

export const FONT_SIZE_RANGE = { min: 10, max: 24, default: 14 };

export const PISTON_CONFIG = {
  COMPILE_TIMEOUT: 10000,
  RUN_TIMEOUT: 5000,
  MEMORY_LIMIT: 268435456,
};
