import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			// 🚫 Chặn import tương đối sâu (từ 2 cấp trở lên)
			"no-restricted-imports": [
				"error",
				{
					patterns: ["../*/../*"],
					message: "Vui lòng sử dụng alias @/... thay vì import tương đối sâu.",
				},
			],
			// ✨ Ưu tiên sắp xếp các import rõ ràng
			"import/order": [
				"warn",
				{
					groups: [
						"builtin",
						"external",
						"internal",
						["parent", "sibling", "index"],
					],
					"newlines-between": "always",
					alphabetize: { order: "asc", caseInsensitive: true },
				},
			],
		},
	},
]);
